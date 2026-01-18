"use client";

import { updatePetAction } from "@/lib/actions";
import { useActionState } from "react";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Save, X } from "lucide-react";
import Link from "next/link";

interface EditPetFormProps {
  pet: {
    id: string;
    name: string;
    species: string;
    breed: string | null;
    birthDate: Date;
    weight: number;
    sex: string;
    notes: string | null;
    imageUrl: string | null;
  };
}

export default function EditPetForm({ pet }: EditPetFormProps) {
  const [state, action, isPending] = useActionState(updatePetAction, undefined);
  const router = useRouter();

  // Przekierowanie po udanym zapisie
  useEffect(() => {
    if (state?.success) {
      router.push(`/pets/${pet.id}`);
    }
  }, [state, router, pet.id]);

  // Formatowanie daty do input type="date" (YYYY-MM-DD)
  const formattedDate = new Date(pet.birthDate).toISOString().split("T")[0];

  return (
    <form action={action} className="space-y-6">
      <input type="hidden" name="id" value={pet.id} />

      <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200 space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Imię */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Imię
            </label>
            <input
              name="name"
              defaultValue={pet.name}
              required
              className="w-full rounded-lg border-gray-300 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          {/* Gatunek */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Gatunek
            </label>
            <select
              name="species"
              defaultValue={pet.species}
              className="w-full rounded-lg border-gray-300 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="pies">Pies</option>
              <option value="kot">Kot</option>
              <option value="inny">Inny</option>
            </select>
          </div>

          {/* Rasa */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Rasa
            </label>
            <input
              name="breed"
              defaultValue={pet.breed || ""}
              className="w-full rounded-lg border-gray-300 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          {/* Data urodzenia */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Data urodzenia
            </label>
            <input
              type="date"
              name="birthDate"
              defaultValue={formattedDate}
              required
              className="w-full rounded-lg border-gray-300 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          {/* Waga */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Waga (kg)
            </label>
            <input
              type="number"
              step="0.1"
              name="weight"
              defaultValue={pet.weight}
              required
              className="w-full rounded-lg border-gray-300 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          {/* Płeć */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Płeć
            </label>
            <select
              name="sex"
              defaultValue={pet.sex}
              className="w-full rounded-lg border-gray-300 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="male">Samiec</option>
              <option value="female">Samica</option>
            </select>
          </div>
        </div>

        {/* Link do zdjęcia */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            URL Zdjęcia (opcjonalnie)
          </label>
          <input
            name="imageUrl"
            defaultValue={pet.imageUrl || ""}
            placeholder="https://..."
            className="w-full rounded-lg border-gray-300 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        {/* Notatki */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Notatki
          </label>
          <textarea
            name="notes"
            rows={3}
            defaultValue={pet.notes || ""}
            className="w-full rounded-lg border-gray-300 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
      </div>

      {state?.error && (
        <p className="text-red-500 text-sm text-center bg-red-50 p-2 rounded-lg border border-red-100">
          {state.error}
        </p>
      )}

      <div className="flex gap-4 justify-end">
        <Link
          href={`/pets/${pet.id}`}
          className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-xl text-gray-700 hover:bg-gray-50 font-medium transition-colors"
        >
          <X className="w-4 h-4" /> Anuluj
        </Link>
        <button
          type="submit"
          disabled={isPending}
          className="flex items-center gap-2 px-6 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 font-medium transition-colors disabled:opacity-50"
        >
          {isPending ? (
            "Zapisywanie..."
          ) : (
            <>
              <Save className="w-4 h-4" /> Zapisz zmiany
            </>
          )}
        </button>
      </div>
    </form>
  );
}
