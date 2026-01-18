import { db } from "@/lib/db";
import { getSession } from "@/lib/session";
import { redirect } from "next/navigation";
import GlobalVisitsList from "@/components/VisitsList";
import SearchVisits from "@/components/SearchVisits";
import { CalendarDays, Plus } from "lucide-react";
import Link from "next/link";
import { Prisma } from "@prisma/client";

export const dynamic = "force-dynamic";

export default async function VisitsPage({
  searchParams,
}: {
  searchParams: Promise<{
    petQuery?: string;
    ownerQuery?: string;
    vetId?: string;
    showPast?: string;
    status?: string;
    sort?: string;
  }>;
}) {
  const session = await getSession();
  if (!session || !session.userId) redirect("/login");

  const userId = session.userId as string;

  const user = await db.user.findUnique({
    where: { id: userId },
    select: { role: true },
  });
  const role = user?.role?.trim().toLowerCase() || "guest";

  // --- ZMIANA: Usunięto sztywne przekierowanie dla non-vet ---
  // Definiujemy czy to personel
  const isStaff = role === "vet" || role === "admin";

  const params = await searchParams;
  const petQuery = params.petQuery || "";
  const ownerQuery = params.ownerQuery || "";
  const showPast = params.showPast === "true";
  const statusParam = params.status || "";
  const rawVetParam = params.vetId;
  const sortDirection = params.sort === "desc" ? "desc" : "asc";

  let vetIdFilter: string | undefined = undefined;
  if (rawVetParam === "all") vetIdFilter = undefined;
  else if (rawVetParam) vetIdFilter = rawVetParam;
  else if (role === "vet") vetIdFilter = userId;

  const vets = await db.user.findMany({
    where: { role: "vet" },
    select: { id: true, name: true, lastName: true },
  });

  const whereClause: Prisma.VisitWhereInput = {
    AND: [
      !showPast ? { date: { gte: new Date() } } : {},
      statusParam ? { status: statusParam } : {},
      petQuery ? { pet: { name: { contains: petQuery } } } : {},
      // Szukanie po właścicielu dostępne tylko dla personelu
      (isStaff && ownerQuery)
        ? {
            pet: {
              owner: {
                OR: [
                  { name: { contains: ownerQuery } },
                  { lastName: { contains: ownerQuery } },
                  { email: { contains: ownerQuery } },
                ],
              },
            },
          }
        : {},
      vetIdFilter ? { vetId: vetIdFilter } : {},
      // --- NOWE: Jeśli nie personel, pokaż tylko wizyty usera ---
      !isStaff ? { pet: { ownerId: userId } } : {},
    ],
  };

  const visits = await db.visit.findMany({
    where: whereClause,
    orderBy: { date: sortDirection },
    include: {
      pet: {
        select: {
          id: true,
          name: true,
          owner: {
            select: { name: true, lastName: true, email: true, phone: true },
          },
        },
      },
      vet: {
        select: { name: true, lastName: true },
      },
    },
  });

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8 pb-6 border-b border-gray-200">
        <div className="flex items-center gap-4">
          <div className="bg-blue-100 p-3 rounded-xl text-blue-600">
            <CalendarDays className="w-8 h-8" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              {isStaff ? "Grafik Wizyt (Personel)" : "Moje Wizyty"}
            </h1>
            <div className="flex items-center gap-2 mt-1">
              <span className="text-sm text-gray-500">
                Znaleziono: {visits.length}
              </span>
            </div>
          </div>
        </div>

        <Link
          href="/visits/add"
          className="inline-flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-5 py-3 rounded-xl font-medium transition-colors shadow-sm text-sm"
        >
          <Plus className="w-5 h-5" />
          {isStaff ? "Dodaj wizytę" : "Umów wizytę"}
        </Link>
      </div>

      <SearchVisits
        isStaff={isStaff}
        vets={vets}
        currentUserId={userId}
        userRole={role}
      />

      <div className="mt-6">
        <GlobalVisitsList visits={visits} userRole={role} />
      </div>
    </div>
  );
}