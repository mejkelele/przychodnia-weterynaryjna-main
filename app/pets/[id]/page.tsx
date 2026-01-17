import { notFound, redirect } from "next/navigation";
import { db } from "@/lib/db";
import Link from "next/link";
import {
  ArrowLeft,
  Stethoscope,
  CalendarPlus,
  User as UserIcon,
  Info,
  CalendarDays,
  Weight,
  Pencil,
  Dog,
  Cat,
  HelpCircle,
  Activity,
} from "lucide-react";
import DeletePetButton from "@/components/DeletePetButton";
import Image from "next/image";
// Upewnij się, że masz ten plik w lib/user-context.ts (wersja z isStaff)
import { getRequiredUserContext } from "@/lib/user-context";

interface PetPageProps {
  params: Promise<{ id: string }>;
}

// --- FUNKCJE POMOCNICZE (bez zmian) ---

function formatAge(birthDate: Date | string) {
  const birth = new Date(birthDate);
  const today = new Date();
  if (isNaN(birth.getTime())) return "-";
  const diffTime = Math.abs(today.getTime() - birth.getTime());
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  if (diffDays < 35) {
    const weeks = Math.floor(diffDays / 7);
    if (weeks <= 1) return "1 tydzień";
    if (weeks >= 2 && weeks <= 4) return `${weeks} tygodnie`;
    return `${weeks} tygodni`;
  }
  if (diffDays < 365) {
    const months = Math.floor(diffDays / 30);
    if (months <= 1) return "1 miesiąc";
    if (months >= 2 && months <= 4) return `${months} miesiące`;
    return `${months} miesięcy`;
  }
  const years = today.getFullYear() - birth.getFullYear();
  if (years === 1) return "1 rok";
  if (
    years % 10 >= 2 &&
    years % 10 <= 4 &&
    (years % 100 < 10 || years % 100 >= 20)
  )
    return `${years} lata`;
  return `${years} lat`;
}

function formatSex(sex: string) {
  switch (sex) {
    case "male":
      return "Samiec";
    case "female":
      return "Samica";
    default:
      return "Nieznana";
  }
}

function SpeciesIcon({ species }: { species: string }) {
  const s = species?.toLowerCase() || "";
  if (s === "pies") return <Dog className="w-8 h-8 text-blue-500" />;
  if (s === "kot") return <Cat className="w-8 h-8 text-orange-500" />;
  return <HelpCircle className="w-8 h-8 text-gray-400" />;
}

function getActivityStatus(lastVisitDate?: Date) {
  if (!lastVisitDate)
    return { label: "Nowy", color: "bg-blue-100 text-blue-700" };
  const sixMonthsAgo = new Date();
  sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);
  if (new Date(lastVisitDate) > sixMonthsAgo) {
    return { label: "Aktywny", color: "bg-green-100 text-green-700" };
  }
  return { label: "Nieaktywny", color: "bg-gray-100 text-gray-500" };
}

// --- GŁÓWNY KOMPONENT ---

