"use client";

import { useState } from "react";
import { createPetAction } from "@/lib/actions";
import Link from "next/link";
import {
  ArrowLeft,
  Save,
  UserPlus,
  FileText,
  Image as ImageIcon,
} from "lucide-react";

type Owner = {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
};

type Props = {
  userRole: string;
  owners: Owner[];
};

const INPUT_CLASS =
  "w-full rounded-lg border border-gray-300 px-3 py-2 text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all bg-white";

export default function AddPetForm({ userRole, owners }: Props) {
  const [loading, setLoading] = useState(false);

  // stan dla admina
  const [createNewOwner, setCreateNewOwner] = useState(false);

  async function handleSubmit(formData: FormData) {
    setLoading(true);
    try {
      // walidacja i przekierowanie
      await createPetAction(formData);
    } catch (error) {
      console.error("Błąd zapisu:", error);
      alert("Wystąpił błąd podczas dodawania pacjenta.");
      setLoading(false);
    }
  }

  const isStaff = ["ADMIN", "EMPLOYEE", "VET"].includes(userRole);
  const isAdmin = userRole === "ADMIN";

  return (
    <div className="max-w-3xl mx-auto mb-16">
      {/* header */}
      <div className="flex items-center gap-4 mb-8">
        <Link
          href="/pets"
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors text-gray-600"
        >
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Nowy pacjent</h1>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 sm:p-8">
        <form action={handleSubmit} className="space-y-8">
          {/* stan ui do serwera */}
          <input
            type="hidden"
            name="isNewOwnerMode"
            value={createNewOwner.toString()}
          />

          {/* dane zwierzaka */}
          <div>
            <h3 className="text-lg font-semibold text-gray-800 mb-6 flex items-center gap-2">
              <FileText className="w-5 h-5 text-blue-600" />
              Dane Podstawowe
            </h3>

            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              {/* imię */}
              <div className="col-span-2 sm:col-span-1">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Imię zwierzaka *
                </label>
                <input
                  name="petName"
                  required
                  type="text"
                  placeholder="np. Burek"
                  className={INPUT_CLASS}
                />
              </div>

              {/* rodzaj */}
              <div className="col-span-2 sm:col-span-1">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Rodzaj *
                </label>
                <select
                  name="species"
                  className={INPUT_CLASS}
                  defaultValue="pies"
                >
                  <option value="pies">Pies</option>
                  <option value="kot">Kot</option>
                  <option value="inne">Inne</option>
                </select>
              </div>

              {/* rasa */}
              <div className="col-span-2 sm:col-span-1">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Rasa
                </label>
                <input
                  name="breed"
                  type="text"
                  placeholder="np. Owczarek Niemiecki"
                  className={INPUT_CLASS}
                />
              </div>

              {/* płeć */}
              <div className="col-span-2 sm:col-span-1">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Płeć *
                </label>
                <select name="sex" className={INPUT_CLASS}>
                  <option value="male">Samiec</option>
                  <option value="female">Samica</option>
                  <option value="unknown">Nieznana</option>
                </select>
              </div>

              {/* data urodzenia */}
              <div className="col-span-2 sm:col-span-1">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Data urodzenia *
                </label>
                <input
                  name="birthDate"
                  required
                  type="date"
                  className={INPUT_CLASS}
                />
              </div>

              {/* waga */}
              <div className="col-span-2 sm:col-span-1">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Waga (kg) *
                </label>
                <input
                  name="weight"
                  required
                  type="number"
                  step="0.01"
                  min="0"
                  placeholder="0.00"
                  className={INPUT_CLASS}
                />
              </div>

              {/* url ze zdjęciem */}
              <div className="col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Link do zdjęcia (opcjonalne)
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"></div>
                  <input
                    name="imageUrl"
                    type="url"
                    placeholder="https://..."
                    className={`${INPUT_CLASS} pl-10`}
                  />
                </div>
              </div>

              {/* notatki */}
              <div className="col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Notatki
                </label>
                <textarea
                  name="notes"
                  rows={3}
                  className={INPUT_CLASS}
                  placeholder="Dodatkowe informacje o zwierzaku..."
                />
              </div>
            </div>
          </div>

          {/* właściciel */}
          <div className="pt-6 border-t border-gray-100">
            {/* jeżeli user patrzy */}
            {!isStaff && (
              <div className="bg-blue-50 border border-blue-100 text-blue-800 p-4 rounded-xl text-sm flex items-start gap-3">
                <div className="bg-blue-100 p-1.5 rounded-full shrink-0">
                  <UserPlus className="w-4 h-4 text-blue-600" />
                </div>
                <div>
                  <p className="font-semibold">Automatyczne przypisanie</p>
                  <p className="text-blue-700/80">
                    Ten zwierzak zostanie dodany do Twojego konta.
                  </p>
                </div>
              </div>
            )}

            {/* jeżeli admin patrzy */}
            {isStaff && (
              <div>
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-6 gap-4">
                  <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                    <UserPlus className="w-5 h-5 text-blue-600" />
                    Dane Właściciela
                  </h3>

                  {isAdmin && (
                    <div className="inline-flex bg-gray-100 p-1 rounded-lg border border-gray-200">
                      <button
                        type="button"
                        onClick={() => setCreateNewOwner(false)}
                        className={`px-4 py-1.5 text-xs font-medium rounded-md transition-all ${
                          !createNewOwner
                            ? "bg-white shadow-sm text-gray-900"
                            : "text-gray-500 hover:text-gray-700"
                        }`}
                      >
                        Wybierz z listy
                      </button>
                      <button
                        type="button"
                        onClick={() => setCreateNewOwner(true)}
                        className={`px-4 py-1.5 text-xs font-medium rounded-md transition-all ${
                          createNewOwner
                            ? "bg-white shadow-sm text-gray-900"
                            : "text-gray-500 hover:text-gray-700"
                        }`}
                      >
                        Nowy klient
                      </button>
                    </div>
                  )}
                </div>

                {!createNewOwner && (
                  <div className="animate-in fade-in zoom-in-95 duration-200">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Wybierz klienta z bazy *
                    </label>
                    <select
                      name="ownerId"
                      required={!createNewOwner}
                      className={INPUT_CLASS}
                    >
                      <option value="">-- Wyszukaj właściciela --</option>
                      {owners.map((owner) => (
                        <option key={owner.id} value={owner.id}>
                          {owner.lastName} {owner.firstName} &mdash;{" "}
                          {owner.email}
                        </option>
                      ))}
                    </select>
                    {!isAdmin && (
                      <p className="text-xs text-gray-500 mt-2 bg-gray-50 p-2 rounded border border-gray-200 inline-block">
                        ℹ️ Jako pracownik możesz przypisywać zwierzęta tylko do
                        istniejących klientów.
                      </p>
                    )}
                  </div>
                )}

                {/* B.2: tworzenie nowego właściciela */}
                {createNewOwner && isAdmin && (
                  <div className="bg-gray-50 p-6 rounded-xl border border-gray-200 grid grid-cols-1 gap-4 sm:grid-cols-2 animate-in slide-in-from-top-2 duration-300">
                    <div className="col-span-2 mb-2 pb-2 border-b border-gray-200">
                      <p className="text-sm font-medium text-gray-900">
                        Szybka rejestracja właściciela
                      </p>
                      <p className="text-xs text-gray-500">
                        To konto nie będzie miało dostępu do logowania (tylko
                        dane kontaktowe).
                      </p>
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">
                        Imię *
                      </label>
                      <input
                        name="ownerName"
                        required={createNewOwner}
                        className={INPUT_CLASS}
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">
                        Nazwisko *
                      </label>
                      <input
                        name="ownerLastName"
                        required={createNewOwner}
                        className={INPUT_CLASS}
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">
                        Email *
                      </label>
                      <input
                        name="ownerEmail"
                        type="email"
                        required={createNewOwner}
                        className={INPUT_CLASS}
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">
                        Telefon *
                      </label>
                      <input
                        name="ownerPhone"
                        type="tel"
                        required={createNewOwner}
                        className={INPUT_CLASS}
                      />
                    </div>
                    <div className="col-span-2">
                      <label className="block text-xs font-medium text-gray-700 mb-1">
                        Adres
                      </label>
                      <input
                        name="ownerAddress"
                        className={INPUT_CLASS}
                        placeholder="Ulica, miasto..."
                      />
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* buttony */}
          <div className="pt-6 border-t border-gray-100 flex justify-end gap-3 sticky bottom-0 bg-white sm:static p-4 sm:p-0 -mx-6 sm:mx-0 border-t sm:border-t-0 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)] sm:shadow-none">
            <Link
              href="/pets"
              className="px-6 py-2.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition shadow-sm"
            >
              Anuluj
            </Link>
            <button
              type="submit"
              disabled={loading}
              className="inline-flex items-center gap-2 px-6 py-2.5 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-lg hover:bg-blue-700 transition shadow-sm disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Zapisywanie...
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  Zapisz pacjenta
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
