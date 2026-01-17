// app/visits/[id]/page.tsx

import { db } from "@/lib/db";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import VisitDetailsManager from "@/components/VisitDetailsManager";
import { getRequiredUserContext } from "@/lib/user-context";

interface VisitDetailsPageProps {
  params: Promise<{ id: string }>;
}

export const dynamic = "force-dynamic";

export default async function VisitDetailsPage({
  params,
}: VisitDetailsPageProps) {
  const { userId, isStaff } = await getRequiredUserContext();

  const visitId = (await params).id;

  const visit = await db.visit.findUnique({
    where: { id: visitId },
    include: {
      pet: { include: { owner: true } },
      vet: true,
    },
  });

  if (!visit) return notFound();

  if (!isStaff && visit.pet.ownerId !== userId) {
    return notFound();
  }

  const sanitizedVisit = {
    ...visit,
    diagnosis: visit.diagnosis ?? "",
    pet: {
      ...visit.pet,
      breed: visit.pet.breed ?? "",
      species: visit.pet.species ?? "Nieznany",
    },
  };

  return (
    <div className="max-w-3xl mx-auto p-6">
      <Link
        href="/visits"
        className="inline-flex items-center text-sm text-gray-500 hover:text-blue-600 mb-6 transition"
      >
        <ArrowLeft className="w-4 h-4 mr-2" />
        Wróć do terminarza
      </Link>

      {/* wyczyszczone dane */}
      <VisitDetailsManager visit={sanitizedVisit} isStaff={!!isStaff} />
    </div>
  );
}
