import Link from 'next/link';

export default function ForgotPasswordPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[var(--background)] px-4">
      <div className="w-full max-w-md space-y-6 p-8 rounded-2xl border border-[var(--border)] bg-[var(--background-secondary)] text-center">
        <h1 className="text-2xl font-bold">Reset password</h1>
        <p className="text-sm text-[var(--foreground-muted)]">
          Password reset is handled by our support team. Please contact us with your registered email and phone number.
        </p>
        <Link href="/auth/login" className="inline-flex w-full items-center justify-center rounded-md bg-[var(--primary)] px-4 py-2 text-white font-medium hover:opacity-90">
          Back to login
        </Link>
      </div>
    </div>
  );
}
