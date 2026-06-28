# Authentication Flows

End-to-end auth design across the Next.js client and the Express server.
Open this in VS Code's Markdown preview (`Ctrl+Shift+V`) to render the diagrams.

## Token model at a glance

| Token | Lifetime | Stored where | Readable by JS? | Purpose |
|-------|----------|--------------|-----------------|---------|
| **Access token** | 15 min | zustand store (memory only) | yes | Sent as `Authorization: Bearer` on every request |
| **Refresh token** | 7 days | httpOnly cookie **+** `auth_sessions` row | no (httpOnly) | Mints new access tokens; rotated on each use |

Key idea: the cookie alone isn't enough — refresh is **stateful**, so a refresh
token only works while a matching `auth_sessions` row exists. That row is what
makes logout and revocation real.

---

## 1. Component map

```mermaid
flowchart LR
  subgraph Client["Next.js client"]
    Pages["login / signup pages<br/>(react-hook-form)"]
    Hooks["useLogin / useSignup / useLogout<br/>(react-query)"]
    Store["zustand auth store<br/>user, accessToken, isAuthReady"]
    Boot["AuthBootstrap<br/>(runs once on load)"]
    Axios["axios instance<br/>+ request interceptor (attach token)<br/>+ response interceptor (401 -> refresh)"]
  end

  subgraph Server["Express server (/api/auth)"]
    MW["authMiddleware<br/>(verifies access token)"]
    Ctrl["controllers<br/>login/register/refresh/logout"]
    Svc["auth.service<br/>rotateSession / logoutSession"]
    DB[("auth_sessions<br/>+ users")]
    Cookie{{"httpOnly refreshToken cookie"}}
  end

  Pages --> Hooks --> Axios
  Boot --> Axios
  Axios <--> Store
  Axios -->|Bearer access token| MW
  Axios -->|cookie| Cookie
  MW --> Ctrl
  Ctrl --> Svc --> DB
  Ctrl --> Cookie
```

---

## 2. Signup  →  `POST /api/auth/register`

```mermaid
sequenceDiagram
  participant U as User
  participant F as Signup page + useSignup
  participant A as axios
  participant S as Server
  participant DB as auth_sessions

  U->>F: submit name, email, password
  F->>F: react-hook-form validation (pw >= 8, match)
  F->>A: POST /auth/register {name, email, password}
  A->>S: (withCredentials)
  S->>S: registerBodySchema.parse() / hash password
  S->>DB: INSERT user + INSERT session(refreshToken)
  S-->>A: 201 {data:{accessToken, user}} + Set-Cookie refreshToken
  A-->>F: data.data
  F->>F: store.setSession({user, accessToken})
  F->>U: router.push("/practice")
```

> `name` is validated but **not persisted** — the `users` table has no name column yet.

---

## 3. Login  →  `POST /api/auth/login`

```mermaid
sequenceDiagram
  participant U as User
  participant F as Login page + useLogin
  participant A as axios
  participant S as Server
  participant DB as auth_sessions

  U->>F: submit email, password
  F->>A: POST /auth/login {email, password}
  A->>S: (withCredentials)
  S->>DB: find user, bcrypt.compare
  alt credentials valid
    S->>DB: INSERT session(refreshToken)
    S-->>A: 200 {data:{accessToken, user}} + Set-Cookie refreshToken
    A-->>F: store.setSession(...) -> push("/practice")
  else invalid
    S-->>A: 401 {message:"Invalid credentials"}
    A-->>F: login.isError -> show readError(...)
  end
```

---

## 4. Protected request with a VALID access token

```mermaid
sequenceDiagram
  participant C as Component
  participant A as axios
  participant RI as request interceptor
  participant S as Server
  participant MW as authMiddleware

  C->>A: api.get("/problems")
  A->>RI: attach Authorization from store.accessToken
  RI->>S: GET /problems  (Bearer <token>)
  S->>MW: verify token (JWT_SECRET)
  MW-->>S: ok, req.user = payload
  S-->>A: 200 data
  A-->>C: data
```

The request interceptor attaches the token automatically — call sites never set the header.

---

## 5. Protected request with an EXPIRED access token (auto-refresh + retry)

This is the response interceptor doing its job transparently.

