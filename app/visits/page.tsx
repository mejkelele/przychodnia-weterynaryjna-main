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
  const isStaff = role === "admin" || role === "vet";

  const params = await searchParams;
  const petQuery = params.petQuery || "";
  const ownerQuery = params.ownerQuery || "";
  const showPast = params.showPast === "true";
  const statusParam = params.status || ""; // Odczytujemy status
  const rawVetParam = params.vetId;
  const sortDirection = params.sort === "desc" ? "desc" : "asc"; // Tylko kierunek

  let vetIdFilter: string | undefined = undefined;
  if (rawVetParam === "all") vetIdFilter = undefined;
  else if (rawVetParam) vetIdFilter = rawVetParam;
  else if (isStaff && role === "vet") vetIdFilter = userId;

  // 4. Lista lekarzy
  const vets = isStaff
    ? await db.user.findMany({
        where: { role: "vet" },
        select: { id: true, name: true, lastName: true },
      })
    : [];

  // 5. WHERE
  const whereClause: Prisma.VisitWhereInput = {
    AND: [
      !isStaff ? { pet: { ownerId: userId } } : {},
      !showPast ? { date: { gte: new Date() } } : {},

      // Filtr po Statusie (NOWE)
      statusParam ? { status: statusParam } : {},

      petQuery ? { pet: { name: { contains: petQuery } } } : {},
      isStaff && ownerQuery
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
    ],
  };

  // 6. Pobranie danych (Sortowanie tylko po dacie)
  const visits = await db.visit.findMany({
    where: whereClause,
    orderBy: { date: sortDirection }, // 'asc' lub 'desc'
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
              Terminarz Wizyt
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
          Dodaj wizytę
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
