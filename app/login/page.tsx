// app/login/page.tsx
"use client";

import { loginAction } from "@/lib/auth";
import Link from "next/link";
import { useActionState } from "react";

export default function LoginPage() {
  const [state, action, isPending] = useActionState(loginAction, undefined);

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4 py-12 sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-8 bg-white p-8 shadow rounded-lg">
        <div>
          <h2 className="mt-6 text-center text-3xl font-bold tracking-tight text-gray-900">
            Zaloguj się
          </h2>
        </div>
        <form action={action} className="mt-8 space-y-6">
          <div className="-space-y-px rounded-md shadow-sm">
            <div className="mb-4">
              <input
                name="email"
                type="email"
                required
                className="relative block w-full rounded-md border-0 py-1.5 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:z-10 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6 px-3"
                placeholder="Email"
              />
            </div>
            <div>
              <input
                name="password"
                type="password"
                required
                className="relative block w-full rounded-md border-0 py-1.5 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:z-10 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6 px-3"
                placeholder="Hasło"
              />
            </div>
          </div>

          {state?.error && (
            <p className="text-red-500 text-sm text-center">{state.error}</p>
          )}

          <div>
            <button
              disabled={isPending}
              type="submit"
              className="group relative flex w-full justify-center rounded-md bg-blue-600 px-3 py-2 text-sm font-semibold text-white hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 disabled:opacity-50"
            >
              {isPending ? "Logowanie..." : "Zaloguj się"}
            </button>
          </div>
          <div className="text-center text-sm">
            <Link href="/register" className="font-medium text-blue-600 hover:text-blue-500">
              Nie masz konta? Zarejestruj się
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}