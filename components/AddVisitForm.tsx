"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createVisitAction } from "@/lib/actions";
import {
  Calendar,
  FileText,
  Banknote,
  Save,
  Clock,
  Stethoscope,
  PawPrint,
} from "lucide-react";
import Link from "next/link";

interface PetOption {
  id: string;
  name: string;
  ownerName?: string;
}

interface Props {
  isStaff: boolean;
  pets?: PetOption[];
  preselectedPetId?: string;
  preselectedPetName?: string;
}

export default function AddVisitForm({
  isStaff,
  pets = [],
  preselectedPetId,
  preselectedPetName,
}: Props) {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const now = new Date();
  now.setMinutes(now.getMinutes() - now.getTimezoneOffset());
  const defaultDate = now.toISOString().slice(0, 16);

  async function handleSubmit(formData: FormData) {
    setLoading(true);

    await createVisitAction(formData);

    router.refresh();
    router.push("/visits");
  }

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8">
      <div className="mb-6 border-b border-gray-100 pb-4">
        <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
          <Calendar className="w-5 h-5 text-blue-600" />
          {preselectedPetName ? (
            <>
              Nowa wizyta:{" "}
              <span className="text-blue-600">{preselectedPetName}</span>
            </>
          ) : (
            "Nowa wizyta"
          )}
        </h2>
        <p className="text-sm text-gray-500 mt-1">
          {isStaff
            ? "Dodajesz wizytę do globalnego grafiku."
            : "Wysyłasz prośbę o wizytę."}
        </p>
      </div>

      <form action={handleSubmit} className="space-y-6">
        {/* wybór zwierzaka */}
        {preselectedPetId ? (
          <input type="hidden" name="petId" value={preselectedPetId} />
        ) : (
          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase mb-1">
              Wybierz Pacjenta
            </label>
            <div className="relative">
              <select
                name="petId"
                required
                className="w-full pl-10 rounded-lg border-gray-300 text-sm focus:ring-2 focus:ring-blue-500 bg-white"
                defaultValue=""
              >
                <option value="" disabled>
                  -- Kliknij, aby wybrać --
                </option>
                {pets.map((pet) => (
                  <option key={pet.id} value={pet.id}>
                    {pet.name} {pet.ownerName ? `(Wł: ${pet.ownerName})` : ""}
                  </option>
                ))}
              </select>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase mb-1">
              Data i Godzina
            </label>
            <div className="relative">
              <Clock className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />
              <input
                type="datetime-local"
                name="date"
                required
                defaultValue={defaultDate}
                className="w-full pl-10 rounded-lg border-gray-300 text-sm focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase mb-1">
              Typ wizyty
            </label>
            <div className="relative">
              <select
                name="type"
                required
                className="w-full pl-10 rounded-lg border-gray-300 text-sm focus:ring-2 focus:ring-blue-500 bg-white"
              >
                <option value="Konsultacja">Konsultacja ogólna</option>
                <option value="Szczepienie">Szczepienie</option>
                <option value="Odrobaczanie">Odrobaczanie</option>
                <option value="Zabieg">Zabieg / Chirurgia</option>
                <option value="Kontrola">Wizyta kontrolna</option>
                <option value="Nagły wypadek">Nagły wypadek</option>
              </select>
            </div>
          </div>
        </div>

        <div>
          <label className="block text-xs font-bold text-gray-500 uppercase mb-1">
            Cel wizyty / Objawy
          </label>
          <div className="relative">
            <FileText className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
            <textarea
              name="description"
              required
              rows={3}
              placeholder="Opisz powód wizyty..."
              className="w-full pl-10 rounded-lg border-gray-300 text-sm focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        {isStaff && (
          <div className="bg-gray-50 p-4 rounded-xl border border-gray-200">
            <label className="block text-xs font-bold text-gray-500 uppercase mb-1">
              Przewidywany koszt (PLN)
            </label>
            <div className="relative max-w-xs">
              <Banknote className="absolute left-3 top-2.5 w-4 h-4 text-green-600" />
              <input
                type="number"
                name="price"
                step="0.01"
                placeholder="0.00"
                className="w-full pl-10 rounded-lg border-gray-300 text-sm focus:ring-2 focus:ring-green-500"
              />
            </div>
          </div>
        )}

        <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-100">
          <Link
            href="/visits"
            className="px-5 py-2.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition"
          >
            Anuluj
          </Link>
          <button
            type="submit"
            disabled={loading}
            className="inline-flex items-center gap-2 px-6 py-2.5 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition shadow-sm disabled:opacity-70"
          >
            {loading ? (
              "Planowanie..."
            ) : (
              <>
                <Save className="w-4 h-4" /> Zaplanuj wizytę
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
