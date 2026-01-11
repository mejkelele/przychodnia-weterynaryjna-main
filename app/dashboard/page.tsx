// app/dashboard/page.tsx
import { getSession } from "@/lib/session";
import { db } from "@/lib/db";
import { redirect } from "next/navigation";
import Link from "next/link";
import { User, Stethoscope, Calendar, Settings } from "lucide-react";

export default async function DashboardPage() {
  // 1. Sprawdź sesję
  const session = await getSession();
  if (!session || !session.userId) {
    redirect("/login");
  }

  // 2. Pobierz dane użytkownika z bazy
  const user = await db.user.findUnique({
    where: { id: session.userId as string },
    include: {
      pets: true, // Pobierz zwierzaki właściciela
      vetVisits: { // Pobierz wizyty (jeśli to weterynarz)
        include: { pet: true, vet: true },
        take: 5,
        orderBy: { date: 'desc' }
      }
    },
  });

  if (!user) {
    redirect("/login");
  }

  const isVet = user.role === "vet" || user.role === "admin";

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">
          Witaj, {user.name}!
        </h1>
        <p className="text-gray-500 mt-1">
          Twoja rola: <span className="font-semibold text-blue-600">{isVet ? "Weterynarz" : "Właściciel"}</span>
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* KARTA 1: Szybkie akcje */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-blue-100 rounded-lg text-blue-600">
              <User className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900">Twoje konto</h3>
          </div>
          <div className="space-y-2 text-sm text-gray-600">
            <p>Email: {user.email}</p>
            <p>Telefon: {user.phone || "Brak"}</p>
          </div>
          <div className="mt-6">
             <button className="text-sm font-medium text-blue-600 hover:underline">
               Edytuj profil (wkrótce)
             </button>
          </div>
        </div>

        {/* KARTA 2: Statystyki / Zwierzaki */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 md:col-span-2">
          {isVet ? (
            // WIDOK DLA WETERYNARZA
            <>
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-green-100 rounded-lg text-green-600">
                  <Stethoscope className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900">Ostatnie wizyty</h3>
              </div>
              {user.vetVisits.length > 0 ? (
                <ul className="divide-y divide-gray-100">
                  {user.vetVisits.map((visit) => (
                    <li key={visit.id} className="py-3 flex justify-between text-sm">
                      <div>
                        <span className="font-medium text-gray-900">{visit.pet.name}</span>
                        <span className="text-gray-500"> ({visit.type})</span>
                      </div>
                      <span className="text-gray-400">
                        {new Date(visit.date).toLocaleDateString("pl-PL")}
                      </span>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-gray-500 text-sm">Brak ostatnich wizyt.</p>
              )}
              <div className="mt-4">
                <Link href="/visits" className="text-sm font-medium text-blue-600 hover:underline">
                  Zobacz wszystkie wizyty &rarr;
                </Link>
              </div>
            </>
          ) : (
            // WIDOK DLA WŁAŚCICIELA
            <>
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-orange-100 rounded-lg text-orange-600">
                  <User className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900">Twoje Zwierzaki</h3>
              </div>
              {user.pets.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {user.pets.map((pet) => (
                    <Link 
                      key={pet.id} 
                      href={`/pets/${pet.id}`}
                      className="block p-4 border border-gray-200 rounded-xl hover:border-blue-300 transition"
                    >
                      <p className="font-bold text-gray-900">{pet.name}</p>
                      <p className="text-sm text-gray-500">{pet.species} • {pet.breed || "Mieszaniec"}</p>
                    </Link>
                  ))}
                </div>
              ) : (
                <div className="text-center py-6">
                  <p className="text-gray-500 mb-3">Nie masz jeszcze przypisanych zwierzaków.</p>
                  <Link 
                    href="/pets/add" 
                    className="inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
                  >
                    Dodaj zwierzaka
                  </Link>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}