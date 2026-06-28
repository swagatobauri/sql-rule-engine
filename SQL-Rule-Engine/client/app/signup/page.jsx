"use client";

import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import AuthShell, { AuthFooterLink } from "@/components/auth/AuthShell";
import FormField from "@/components/auth/FormField";
import SubmitButton from "@/components/auth/SubmitButton";
import {
  confirmPasswordRules,
  emailRules,
  nameRules,
  passwordRules,
} from "@/lib/authValidation";
import { useSignup, readError } from "@/hooks/useAuth";

export default function SignupPage() {
  const router = useRouter();
  const signup = useSignup();

  const {
    register,
    handleSubmit,
    getValues,
    formState: { errors },
  } = useForm({ mode: "onTouched" });

  // confirmPassword is only for client-side validation — don't send it.
  async function onSubmit({ confirmPassword, ...payload }) {
    try {
      await signup.mutateAsync(payload);
      router.push("/practice");
    } catch {
      // Surfaced below via signup.error.
    }
  }

  return (
    <AuthShell
      title="Create your account"
      subtitle="Start practicing SQL the way interviews test it."
      footer={
        <AuthFooterLink prompt="Already have an account?" href="/login" label="Log in" />
      }
    >
      <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-5">
        {signup.isError && (
          <p className="rounded-lg bg-rose-50 px-3 py-2 text-[13px] font-medium text-rose-600">
            {readError(signup.error, "Could not create your account. Please try again.")}
          </p>
        )}

        <FormField
          label="Full name"
          placeholder="Amit Sharma"
          autoComplete="name"
          error={errors.name}
          {...register("name", nameRules)}
        />

        <FormField
          label="Email"
          type="email"
          placeholder="you@example.com"
          autoComplete="email"
          error={errors.email}
          {...register("email", emailRules)}
        />

        <FormField
          label="Password"
          type="password"
          placeholder="Create a password"
          autoComplete="new-password"
          error={errors.password}
          hint="At least 8 characters, with a letter and a number."
          {...register("password", passwordRules)}
        />

        <FormField
          label="Confirm password"
          type="password"
          placeholder="Re-enter your password"
          autoComplete="new-password"
          error={errors.confirmPassword}
          {...register("confirmPassword", confirmPasswordRules(getValues))}
        />

        <SubmitButton pending={signup.isPending}>Create account</SubmitButton>
      </form>
    </AuthShell>
  );
}
