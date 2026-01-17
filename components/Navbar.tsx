import Link from "next/link";
import { getSession } from "@/lib/session";
import { logoutAction } from "@/lib/auth";
import { LucideLogOut, LucideUser, LucidePawPrint, LucideCalendar } from "lucide-react";

export default async function Navbar() {
  const session = await getSession();
  // Czyścimy rolę, żeby łatwiej sprawdzać
  const role = session?.role?.trim().toLowerCase();
  const isVet = role === "vet" || role === "admin";

  return (
    <nav className="bg-white border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          
          {/* LOGO */}
          <div className="flex items-center">
            <Link href="/dashboard" className="flex items-center gap-2 text-xl font-bold text-blue-600">
              <LucidePawPrint />
              <span>Przychodnia</span>
            </Link>
            
            {/* LINKI GŁÓWNE */}
            {session?.userId && (
              <div className="hidden md:flex ml-10 space-x-8">
                <Link href="/dashboard" className="text-gray-700 hover:text-blue-600 px-3 py-2 text-sm font-medium">
                  Pulpit
                </Link>
                
                {/* WETERYNARZ WIDZI: Wszystkie wizyty */}
                {isVet && (
                  <Link href="/visits" className="text-gray-700 hover:text-blue-600 px-3 py-2 text-sm font-medium flex items-center gap-1">
                    <LucideCalendar size={16} /> Grafik Wizyt
                  </Link>
                )}

                {/* KLIENT WIDZI: Moje Zwierzaki (Weterynarz też może widzieć listę wszystkich) */}
                <Link href="/pets" className="text-gray-700 hover:text-blue-600 px-3 py-2 text-sm font-medium">
                  {isVet ? "Kartoteki Pacjentów" : "Moje Zwierzaki"}
                </Link>
              </div>
            )}
          </div>

          {/* PRAWA STRONA (Profil / Wyloguj) */}
          <div className="flex items-center gap-4">
            {session?.userId ? (
              <>
                <div className="flex items-center gap-4">
                  <span className="text-sm text-gray-500 hidden sm:inline">
                    {isVet ? "👨‍⚕️ Lekarz" : "👤 Opiekun"}
                  </span>
                  
                  <Link href="/dashboard/profile" className="text-gray-500 hover:text-blue-600" title="Profil">
                    <LucideUser size={20} />
                  </Link>

                  <form action={logoutAction}>
                    <button className="text-gray-500 hover:text-red-600 transition" title="Wyloguj">
                      <LucideLogOut size={20} />
                    </button>
                  </form>
                </div>
              </>
            ) : (
              <div className="flex gap-4">
                <Link href="/login" className="text-gray-700 hover:text-blue-600 font-medium">
                  Zaloguj
                </Link>
                <Link href="/register" className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition">
                  Rejestracja
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}