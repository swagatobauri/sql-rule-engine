# CareerCafe — SQL Practice

A pixel-faithful recreation of the CareerCafe **SQL Interview Practice Arena** screen, built with a component-based **Next.js (App Router)** architecture, **Tailwind CSS v4**, and **lucide-react** icons.

## Getting started

```bash
npm install
npm run dev
```

Open <http://localhost:3000>.

## Tech

- **Next.js 15** — App Router, React Server Components by default
- **Tailwind CSS v4** — theme tokens declared in `app/globals.css` via `@theme` (no `tailwind.config` file needed)
- **lucide-react** — all icons
- **next/font** — Plus Jakarta Sans, self-hosted

## Architecture

Two routes:

- `/` — **SQL Practice Arena** dashboard (hero, feature strip, question grid, right rail).
- `/practice` — **in-session SQL Editor** (prompt + schema, code editor + results, timer + rubric + answer form).

```
app/
  layout.jsx              Root layout, font + global background
  page.jsx                Dashboard composition (server component)
  practice/page.jsx       SQL Editor session composition
  globals.css             Tailwind import + design tokens (@theme)
components/
  Navbar.jsx              Top navigation, streak, profile
  Hero.jsx                Headline, CTAs + editor/database illustration
  FeatureBar.jsx          4-up feature strip
  QuestionExplorer.jsx    Client island — owns active-tab state
  PracticeTabs.jsx        Category tabs
  FilterBar.jsx           Dropdown filters + search
  QuestionCard.jsx        Single practice-question card (links to /practice)
  BottomBanner.jsx        Sticky free-mock banner
  Illustrations.jsx       Logo + hand-built SVG scenes
  sidebar/
    Sidebar.jsx           Dashboard right-rail composition
    PracticeStatsCard.jsx Stats + premium upsell
    SolvedExamplesCard.jsx Solved examples list
    LiveInterviewCard.jsx Live-interview CTA
  practice/
    SessionTopBar.jsx     Mode toggle, question nav, end session
    PromptPanel.jsx       Question/Notes + Schema/Sample Data tabs
    SchemaTable.jsx       One schema table with PK/FK badges
    SqlEditor.jsx         Highlighted code, run/format/clear, results
    TimerCard.jsx         Live countdown ring (client)
    EvaluationCard.jsx    Collapsible scoring rubric
    AnswerForm.jsx        Explain-logic + edge-cases textareas
data/
  questions.js            Dashboard question / example / tab content
  session.js              Editor prompt, schema, query, rubric, timer
lib/
  styles.js               Shared tag + difficulty colour maps
  sqlHighlight.js         Dependency-free SQL tokenizer for the editor
```

### Notes

- Almost everything renders as a **server component**. Only `QuestionExplorer` (and the
  `PracticeTabs` / `FilterBar` it controls) are client components, since the tab selection is
  interactive state.
- Content lives in `data/questions.js` so cards, examples and tabs are data-driven and easy to
  extend. Icons are referenced by name there and mapped to lucide components at render time.
- Design tokens (`--color-brand`, `--color-carrot`, shadows, font) are defined once in
  `app/globals.css` and consumed as Tailwind utilities (`bg-brand`, `text-carrot`, `shadow-soft`…).
- The hero/database/live-interview artwork is drawn with inline SVG — no binary image assets
  required.
