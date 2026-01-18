"use client";

import { useActionState } from "react";
import { registerVetAction } from "@/lib/auth";
import Link from "next/link";
import { LucideStethoscope } from "lucide-react";

export default function RegisterVetPage() {
  const [state, action, pending] = useActionState(registerVetAction, undefined);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-md border-t-4 border-blue-600">
        <div className="flex justify-center mb-6">
          <div className="bg-blue-100 p-3 rounded-full">
            <LucideStethoscope className="w-8 h-8 text-blue-600" />
          </div>
        </div>

        <h1 className="text-2xl font-bold text-center mb-2 text-gray-800">
          Panel Personelu
        </h1>
        <p className="text-center text-gray-500 mb-8 text-sm">
          Rejestracja konta lekarza weterynarii
        </p>

        <form action={action} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Imię
              </label>
              <input
                name="name"
                type="text"
                required
                className="w-full p-2 border rounded mt-1"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Nazwisko
              </label>
              <input
                name="lastName"
                type="text"
                required
                className="w-full p-2 border rounded mt-1"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Email służbowy
            </label>
            <input
              name="email"
              type="email"
              required
              className="w-full p-2 border rounded mt-1"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Telefon
            </label>
            <input
              name="phone"
              type="tel"
              className="w-full p-2 border rounded mt-1"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Hasło
            </label>
            <input
              name="password"
              type="password"
              required
              className="w-full p-2 border rounded mt-1"
            />
          </div>

          {state?.error && (
            <p className="text-red-500 text-sm text-center bg-red-50 p-2 rounded">
              {state.error}
            </p>
          )}

          <button
            disabled={pending}
            className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition font-medium disabled:opacity-50"
          >
            {pending ? "Tworzenie konta..." : "Zarejestruj Lekarza"}
          </button>
        </form>

        <div className="mt-6 text-center text-sm">
          <Link href="/login" className="text-gray-500 hover:underline">
            Wróć do logowania
          </Link>
        </div>
      </div>
    </div>
  );
}
