"use client";

import { useActionState, useEffect } from "react"; // Używamy hooka z React 19 (w Next 15/16)
import { createPetAction } from "@/lib/actions";
import { LucidePawPrint, LucideSave } from "lucide-react";
// Jeśli masz Next.js < 15, użyj useFormState z "react-dom" zamiast useActionState

export default function AddPetPage() {
  const [state, action, pending] = useActionState(createPetAction, undefined);

  // --- POPRAWKA TUTAJ ---
  // Reagujemy tylko wtedy, gdy w stanie faktycznie pojawi się pole 'error'
  useEffect(() => {
    if (state?.error) {
      alert(`Błąd: ${state.error}`);
    }
  }, [state]);

  return (
    <div className="max-w-2xl mx-auto p-6">
      <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-200">
        <div className="flex items-center gap-3 mb-6 border-b pb-4">
          <div className="bg-blue-100 p-2 rounded-lg text-blue-600">
            <LucidePawPrint size={24} />
          </div>
          <h1 className="text-2xl font-bold text-gray-800">Dodaj nowego zwierzaka</h1>
        </div>

        <form action={action} className="space-y-5">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Imię</label>
              <input
                name="name"
                type="text"
                placeholder="np. Burek"
                required
                className="w-full p-2.5 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Gatunek</label>
              <select
                name="species"
                className="w-full p-2.5 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none bg-white"
              >
                <option value="Pies">Pies</option>
                <option value="Kot">Kot</option>
                <option value="Królik">Królik</option>
                <option value="Chomik">Chomik</option>
                <option value="Inne">Inne</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Rasa (opcjonalnie)</label>
              <input
                name="breed"
                type="text"
                placeholder="np. Owczarek"
                className="w-full p-2.5 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Data urodzenia</label>
              <input
                name="birthDate"
                type="date"
                required
                className="w-full p-2.5 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </div>
            
             <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Płeć</label>
              <select
                name="sex"
                className="w-full p-2.5 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none bg-white"
              >
                <option value="Samiec">Samiec</option>
                <option value="Samica">Samica</option>
              </select>
            </div>
          </div>

          {/* Wyświetlanie błędu nad przyciskiem (opcjonalnie, zamiast alertu) */}
          {state?.error && (
            <p className="text-red-600 text-sm bg-red-50 p-2 rounded border border-red-100 text-center">
              {state.error}
            </p>
          )}

          <div className="pt-4">
            <button
              disabled={pending}
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 rounded-lg transition flex items-center justify-center gap-2 disabled:opacity-70"
            >
              {pending ? (
                "Zapisywanie..."
              ) : (
                <>
                  <LucideSave size={18} /> Zapisz zwierzaka
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}