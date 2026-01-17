"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Search, Filter, User } from "lucide-react";

// Definiujemy, że komponent przyjmuje prop isStaff
interface SearchPetsProps {
  isStaff: boolean;
}

export default function SearchPets({ isStaff }: SearchPetsProps) {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { replace } = useRouter();

  const currentQuery = searchParams.get("query")?.toString() || "";
  const currentOwnerQuery = searchParams.get("ownerQuery")?.toString() || "";
  const currentSpecies = searchParams.get("species")?.toString() || "";

  const handleSearch = (
    term: string,
    type: "query" | "species" | "ownerQuery",
  ) => {
    const params = new URLSearchParams(searchParams);

    if (term) {
      params.set(type, term);
    } else {
      params.delete(type);
    }

    replace(`${pathname}?${params.toString()}`);
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-200 mb-8 p-2 max-w-5xl mx-auto">
      <div className="flex flex-col md:flex-row gap-0">
        {/* === 1. SZUKANIE PACJENTA (Dla wszystkich) === */}
        <div className="relative flex-1 group">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-gray-400 group-focus-within:text-blue-500 transition-colors" />
          </div>
          <input
            type="text"
            className="block w-full pl-12 pr-4 py-3 bg-transparent border-none text-base focus:ring-0 placeholder:text-gray-400 text-gray-900"
            placeholder="Szukaj pacjenta..."
            defaultValue={currentQuery}
            onChange={(e) => handleSearch(e.target.value, "query")}
          />
        </div>

        {/* Separator 1 (Zawsze widoczny, bo oddziela Query od kolejnego elementu) */}
        <div className="hidden md:block w-px bg-gray-200 my-2 mx-1"></div>
        <div className="block md:hidden h-px bg-gray-200 mx-2 my-1"></div>

        {/* === 2. SZUKANIE WŁAŚCICIELA (Tylko dla personelu!) === */}
        {isStaff && (
          <>
            <div className="relative flex-1 group">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <User className="h-5 w-5 text-gray-400 group-focus-within:text-purple-500 transition-colors" />
              </div>
              <input
                type="text"
                className="block w-full pl-12 pr-4 py-3 bg-transparent border-none text-base focus:ring-0 placeholder:text-gray-400 text-gray-900"
                placeholder="Właściciel (imię, tel...)"
                defaultValue={currentOwnerQuery}
                onChange={(e) => handleSearch(e.target.value, "ownerQuery")}
              />
            </div>

            {/* Separator 2 (Widoczny tylko gdy jest Owner input) */}
            <div className="hidden md:block w-px bg-gray-200 my-2 mx-1"></div>
            <div className="block md:hidden h-px bg-gray-200 mx-2 my-1"></div>
          </>
        )}

        {/* === 3. FILTR GATUNKU (Dla wszystkich) === */}
        <div className="relative md:w-56 group">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <Filter className="h-5 w-5 text-gray-400 group-focus-within:text-blue-500 transition-colors" />
          </div>
          <select
            className="block w-full pl-12 pr-10 py-3 bg-transparent border-none text-base focus:ring-0 cursor-pointer text-gray-700 appearance-none"
            value={currentSpecies}
            onChange={(e) => handleSearch(e.target.value, "species")}
          >
            <option value="">Wszystkie</option>
            <option value="pies">Pies</option>
            <option value="kot">Kot</option>
            <option value="inne">Inne</option>
          </select>
        </div>
      </div>
    </div>
  );
}
