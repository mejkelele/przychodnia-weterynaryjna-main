import Link from "next/link";
import { Calendar, Heart, Bell } from "lucide-react"; // Używamy ikonek, które zainstalowałeś

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center py-20 px-4">
      <div className="text-center space-y-6 max-w-3xl">
        <h1 className="text-4xl md:text-6xl font-bold text-gray-900 tracking-tight">
          Witaj w Przychodni <span className="text-blue-600">Weteryniarz</span>
        </h1>

        <p className="text-xl text-gray-600">
          Zadbaj o zdrowie zwierzaka. Umów wizytę, sprawdź historię leczenia
          <br />i zarządzaj profilami zwierząt.
        </p>

        <div className="flex justify-center gap-4 mt-8">
          <Link
            href="/pets"
            className="bg-blue-600 text-white px-8 py-4 rounded-xl font-semibold hover:bg-blue-700 transition shadow-lg flex items-center gap-2"
          >
            <Heart className="w-5 h-5" />
            Pacjenci
          </Link>
          <Link
            href="/dashboard"
            className="bg-white text-blue-600 border border-blue-600 px-8 py-4 rounded-xl font-semibold hover:bg-blue-50 transition shadow flex items-center gap-2"
          >
            Twój Profil
          </Link>
        </div>
      </div>

      {/* Sekcja informacyjna - Karty */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-24 w-full max-w-6xl">
        <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition">
          <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center text-blue-600 mb-4">
            <Calendar className="w-6 h-6" />
          </div>
          <h3 className="text-xl font-bold text-gray-800 mb-2">
            Umawianie wizyt
          </h3>
          <p className="text-gray-600">
            Dostęp do kalendarza i rezerwacja terminów online bez dzwonienia.
          </p>
        </div>

        <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition">
          <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center text-orange-600 mb-4">
            <Heart className="w-6 h-6" />
          </div>
          <h3 className="text-xl font-bold text-gray-800 mb-2">
            Zdrowie pupila
          </h3>
          <p className="text-gray-600">
            Pełna historia leczenia i kompletne dane Twoich zwierząt w jednym
            miejscu.
          </p>
        </div>

        <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition">
          <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center text-green-600 mb-4">
            <Bell className="w-6 h-6" />
          </div>
          <h3 className="text-xl font-bold text-gray-800 mb-2">
            Powiadomienia
          </h3>
          <p className="text-gray-600">
            Przypomnienia o nadchodzących szczepieniach i wizytach kontrolnych.
          </p>
        </div>
      </div>
    </div>
  );
}
