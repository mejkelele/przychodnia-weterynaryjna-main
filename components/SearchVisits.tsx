"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import {
  Search,
  Filter,
  User,
  CalendarClock,
  ArrowUp,
  ArrowDown,
  ListFilter,
} from "lucide-react";

interface SearchVisitsProps {
  isStaff: boolean;
  vets: { id: string; name: string | null; lastName: string | null }[];
  currentUserId: string;
  userRole: string;
}

export default function SearchVisits({
  isStaff,
  vets,
  currentUserId,
  userRole,
}: SearchVisitsProps) {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { replace } = useRouter();

  // Pobieranie parametrów
  const defaultVetSelection = userRole === "vet" ? currentUserId : "all";
  const vetId = searchParams.get("vetId") ?? defaultVetSelection;
  const petQuery = searchParams.get("petQuery")?.toString() || "";
  const ownerQuery = searchParams.get("ownerQuery")?.toString() || "";
  const showPast = searchParams.get("showPast") === "true";
  const status = searchParams.get("status") || ""; // NOWE: Filtr statusu

  // Sortowanie tylko po dacie
  const sortDirection = searchParams.get("sort") === "desc" ? "desc" : "asc";

  const handleSearch = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams);
    if (value) params.set(key, value);
    else params.delete(key);
    replace(`${pathname}?${params.toString()}`);
  };

  const togglePast = (checked: boolean) => {
    const params = new URLSearchParams(searchParams);
    if (checked) params.set("showPast", "true");
    else params.delete("showPast");
    replace(`${pathname}?${params.toString()}`);
  };

  const toggleDateSort = () => {
    const newDirection = sortDirection === "asc" ? "desc" : "asc";
    handleSearch("sort", newDirection);
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-200 mb-8 p-4 max-w-6xl mx-auto">
      <div className="flex flex-col gap-4">
        {/* Wiersz 1: Wyszukiwarki Tekstowe */}
        <div className="flex flex-col md:flex-row gap-0 border rounded-xl overflow-hidden border-gray-200">
          <div className="relative flex-1 group bg-white">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400 group-focus-within:text-blue-500 transition-colors" />
            </div>
            <input
              type="text"
              className="block w-full pl-12 pr-4 py-3 bg-transparent border-none text-base focus:ring-0 placeholder:text-gray-400 text-gray-900"
              placeholder="Szukaj wizyty (imię zwierzaka)..."
              defaultValue={petQuery}
              onChange={(e) => handleSearch("petQuery", e.target.value)}
            />
          </div>

          {isStaff && (
            <>
              <div className="hidden md:block w-px bg-gray-200"></div>
              <div className="relative flex-1 group bg-white border-t md:border-t-0 border-gray-200">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <User className="h-5 w-5 text-gray-400 group-focus-within:text-purple-500 transition-colors" />
                </div>
                <input
                  type="text"
                  className="block w-full pl-12 pr-4 py-3 bg-transparent border-none text-base focus:ring-0 placeholder:text-gray-400 text-gray-900"
                  placeholder="Właściciel (imię, nazwisko)..."
                  defaultValue={ownerQuery}
                  onChange={(e) => handleSearch("ownerQuery", e.target.value)}
                />
              </div>
            </>
          )}
        </div>

        {/* Wiersz 2: Filtry (Lewa) i Sortowanie (Prawa) */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex flex-col sm:flex-row items-center gap-3 w-full sm:w-auto">
            {/* 1. Filtr Statusu (NOWE) */}
            <div className="relative w-full sm:w-48 group">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <ListFilter className="h-4 w-4 text-gray-400" />
              </div>
              <select
                className="block w-full pl-10 pr-8 py-2 bg-white border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 cursor-pointer text-gray-700 appearance-none shadow-sm"
                value={status}
                onChange={(e) => handleSearch("status", e.target.value)}
              >
                <option value="">Status</option>
                <option value="pending">Planowana</option>
                <option value="confirmed">Potwierdzona</option>
                <option value="completed">Zakończona</option>
                <option value="cancelled">Anulowana</option>
              </select>
            </div>

            {isStaff && (
              <div className="relative w-full sm:w-48 group">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Filter className="h-4 w-4 text-gray-400" />
                </div>
                <select
                  className="block w-full pl-10 pr-8 py-2 bg-white border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 cursor-pointer text-gray-700 appearance-none shadow-sm"
                  value={vetId}
                  onChange={(e) => handleSearch("vetId", e.target.value)}
                >
                  <option value="all">Wszyscy lekarze</option>
                  {vets.map((vet) => (
                    <option key={vet.id} value={vet.id}>
                      Lek. {vet.name} {vet.lastName}
                    </option>
                  ))}
                </select>
              </div>
            )}

            {/* 3. Checkbox Historia */}
            <label className="flex items-center gap-2 cursor-pointer bg-gray-50 px-3 py-2 rounded-lg border border-gray-200 hover:bg-gray-100 transition-colors select-none w-full sm:w-auto justify-center sm:justify-start">
              <input
                type="checkbox"
                className="w-4 h-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
                checked={showPast}
                onChange={(e) => togglePast(e.target.checked)}
              />
              <span className="text-sm font-medium text-gray-700 whitespace-nowrap">
                Pokaż historyczne wizyty
              </span>
            </label>
          </div>

          {/* PRAWA STRONA: SORTOWANIE (Tylko Data) */}
          <div className="w-full sm:w-auto flex justify-end">
            <button
              onClick={toggleDateSort}
              className="flex items-center gap-2 px-4 py-2 rounded-lg border border-gray-200 bg-gray-50 hover:bg-gray-100 transition-colors group w-full sm:w-auto justify-center"
              title="Zmień kolejność sortowania"
            >
              <span className="text-sm font-medium text-gray-700">Data</span>
              {sortDirection === "asc" ? (
                <ArrowUp className="w-4 h-4 text-blue-600 font-bold" />
              ) : (
                <ArrowDown className="w-4 h-4 text-blue-600 font-bold" />
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
