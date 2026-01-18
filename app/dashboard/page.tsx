import { db } from "@/lib/db";
import { getSession } from "@/lib/session";
import { redirect } from "next/navigation";
import Link from "next/link";
import { 
  LucideCalendar, 
  LucideDog, 
  LucideStethoscope, 
  LucideClock,
  LucideUser
} from "lucide-react";

export default async function DashboardPage() {
  const session = await getSession();
  if (!session?.userId) redirect("/login");

  const userId = session.userId as string;
  const role = session.role as string;

  // Sprawdzamy czy użytkownik istnieje w bazie
  // Jeśli nie - przekierowujemy do logowania
  const userCheck = await db.user.findUnique({ where: { id: userId } });
  if (!userCheck) {
    redirect("/login");
  }

  // 1. WIDOK WETERYNARZA / ADMINA
  if (role === "vet" || role === "admin") {
    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0);
    const todayEnd = new Date();
    todayEnd.setHours(23, 59, 59, 999);

    const todayVisits = await db.visit.findMany({
      where: {
        date: {
          gte: todayStart,
          lte: todayEnd,
        },
      },
      include: {
        pet: { include: { owner: true } },
      },
      orderBy: { date: "asc" },
    });

    return (
      <div className="max-w-6xl mx-auto p-6 space-y-8">
        <header className="flex justify-between items-center bg-white p-6 rounded-xl shadow-sm border-l-4 border-blue-600">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Panel Lekarza</h1>
            <p className="text-gray-500">Miłego dyżuru! Dzisiaj jest {new Date().toLocaleDateString("pl-PL")}</p>
          </div>
          <div className="flex gap-3">
             <Link href="/visits" className="px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg font-medium text-sm">
               Pełny Kalendarz
             </Link>
             <Link href="/dashboard/profile" className="px-4 py-2 bg-blue-50 text-blue-600 hover:bg-blue-100 rounded-lg font-medium text-sm">
               Mój Profil
             </Link>
          </div>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-5 rounded-xl border shadow-sm flex items-center gap-4">
            <div className="p-3 bg-blue-100 text-blue-600 rounded-full">
              <LucideStethoscope size={24} />
            </div>
            <div>
              <p className="text-sm text-gray-500">Wizyty dzisiaj</p>
              <p className="text-2xl font-bold">{todayVisits.length}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
          <div className="p-6 border-b bg-gray-50 flex justify-between items-center">
            <h2 className="text-lg font-bold text-gray-800 flex items-center gap-2">
              <LucideClock className="text-blue-500" /> Harmonogram na dziś
            </h2>
          </div>
          
          {todayVisits.length === 0 ? (
            <div className="p-10 text-center text-gray-500">
              Brak wizyt zaplanowanych na dzisiaj. Czas na kawę? ☕
            </div>
          ) : (
            <div className="divide-y">
              {todayVisits.map((visit) => (
                <div key={visit.id} className="p-4 hover:bg-gray-50 flex flex-col md:flex-row justify-between items-center gap-4">
                  <div className="flex items-center gap-4">
                    <div className="text-center min-w-[60px]">
                      <span className="block text-lg font-bold text-gray-800">
                        {new Date(visit.date).toLocaleTimeString("pl-PL", { hour: '2-digit', minute:'2-digit' })}
                      </span>
                    </div>
                    <div>
                      <h3 className="font-bold text-blue-900">{visit.pet.name} ({visit.pet.species})</h3>
                      <p className="text-sm text-gray-600">
                        Właściciel: {visit.pet.owner.name} {visit.pet.owner.lastName}
                      </p>
                      <span className="inline-block px-2 py-0.5 text-xs rounded bg-blue-100 text-blue-700 mt-1">
                        {visit.type}
                      </span>
                    </div>
                  </div>
                  
                  <Link 
                    href={`/visits/${visit.id}`} 
                    className="px-4 py-2 text-sm border border-gray-300 rounded-lg hover:bg-white bg-gray-50"
                  >
                    Otwórz Kartę
                  </Link>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    );
  }

  // 2. WIDOK WŁAŚCICIELA (KLIENTA)
  const user = await db.user.findUnique({
    where: { id: userId },
    include: { 
      pets: true,
    }, 
  });

  // Dodatkowe zabezpieczenie (choć userCheck wyżej już to załatwił)
  if (!user) redirect("/login");

  const upcomingVisits = await db.visit.findMany({
    where: {
      pet: { ownerId: userId },
      date: { gte: new Date() },
      status: { not: "cancelled" }
    },
    include: { pet: true },
    orderBy: { date: "asc" },
    take: 3
  });

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-8">
      <div className="bg-white p-6 rounded-xl shadow-sm border flex flex-col md:flex-row justify-between items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">
            Cześć, {user.name}! 👋
          </h1>
          <p className="text-gray-500">Oto centrum zarządzania zdrowiem Twoich pupili.</p>
        </div>
        <Link 
          href="/dashboard/profile" 
          className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-5 py-2.5 rounded-lg transition font-medium flex items-center gap-2"
        >
          <LucideUser size={18} /> Edytuj profil
        </Link>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-gradient-to-br from-blue-50 to-white p-6 rounded-xl border border-blue-100 hover:shadow-md transition relative overflow-hidden">
          <LucideDog className="absolute right-4 top-4 text-blue-100 w-24 h-24 -z-0" />
          <h2 className="text-lg font-semibold text-blue-900 mb-2 relative z-10">Twoje Zwierzaki</h2>
          <p className="text-blue-700 mb-6 relative z-10">
            Masz zarejestrowanych: <span className="font-bold">{user.pets.length}</span> pupili.
          </p>
          <Link 
            href="/pets" 
            className="inline-block bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-bold hover:bg-blue-700 relative z-10"
          >
            Zobacz listę
          </Link>
        </div>

        <div className="bg-gradient-to-br from-green-50 to-white p-6 rounded-xl border border-green-100 hover:shadow-md transition relative overflow-hidden">
          <LucideCalendar className="absolute right-4 top-4 text-green-100 w-24 h-24 -z-0" />
          <h2 className="text-lg font-semibold text-green-900 mb-2 relative z-10">Najbliższe wizyty</h2>
          
          <div className="space-y-3 mb-4 relative z-10">
             {upcomingVisits.length === 0 ? (
               <p className="text-sm text-green-700">Brak nadchodzących wizyt.</p>
             ) : (
               upcomingVisits.map(visit => (
                 <div key={visit.id} className="text-sm bg-white/60 p-2 rounded border border-green-100">
                    <span className="font-bold">{new Date(visit.date).toLocaleDateString()}</span> - {visit.pet.name}
                 </div>
               ))
             )}
          </div>

          <Link 
            href="/visits/add" 
            className="inline-block bg-green-600 text-white px-4 py-2 rounded-lg text-sm font-bold hover:bg-green-700 relative z-10"
          >
            Umów wizytę
          </Link>
        </div>
      </div>
    </div>
  );
}