export default async function PetPage({ params }: PetPageProps) {
  // 1. Pobieramy kontekst i flagę isStaff (czy to weterynarz/admin)
  const { userId, isStaff } = await getRequiredUserContext();
  const resolvedParams = await params;

  // 2. Pobieramy dane z bazy
  const pet = await db.pet.findUnique({
    where: { id: resolvedParams.id },
    include: {
      owner: {
        select: {
          name: true,
          lastName: true,
          email: true,
          phone: true,
        },
      },
      visits: {
        take: 1,
        orderBy: { date: "desc" },
        select: { date: true, type: true },
      },
    },
  });

  if (!pet) return notFound();

  // 3. SPRAWDZENIE BEZPIECZEŃSTWA (Tego brakowało!)
  const isPetOwner = pet.ownerId === userId;

  // Jeśli NIE jesteś właścicielem I NIE jesteś personelem -> Blokada
  if (!isPetOwner && !isStaff) {
    return notFound(); // Lub redirect('/pets')
  }

  // 4. Logika UI
  const canManage = isPetOwner || isStaff;
  const ageString = formatAge(pet.birthDate);
  const lastVisit = pet.visits[0];
  const status = getActivityStatus(lastVisit?.date);

  return (
    <div className="max-w-5xl mx-auto p-6">
      <Link
        href="/pets"
        className="inline-flex items-center text-sm text-gray-500 hover:text-blue-600 mb-6 transition-colors group"
      >
        <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" />
        Wróć do listy pacjentów
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* LEWA KOLUMNA (Zdjęcie, Wiek, Gatunek) */}
        <div className="lg:col-span-1 space-y-4">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 flex items-center justify-center relative group">
            <div
              className={`absolute top-4 right-4 px-2.5 py-1 rounded-md text-xs font-bold uppercase tracking-wider ${status.color}`}
            >
              {status.label}
            </div>

            {pet.imageUrl ? (
              <div className="relative w-full aspect-square rounded-xl overflow-hidden shadow-inner">
                <Image
                  src={pet.imageUrl}
                  alt={pet.name}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                />
              </div>
            ) : (
              <div className="w-full aspect-square bg-gray-50 rounded-xl flex flex-col items-center justify-center text-gray-400 border-2 border-dashed border-gray-200">
                <div className="bg-white p-4 rounded-full shadow-sm mb-3">
                  <SpeciesIcon species={pet.species} />
                </div>
                <span className="text-sm font-medium">Brak zdjęcia</span>
              </div>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="bg-white rounded-xl border border-gray-100 p-4 text-center shadow-sm">
              <p className="text-xs text-gray-400 uppercase tracking-wider font-bold mb-1">
                Wiek
              </p>
              <p className="text-lg font-bold text-gray-900">{ageString}</p>
            </div>
            <div className="bg-white rounded-xl border border-gray-100 p-4 text-center shadow-sm">
              <p className="text-xs text-gray-400 uppercase tracking-wider font-bold mb-1">
                Gatunek
              </p>
              <p className="text-lg font-bold text-gray-900 capitalize">
                {pet.species}
              </p>
            </div>
          </div>
        </div>

        {/* PRAWA KOLUMNA (Dane główne, Właściciel, Akcje) */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 sm:p-8">
            <div className="flex flex-col sm:flex-row justify-between items-start gap-6 mb-8 border-b border-gray-100 pb-8">
              <div>
                <h1 className="text-4xl font-bold text-gray-900 mb-2">
                  {pet.name}
                </h1>
                <div className="flex items-center gap-2 text-gray-500 text-lg">
                  <span className="font-medium text-gray-700 capitalize">
                    {pet.breed || "Brak rasy"}
                  </span>
                </div>
              </div>

              <div className="flex flex-col gap-2 w-full sm:w-auto">
                <Link
                  href={`/visits/add?petId=${pet.id}`}
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-green-600 text-white hover:bg-green-700 px-5 py-2.5 rounded-xl font-medium transition-all shadow-sm hover:shadow-green-100"
                >
                  <CalendarPlus className="w-5 h-5" />
                  Umów wizytę
                </Link>

                <Link
                  href={`/pets/${pet.id}/visits`}
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-white text-blue-700 border border-blue-200 hover:bg-blue-50 px-5 py-2.5 rounded-xl font-medium transition-colors"
                >
                  <Stethoscope className="w-5 h-5" />
                  Historia leczenia
                </Link>

                {canManage && (
                  <div className="flex items-center gap-2 w-full sm:w-auto mt-2 pt-2 border-t sm:border-t-0 border-gray-100">
                    <Link
                      href={`/pets/${pet.id}/edit`}
                      className="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 bg-gray-50 text-gray-700 hover:bg-gray-100 border border-gray-200 px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                    >
                      <Pencil className="w-4 h-4" />
                      Edytuj
                    </Link>
                    <DeletePetButton petId={pet.id} />
                  </div>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <h3 className="flex items-center gap-2 font-bold text-gray-900 mb-4 uppercase text-xs tracking-wider">
                  <Info className="w-4 h-4 text-blue-500" /> Cechy fizyczne
                </h3>
                <ul className="space-y-4 text-sm">
                  <li className="flex justify-between items-center pb-2 border-b border-gray-50">
                    <span className="text-gray-500 flex items-center gap-2">
                      <Weight className="w-4 h-4" /> Waga
                    </span>
                    <span className="font-semibold text-gray-900">
                      {pet.weight} kg
                    </span>
                  </li>
                  <li className="flex justify-between items-center pb-2 border-b border-gray-50">
                    <span className="text-gray-500 flex items-center gap-2">
                      <HelpCircle className="w-4 h-4" /> Płeć
                    </span>
                    <span className="font-semibold text-gray-900">
                      {formatSex(pet.sex)}
                    </span>
                  </li>
                  <li className="flex justify-between items-center pb-2 border-b border-gray-50">
                    <span className="text-gray-500 flex items-center gap-2">
                      <CalendarDays className="w-4 h-4" /> Data urodzenia
                    </span>
                    <span className="font-semibold text-gray-900">
                      {new Date(pet.birthDate).toLocaleDateString("pl-PL")}
                    </span>
                  </li>
                </ul>
              </div>

              <div>
                <h3 className="flex items-center gap-2 font-bold text-gray-900 mb-4 uppercase text-xs tracking-wider">
                  <UserIcon className="w-4 h-4 text-purple-500" /> Dane
                  Właściciela
                </h3>
                <div className="bg-gray-50 rounded-xl p-4 border border-gray-100">
                  <p className="font-bold text-gray-900 text-base mb-1">
                    {pet.owner.name} {pet.owner.lastName}
                  </p>
                  <p className="text-gray-500 text-xs mb-3 flex items-center gap-1">
                    {pet.owner.email}
                  </p>
                  <div className="pt-3 border-t border-gray-200 mt-3">
                    <p className="text-xs text-gray-500 mb-1 flex items-center gap-1">
                      <Activity className="w-3 h-3" /> Ostatnia wizyta:
                    </p>
                    <p className="font-medium text-gray-900 text-sm">
                      {lastVisit
                        ? `${new Date(lastVisit.date).toLocaleDateString("pl-PL")} (${lastVisit.type})`
                        : "Brak historii wizyt"}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {pet.notes && (
              <div className="mt-8 pt-6 border-t border-gray-100">
                <h3 className="font-bold text-gray-900 mb-3 text-sm flex items-center gap-2">
                  Notatki
                </h3>
                <div className="bg-yellow-50 p-5 rounded-xl border border-yellow-100 text-gray-700 text-sm leading-relaxed italic relative">
                  <span className="absolute top-2 left-2 text-yellow-200 text-4xl leading-none opacity-50 font-serif">
                    &ldquo;
                  </span>
                  <span className="relative z-10 px-2">{pet.notes}</span>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
