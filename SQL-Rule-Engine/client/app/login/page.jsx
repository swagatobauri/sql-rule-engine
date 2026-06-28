"use client";

import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import AuthShell, { AuthFooterLink } from "@/components/auth/AuthShell";
import FormField from "@/components/auth/FormField";
import SubmitButton from "@/components/auth/SubmitButton";
import { emailRules, loginPasswordRules } from "@/lib/authValidation";
import { useLogin, readError } from "@/hooks/useAuth";

export default function LoginPage() {
  const router = useRouter();
  const login = useLogin();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ mode: "onTouched" });

  // Send credentials to the server; on success the store holds the session
  // and we move the user into the app.
  async function onSubmit(values) {
    try {
      await login.mutateAsync(values);
      router.push("/practice");
    } catch {
      // Error is rendered below via login.error — nothing else to do here.
    }
  }

  return (
    <AuthShell
      title="Welcome back"
      subtitle="Log in to continue your SQL interview prep."
      footer={
        <AuthFooterLink prompt="New to CareerCafe?" href="/signup" label="Create an account" />
      }
    >
      <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-5">
        {login.isError && (
          <p className="rounded-lg bg-rose-50 px-3 py-2 text-[13px] font-medium text-rose-600">
            {readError(login.error, "Login failed. Please try again.")}
          </p>
        )}

        <FormField
          label="Email"
          type="email"
          placeholder="you@example.com"
          autoComplete="email"
          error={errors.email}
          {...register("email", emailRules)}
        />

        <div>
          <FormField
            label="Password"
            type="password"
            placeholder="Enter your password"
            autoComplete="current-password"
            error={errors.password}
            {...register("password", loginPasswordRules)}
          />
          <div className="mt-2 text-right">
            <a href="#" className="text-[13px] font-semibold text-brand hover:text-brand-dark">
              Forgot password?
            </a>
          </div>
        </div>

        <SubmitButton pending={login.isPending}>Log in</SubmitButton>
      </form>
    </AuthShell>
  );
}
