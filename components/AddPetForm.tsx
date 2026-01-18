"use client";

import { useActionState, useEffect } from "react";
import { createPetAction } from "@/lib/actions";
import { LucidePawPrint, LucideSave } from "lucide-react";
import OwnerSelect from "./OwnerSelect";

interface AddPetFormProps {
  isStaff: boolean;
  users: {
    id: string;
    name: string | null;
    lastName: string | null;
    email: string;
  }[];
}

export default function AddPetForm({ isStaff, users }: AddPetFormProps) {
  const [state, action, pending] = useActionState(createPetAction, undefined);

  useEffect(() => {
    if (state?.error) {
      alert(`Błąd: ${state.error}`);
    }
  }, [state]);

  return (
    <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-200">
      <div className="flex items-center gap-3 mb-6 border-b pb-4">
        <div className="bg-blue-100 p-2 rounded-lg text-blue-600">
          <LucidePawPrint size={24} />
        </div>
        <h1 className="text-2xl font-bold text-gray-800">
          Dodaj nowego zwierzaka
        </h1>
      </div>

      <form action={action} className="space-y-5">
        {/* Wybór właściciela tylko dla STAFF */}
        {isStaff && (
          <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200 mb-4">
            <OwnerSelect users={users} />
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {/* Imię */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Imię
            </label>
            <input
              name="name"
              type="text"
              placeholder="np. Burek"
              required
              className="w-full p-2.5 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>

          {/* Gatunek */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Gatunek
            </label>
            <select
              name="species"
              className="w-full p-2.5 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none bg-white"
            >
              <option value="Pies">Pies</option>
              <option value="Kot">Kot</option>
              <option value="Inne">Inne</option>
            </select>
          </div>

          {/* Rasa */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Rasa (opcjonalnie)
            </label>
            <input
              name="breed"
              type="text"
              placeholder="np. Owczarek"
              className="w-full p-2.5 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>

          {/* Data urodzenia */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Data urodzenia
            </label>
            <input
              name="birthDate"
              type="date"
              required
              className="w-full p-2.5 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>

          {/* Płeć */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Płeć
            </label>
            <select
              name="sex"
              className="w-full p-2.5 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none bg-white"
            >
              <option value="male">Samiec</option>
              <option value="female">Samica</option>
            </select>
          </div>

          {/* Waga */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Waga (kg)
            </label>
            <input
              name="weight"
              type="number"
              step="0.1"
              required
              className="w-full p-2.5 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>

          {/* --- NOWE POLA --- */}

          {/* URL Zdjęcia */}
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              URL Zdjęcia (opcjonalnie)
            </label>
            <input
              name="imageUrl"
              type="url"
              placeholder="https://przyklad.pl/zdjecie-psa.jpg"
              className="w-full p-2.5 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>

          {/* Notatki */}
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Notatki (opcjonalnie)
            </label>
            <textarea
              name="notes"
              rows={3}
              placeholder="Ważne informacje, alergie, cechy szczególne..."
              className="w-full p-2.5 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>
        </div>

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
                <LucideSave size={18} /> Zapisz zwierza
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
