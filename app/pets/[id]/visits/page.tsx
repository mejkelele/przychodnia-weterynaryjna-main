import { db } from "@/lib/db";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import VisitSection from "@/components/VisitSection";
import { getRequiredUserContext } from "@/lib/user-context";

interface VisitsPageProps {
  params: Promise<{ id: string }>;
}

export const dynamic = "force-dynamic";

export default async function PetVisitsPage({ params }: VisitsPageProps) {
  const { userId, role, isStaff } = await getRequiredUserContext();

  const resolvedParams = await params;
  const petId = resolvedParams.id;

  // pobieranie danych
  const pet = await db.pet.findUnique({
    where: { id: petId },
    select: { id: true, name: true, ownerId: true },
  });

  if (!pet) return notFound();

  if (!isStaff && pet.ownerId !== userId) {
    return notFound();
  }

  // pobieranie wizyt
  const rawVisits = await db.visit.findMany({
    where: { petId: petId },
    orderBy: { date: "desc" },
    include: {
      vet: { select: { name: true, lastName: true } },
    },
  });

  const sanitizedVisits = rawVisits.map((visit) => ({
    ...visit,
    diagnosis: visit.diagnosis ?? "",
  }));

  return (
    <div className="max-w-5xl mx-auto p-6">
      <div className="mb-6">
        <Link
          href={`/pets/${petId}`}
          className="inline-flex items-center text-sm text-gray-500 hover:text-blue-600 transition-colors"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Wróć do profilu {pet.name}
        </Link>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border p-8">
        <div className="mb-8 border-b border-gray-100 pb-4">
          <h1 className="text-2xl font-bold text-gray-900">
            Historia Leczenia
          </h1>
          <p className="text-gray-500">
            Pacjent:{" "}
            <span className="font-semibold text-gray-900">{pet.name}</span>
          </p>
        </div>

        <VisitSection petId={pet.id} visits={sanitizedVisits} userRole={role} />
      </div>
    </div>
  );
}
