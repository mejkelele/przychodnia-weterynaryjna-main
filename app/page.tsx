import Link from "next/link";
import { getSession } from "@/lib/session";
import {
  LucideDog,
  LucideCat,
  LucideCalendar,
  LucideHeartPulse,
  LucideShieldCheck,
  LucideLayoutDashboard,
  LucideFileText,
} from "lucide-react";

export default async function LandingPage() {
  // 1. Pobieramy sesję
  const session = await getSession();
  const user = session?.userId;

  // 2. Sprawdzamy rolę (bezpieczne rzutowanie, żeby TS nie krzyczał)
  const role = (session?.role as string)?.trim().toLowerCase();
  const isVet = role === "vet" || role === "admin";

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      {/* 1. HERO SECTION */}
      <header className="container mx-auto px-6 py-16 md:py-24 flex flex-col items-center text-center">
        <div className="bg-blue-100 p-4 rounded-full mb-6 animate-bounce">
          <LucideDog className="w-12 h-12 text-blue-600" />
        </div>
        <h1 className="text-4xl md:text-6xl font-extrabold text-gray-900 mb-6 tracking-tight animate-bounce">
          Dbanie o pupila <br />
          <span className="text-blue-600">zaczyna się tutaj.</span>
        </h1>
        <p className="text-lg md:text-xl text-gray-600 max-w-2xl mb-10 leading-relaxed animate-bounce">
          Nie bądź NPC, zadbaj o swojego sigmę. Sprawdzamy zdrowie, żeby Twój
          zwierzak miał +100 do rizzu na dzielni. Zero fanum tax, sama baza. To
          jest totalnie LEGALNE!
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          {!user ? (
            /* --- WIDOK DLA NIEZALOGOWANYCH --- */
            <>
              <Link
                href="/login"
                className="px-8 py-4 bg-blue-600 text-white font-bold rounded-xl shadow-lg hover:bg-blue-700 hover:shadow-xl transition transform hover:-translate-y-1"
              >
                Zaloguj się
              </Link>
              <Link
                href="/register"
                className="px-8 py-4 bg-white text-blue-600 font-bold border border-blue-200 rounded-xl shadow-sm hover:bg-gray-50 transition"
              >
                Załóż konto
              </Link>
            </>
          ) : (
            /* --- WIDOK DLA ZALOGOWANYCH --- */
            <>
              {isVet ? (
                /* WIDOK DLA WETERYNARZA */
                <>
                  <Link
                    href="/visits"
                    className="flex items-center gap-2 px-8 py-4 bg-blue-600 text-white font-bold rounded-xl shadow-lg hover:bg-blue-700 hover:shadow-xl transition transform hover:-translate-y-1"
                  >
                    <LucideCalendar className="w-5 h-5" />
                    Grafik wizyt
                  </Link>
                  <Link
                    href="/pets"
                    className="flex items-center gap-2 px-8 py-4 bg-white text-blue-600 font-bold border border-blue-200 rounded-xl shadow-sm hover:bg-gray-50 transition"
                  >
                    <LucideFileText className="w-5 h-5" />
                    Kartoteki pacjentów
                  </Link>
                </>
              ) : (
                /* WIDOK DLA WŁAŚCICIELA */
                <>
                  <Link
                    href="/dashboard"
                    className="flex items-center gap-2 px-8 py-4 bg-blue-600 text-white font-bold rounded-xl shadow-lg hover:bg-blue-700 hover:shadow-xl transition transform hover:-translate-y-1"
                  >
                    <LucideLayoutDashboard className="w-5 h-5" />
                    Pulpit
                  </Link>
                  <Link
                    href="/pets"
                    className="flex items-center gap-2 px-8 py-4 bg-white text-blue-600 font-bold border border-blue-200 rounded-xl shadow-sm hover:bg-gray-50 transition"
                  >
                    <LucideDog className="w-5 h-5" />
                    Moje Zwierzaki
                  </Link>
                </>
              )}
            </>
          )}
        </div>
      </header>

      {/* 2. FEATURES SECTION */}
      <section className="bg-white py-20">
        <div className="container mx-auto px-6">
          <h2 className="text-3xl font-bold text-center text-gray-800 mb-16">
            Dlaczego my?
          </h2>

          <div className="grid md:grid-cols-3 gap-10">
            {/* Feature 1 */}
            <div className="p-8 border border-gray-100 rounded-2xl shadow-sm hover:shadow-md transition">
              <LucideCalendar className="w-10 h-10 text-green-500 mb-4" />
              <h3 className="text-xl font-bold mb-3">Wizyty Online</h3>
              <p className="text-gray-600">
                Rezerwuj terminy 24/7. Wybierz lekarza, rodzaj zabiegu i dogodną
                godzinę w kilka kliknięć.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="p-8 border border-gray-100 rounded-2xl shadow-sm hover:shadow-md transition">
              <LucideHeartPulse className="w-10 h-10 text-red-500 mb-4" />
              <h3 className="text-xl font-bold mb-3">Pełna Historia</h3>
              <p className="text-gray-600">
                Dostęp do diagnoz, wyników badań i historii szczepień Twojego
                zwierzaka w jednym miejscu.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="p-8 border border-gray-100 rounded-2xl shadow-sm hover:shadow-md transition">
              <LucideShieldCheck className="w-10 h-10 text-purple-500 mb-4" />
              <h3 className="text-xl font-bold mb-3">Doświadczony Zespół</h3>
              <p className="text-gray-600">
                Nasi specjaliści to pasjonaci z wieloletnim doświadczeniem w
                leczeniu psów, kotów i zwierząt egzotycznych.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