```mermaid
sequenceDiagram
  participant C as Component
  participant A as axios
  participant RespI as response interceptor
  participant S as Server
  participant DB as auth_sessions
  participant St as auth store

  C->>A: api.get("/problems")
  A->>S: GET /problems (expired Bearer)
  S-->>A: 401
  A->>RespI: error (status 401, not _retry, not /refresh)
  RespI->>S: POST /auth/refresh (cookie)
  Note over S,DB: rotateSession() — see diagram 6
  S-->>RespI: 200 {accessToken} + Set-Cookie new refreshToken
  RespI->>St: setAccessToken(new)
  RespI->>S: replay GET /problems (new Bearer, _retry=true)
  S-->>RespI: 200 data
  RespI-->>C: data
```

Guards that prevent loops:
- `original._retry` ensures **one** retry only.
- requests to `/auth/refresh` are skipped (a 401 there is a real failure).

---

## 6. Refresh with rotation  →  `POST /api/auth/refresh`

```mermaid
flowchart TD
  Start([POST /auth/refresh, cookie sent]) --> HasCookie{cookie present?}
  HasCookie -- no --> U401a[401 Unauthorized]
  HasCookie -- yes --> Verify{JWT valid + unexpired?}
  Verify -- no --> U401b[401 Unauthorized]
  Verify -- yes --> Lookup{row in auth_sessions<br/>for this token?}
  Lookup -- "yes (active)" --> Rotate[issue new access + refresh<br/>UPDATE row with new refresh<br/>Set-Cookie new refresh<br/>return accessToken]
  Lookup -- "no (reused/revoked)" --> Breach[DELETE all sessions for userId<br/>-> 401 forces re-login everywhere]
  Rotate --> Done([200 accessToken])
  Breach --> U401c[401 Unauthorized]
```

Why the "no row" branch nukes everything: a validly-signed token that isn't in
the DB means it was already rotated away (or revoked). Seeing it again is a
reuse signal, so every session for that user is dropped as a precaution.

---

## 7. App load / hard reload  (AuthBootstrap restores the session)

The access token lives only in memory, so a reload loses it — but the cookie survives.

```mermaid
sequenceDiagram
  participant B as Browser (reload)
  participant Boot as AuthBootstrap (useEffect)
  participant A as axios
  participant S as Server
  participant St as auth store

  B->>Boot: app mounts, store is empty
  Boot->>A: POST /auth/refresh (cookie)
  alt valid session cookie
    A->>S: rotateSession()
    S-->>Boot: 200 {accessToken} (+ rotated cookie)
    Boot->>St: setAccessToken(token)
  else no / expired cookie
    S-->>Boot: 401
    Note over Boot: stay logged out
  end
  Boot->>St: markAuthReady()  (finally — always runs)
```

> Limitation: `/auth/refresh` returns only an access token, so `user` stays
> `null` after reload. Add a `/auth/me` endpoint and fetch it here to fully
> restore the user object. Guarded pages should wait on `isAuthReady`.

---

## 8. Logout  →  `POST /api/auth/logout`

```mermaid
sequenceDiagram
  participant U as User
  participant F as useLogout
  participant A as axios
  participant S as Server
  participant DB as auth_sessions
  participant St as auth store

  U->>F: click "Log out"
  F->>A: POST /auth/logout (cookie)
  A->>S: 
  S->>DB: DELETE session WHERE refreshToken = cookie
  S-->>A: 200 + Clear-Cookie refreshToken
  F->>St: logout()  (onSettled — runs even if request failed)
  Note over St: user=null, accessToken=null
```

After this the refresh token is gone from both the cookie and the DB, so it can
never mint another access token — that's the payoff of the stateful design.

---

## 9. Scenario summary

| Scenario | Trigger | Result |
|----------|---------|--------|
| Signup | valid form | user created, session started, redirected |
| Login OK | right credentials | session started, token in store |
| Login bad | wrong credentials | 401, inline error |
| Protected call (valid) | token fresh | 200 |
| Protected call (expired) | token expired | silent refresh + retry, 200 |
| Refresh OK | active session cookie | new access token, rotated refresh |
| Refresh reused/revoked | token not in DB | 401, **all** user sessions wiped |
| Refresh missing/expired | no/invalid cookie | 401 |
| Reload | page refresh | session restored from cookie (user still null) |
| Logout | user action | DB row deleted, cookie cleared, store cleared |
