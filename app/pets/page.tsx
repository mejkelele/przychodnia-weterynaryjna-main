import { getAllPets } from "@/lib/api";
import PetCard from "@/components/PetCard";
import Link from "next/link";
import { Plus } from "lucide-react";

export default async function PetsPage() {
  const pets = await getAllPets();

  return (
    <div className="max-w-7xl mx-auto">
      {/* Nagłówek */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 ">Pacjenci</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1 text-sm">
            Zarządzanie kartoteką i historią
          </p>
        </div>

        {/* Add button */}
        <Link
          href="/pets/add"
          className="inline-flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-xl font-medium transition-colors shadow-sm text-sm"
        >
          <Plus className="w-4 h-4" />
          Dodaj zwierzaka
        </Link>
      </div>

      {/* Karty */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {pets.map((pet) => (
          <PetCard key={pet.id} pet={pet} />
        ))}
      </div>

      {/* Stan pusty (gdy brak danych) */}
      {pets.length === 0 && (
        <div className="text-center py-12 px-4 border-2 border-dashed border-gray-200  rounded-2xl bg-gray-50 ">
          <div className="mx-auto w-12 h-12 text-gray-400 mb-3">
            <Plus className="w-12 h-12" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 ">Brak pacjentów</h3>
          <p className="text-gray-500  mt-1 max-w-sm mx-auto">
            Dodaj rekordy do bazy
          </p>
        </div>
      )}
    </div>
  );
}
