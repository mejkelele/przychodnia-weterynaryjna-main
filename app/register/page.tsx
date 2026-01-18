"use client";

import { registerAction } from "@/lib/auth";
import Link from "next/link";
import { useActionState } from "react";

export default function RegisterPage() {
  const [state, action, isPending] = useActionState(registerAction, undefined);

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4 py-12 sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-8 bg-white p-8 shadow-lg rounded-xl">
        <div>
          <h2 className="mt-2 text-center text-3xl font-bold tracking-tight text-gray-900">
            Zarejestruj konto
          </h2>
        </div>

        <form action={action} className="mt-8 space-y-6">
          {/* Zmiana: Zamiast -space-y-px dajemy space-y-4 dla równych odstępów */}
          <div className="space-y-4">
            {/* Imię i Nazwisko */}
            <div className="grid grid-cols-2 gap-4">
              <input
                name="name"
                type="text"
                required
                className="block w-full rounded-lg border-0 py-2 px-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6"
                placeholder="Imię"
              />
              <input
                name="lastName"
                type="text"
                required
                className="block w-full rounded-lg border-0 py-2 px-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6"
                placeholder="Nazwisko"
              />
            </div>

            {/* Email */}
            <div>
              <input
                name="email"
                type="email"
                required
                className="block w-full rounded-lg border-0 py-2 px-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6"
                placeholder="Adres Email"
              />
            </div>

            {/* Telefon */}
            <div>
              <input
                name="phone"
                type="tel"
                className="block w-full rounded-lg border-0 py-2 px-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6"
                placeholder="Telefon"
              />
            </div>

            {/* Hasło */}
            <div>
              <input
                name="password"
                type="password"
                required
                className="block w-full rounded-lg border-0 py-2 px-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6"
                placeholder="Hasło"
              />
            </div>
          </div>

          {state?.error && (
            <div className="rounded-md bg-red-50 p-3">
              <p className="text-red-600 text-sm text-center">{state.error}</p>
            </div>
          )}

          <div>
            <button
              disabled={isPending}
              type="submit"
              className="group relative flex w-full justify-center rounded-lg bg-blue-600 px-3 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 disabled:opacity-70 transition-colors"
            >
              {isPending ? "Rejestracja..." : "Zarejestruj się"}
            </button>
          </div>

          <div className="text-center text-sm">
            <Link
              href="/login"
              className="font-medium text-blue-600 hover:text-blue-500 transition-colors"
            >
              Masz już konto? Zaloguj się
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}
