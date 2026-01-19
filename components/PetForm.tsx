"use client";
// skibidi komponent es es 
import { LucideSave } from "lucide-react";
import Link from "next/link";

export interface PetFormValues {
  id?: string;
  name?: string;
  species?: string;
  breed?: string | null;
  birthDate?: Date | string;
  weight?: number;
  sex?: string;
  notes?: string | null;
  imageUrl?: string | null;
}

interface PetFormProps {
  action: (formData: FormData) => void | Promise<void>;
  defaultValues?: PetFormValues;
  isPending?: boolean;
  submitLabel?: string;
  cancelHref?: string;
  children?: React.ReactNode;
}

export default function PetForm({
  action,
  defaultValues,
  isPending,
  submitLabel = "Zapisz",
  cancelHref,
  children,
}: PetFormProps) {
  const formattedDate =
    defaultValues?.birthDate
      ? new Date(defaultValues.birthDate).toISOString().split("T")[0]
      : "";

  return (
    <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-200">
      <form action={action} className="space-y-5">
        {defaultValues?.id && (
          <input type="hidden" name="id" value={defaultValues.id} />
        )}

        {children}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {/* Imię */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Imię
            </label>
            <input
              name="name"
              defaultValue={defaultValues?.name ?? ""}
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
              defaultValue={defaultValues?.species ?? "pies"}
              className="w-full p-2.5 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none bg-white"
            >
              <option value="pies">Pies</option>
              <option value="kot">Kot</option>
              <option value="inny">Inny</option>
            </select>
          </div>

          {/* Rasa */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Rasa (opcjonalnie)
            </label>
            <input
              name="breed"
              defaultValue={defaultValues?.breed ?? ""}
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
              defaultValue={formattedDate}
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
              defaultValue={defaultValues?.sex ?? "male"}
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
              defaultValue={
                defaultValues?.weight !== undefined
                  ? String(defaultValues.weight)
                  : ""
              }
              required
              className="w-full p-2.5 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>

          {/* URL Zdjęcia */}
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              URL Zdjęcia (opcjonalnie)
            </label>
            <input
              name="imageUrl"
              defaultValue={defaultValues?.imageUrl ?? ""}
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
              defaultValue={defaultValues?.notes ?? ""}
              className="w-full p-2.5 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>
        </div>

        <div className="pt-4 flex gap-3">
          {cancelHref && (
            <Link
              href={cancelHref}
              className="w-full text-center border py-3 rounded-lg"
            >
              Anuluj
            </Link>
          )}

          <button
            disabled={isPending}
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 rounded-lg transition flex items-center justify-center gap-2 disabled:opacity-70"
          >
            {isPending ? "Zapisywanie..." : <><LucideSave size={18} /> {submitLabel}</>}
          </button>
        </div>
      </form>
    </div>
  );
}
