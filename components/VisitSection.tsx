"use client";

import {
  createVisitAction,
  acceptVisitAction,
  rejectVisitAction,
} from "@/lib/actions";
import { useTransition, useRef, useState } from "react";
import {
  Calendar,
  CheckCircle,
  Clock,
  Stethoscope,
  AlertCircle,
  X,
  Check,
} from "lucide-react";

interface Visit {
  id: string;
  date: Date;
  type: string;
  status: string;
  price: number;
  description: string;
  diagnosis?: string | null;
  vet?: {
    name: string;
    lastName: string;
  } | null;
}

interface VisitSectionProps {
  petId: string;
  visits: Visit[];
  userRole: string;
}

export default function VisitSection({
  petId,
  visits,
  userRole,
}: VisitSectionProps) {
  const [isPending, startTransition] = useTransition();
  const formRef = useRef<HTMLFormElement>(null);

  const [acceptingVisitId, setAcceptingVisitId] = useState<string | null>(null);

  const isStaff = userRole === "admin" || userRole === "vet";

  return (
    <div className="mt-8 border-t pt-8">
      <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
        <Stethoscope className="w-6 h-6 text-blue-600" />
        Historia Leczenia i Wizyty
      </h2>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1">
          <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm sticky top-4">
            <h3 className="font-semibold text-gray-900 mb-4">
              Nowe zgłoszenie
            </h3>
            <form
              ref={formRef}
              action={async (formData) => {
                await createVisitAction(formData);
                formRef.current?.reset();
              }}
              className="space-y-4"
            >
              <input type="hidden" name="petId" value={petId} />

              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1">
                  Rodzaj wizyty
                </label>
                <select
                  name="type"
                  className="w-full rounded-lg border-gray-300 text-sm focus:ring-blue-500"
                >
                  <option value="konsultacja">Konsultacja ogólna</option>
                  <option value="szczepienie">Szczepienie</option>
                  <option value="zabieg">Zabieg / Operacja</option>
                  <option value="kontrola">Wizyta kontrolna</option>
                </select>
              </div>
              {isStaff && (
                <div>
                  <label className="block text-xs font-medium text-gray-500 mb-1">
                    Cena wizyty (PLN)
                  </label>
                  <div className="relative">
                    <input
                      type="number"
                      name="price"
                      step="0.01"
                      min="0"
                      placeholder="0.00"
                      className="w-full rounded-lg border-gray-300 text-sm pl-8 focus:ring-blue-500"
                    />
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <span className="text-gray-400 text-xs">zł</span>
                    </div>
                  </div>
                </div>
              )}
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1">
                  Termin
                </label>
                <input
                  type="datetime-local"
                  name="date"
                  required
                  className="w-full rounded-lg border-gray-300 text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1">
                  Opis problemu
                </label>
                <textarea
                  name="description"
                  required
                  rows={3}
                  placeholder="Opisz objawy..."
                  className="w-full rounded-lg border-gray-300 text-sm"
                ></textarea>
              </div>

              <button
                type="submit"
                disabled={isPending}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2.5 rounded-lg text-sm transition-colors disabled:opacity-50"
              >
                {isPending
                  ? "Przetwarzanie..."
                  : isStaff
                  ? "Dodaj (jako potwierdzoną)"
                  : "Wyślij prośbę o wizytę"}
              </button>
            </form>
          </div>
        </div>

        <div className="lg:col-span-2 space-y-4">
          {visits.length === 0 ? (
            <div className="text-center py-10 bg-gray-50 rounded-xl border border-dashed border-gray-300">
              <Calendar className="w-10 h-10 text-gray-400 mx-auto mb-2" />
              <p className="text-gray-500">Brak historii wizyt.</p>
            </div>
          ) : (
            visits.map((visit) => (
              <div
                key={visit.id}
                className={`relative p-5 rounded-xl border transition-all ${
                  visit.status === "confirmed"
                    ? "bg-white border-gray-200 shadow-sm"
                    : "bg-yellow-50 border-yellow-200"
                }`}
              >
                <div className="flex justify-between items-start mb-3">
                  <div className="flex items-center gap-3">
                    <div
                      className={`p-2 rounded-lg ${
                        visit.status === "confirmed"
                          ? "bg-blue-100 text-blue-600"
                          : "bg-yellow-100 text-yellow-600"
                      }`}
                    >
                      {visit.status === "confirmed" ? (
                        <CheckCircle className="w-5 h-5" />
                      ) : (
                        <Clock className="w-5 h-5" />
                      )}
                    </div>
                    <div>
                      <p className="font-bold text-gray-900 capitalize">
                        {visit.type}
                      </p>
                      <p className="text-xs text-gray-500">
                        {new Date(visit.date).toLocaleDateString("pl-PL", {
                          day: "numeric",
                          month: "long",
                          year: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </p>
                    </div>
                  </div>

                  <span
                    className={`text-xs font-medium px-2 py-1 rounded capitalize ${
                      visit.status === "confirmed"
                        ? "bg-green-100 text-green-700"
                        : "bg-yellow-100 text-yellow-700"
                    }`}
                  >
                    {visit.status === "pending"
                      ? "Oczekuje na lekarza"
                      : visit.status}
                  </span>
                </div>

                {/* Szczegóły */}
                <div className="space-y-2 text-sm text-gray-600 pl-12">
                  <p>
                    <span className="font-medium text-gray-900">Opis:</span>{" "}
                    {visit.description}
                  </p>

                  <div className="flex flex-wrap gap-4 mt-2 text-xs text-gray-500 border-t pt-2">
                    {/* Wyświetlaj lekarza tylko jak jest przypisany */}
                    {visit.vet ? (
                      <span className="flex items-center gap-1 text-blue-700 font-medium bg-blue-50 px-2 py-1 rounded">
                        <Stethoscope className="w-3 h-3" /> Lek.{" "}
                        {visit.vet.name} {visit.vet.lastName}
                      </span>
                    ) : (
                      <span className="italic">Lekarz nieprzypisany</span>
                    )}

                    {visit.price > 0 && (
                      <span className="font-medium bg-green-50 text-green-700 px-2 py-1 rounded">
                        Koszt: {visit.price} PLN
                      </span>
                    )}
                  </div>
                </div>

                {isStaff && visit.status === "pending" && (
                  <div className="mt-4 pt-3 border-t border-yellow-200">
                    {acceptingVisitId === visit.id ? (
                      <form
                        action={async (formData) => {
                          await acceptVisitAction(formData);
                          setAcceptingVisitId(null);
                        }}
                        className="flex items-end gap-2 bg-white p-3 rounded-lg border border-yellow-300 shadow-sm"
                      >
                        <input type="hidden" name="visitId" value={visit.id} />

                        <div className="flex-1">
                          <label className="block text-xs font-medium text-gray-500 mb-1">
                            Ustal cenę (PLN)
                          </label>
                          <input
                            type="number"
                            name="price"
                            step="0.01"
                            min="0"
                            placeholder="0.00"
                            required
                            className="w-full text-sm border-gray-300 rounded focus:ring-green-500 focus:border-green-500"
                          />
                        </div>

                        <button
                          type="submit"
                          className="bg-green-600 hover:bg-green-700 text-white p-2 rounded transition-colors"
                          title="Potwierdź i przejmij"
                        >
                          <Check className="w-5 h-5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => setAcceptingVisitId(null)}
                          className="bg-gray-200 hover:bg-gray-300 text-gray-600 p-2 rounded transition-colors"
                          title="Anuluj"
                        >
                          <X className="w-5 h-5" />
                        </button>
                      </form>
                    ) : (
                      <div className="flex justify-end gap-2">
                        <button
                          onClick={() => setAcceptingVisitId(visit.id)}
                          className="px-3 py-1.5 bg-green-600 text-white text-xs font-medium rounded hover:bg-green-700 shadow-sm flex items-center gap-1"
                        >
                          <CheckCircle className="w-3 h-3" /> Przyjmij wizytę
                        </button>

                        <button
                          onClick={() =>
                            startTransition(
                              async () => await rejectVisitAction(visit.id)
                            )
                          }
                          disabled={isPending}
                          className="px-3 py-1.5 bg-white border border-gray-300 text-red-600 text-xs font-medium rounded hover:bg-red-50"
                        >
                          Odrzuć
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
