import { db } from "@/lib/db";
import { getSession } from "@/lib/session";
import { redirect } from "next/navigation";
import Link from "next/link";
import { LucideArrowLeft } from "lucide-react";
import DownloadHistoryButton from "@/components/MedicalHistoryPDF"; // <--- NOWY IMPORT

export default async function MedicalHistoryPage({
  params,
}: {
  params: { id: string };
}) {
  // Fix dla Next.js 15+ (await params)
  const resolvedParams = await params;
  const petId = resolvedParams.id;

  const session = await getSession();
  if (!session?.userId) redirect("/login");

  const pet = await db.pet.findUnique({
    where: { id: petId },
    include: {
      owner: true,
      visits: {
        where: { status: "confirmed" },
        orderBy: { date: "desc" },
        include: { vet: true },
      },
    },
  });

  if (!pet) return <div className="p-6">Nie znaleziono zwierzęcia</div>;

  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Pasek nawigacyjny */}
      <div className="bg-white border-b px-6 py-4 flex justify-between items-center sticky top-0 z-10 shadow-sm">
        <Link
          href={`/pets/${petId}`}
          className="flex items-center gap-2 text-gray-600 hover:text-black transition"
        >
          <LucideArrowLeft size={20} /> Wróć do profilu
        </Link>

        {/* TU JEST NASZ NOWY PRZYCISK PDF */}
        <DownloadHistoryButton pet={pet} />
      </div>

      {/* Podgląd HTML dla użytkownika (żeby widział co pobiera) */}
      <div className="max-w-4xl mx-auto p-8 my-8 bg-white shadow-lg rounded-xl border">
        <header className="border-b pb-6 mb-6 flex justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">
              KARTA HISTORII CHOROBY
            </h1>
            <p className="text-gray-500">Pacjent: {pet.name}</p>
          </div>
          <div className="text-right text-sm text-gray-500">
            Data: {new Date().toLocaleDateString()}
          </div>
        </header>

        <div className="space-y-6">
          {pet.visits.length === 0 ? (
            <p className="text-gray-500 italic text-center py-10">
              Brak wpisów w historii.
            </p>
          ) : (
            pet.visits.map((visit) => (
              <div key={visit.id} className="border-b last:border-0 pb-6">
                <div className="flex justify-between items-start mb-2">
                  <span className="font-bold text-blue-900">
                    {new Date(visit.date).toLocaleDateString()}
                  </span>
                  <span className="px-2 py-1 bg-gray-100 rounded text-xs font-bold uppercase text-gray-600">
                    {visit.type}
                  </span>
                </div>
                <p className="text-gray-800 mb-2">{visit.description}</p>
                {visit.diagnosis && (
                  <div className="bg-red-50 text-red-800 p-3 rounded-md text-sm font-medium border border-red-100">
                    Diagnoza: {visit.diagnosis}
                  </div>
                )}
                {visit.vet && (
                  <p className="text-xs text-gray-400 mt-2 text-right">
                    Lek. {visit.vet.name} {visit.vet.lastName}
                  </p>
                )}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
