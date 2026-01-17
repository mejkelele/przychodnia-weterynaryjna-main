import { db } from "@/lib/db";
import AddVisitForm from "@/components/AddVisitForm";
import { getRequiredUserContext } from "@/lib/user-context";

export const dynamic = "force-dynamic";

export default async function AddGlobalVisitPage() {
  const { userId, isStaff } = await getRequiredUserContext();

  const petsData = await db.pet.findMany({
    where: isStaff ? {} : { ownerId: userId },
    select: {
      id: true,
      name: true,
      owner: {
        select: { lastName: true, name: true },
      },
    },
    orderBy: { name: "asc" },
  });

  const formattedPets = petsData.map((pet) => ({
    id: pet.id,
    name: pet.name,
    ownerName:
      isStaff && pet.owner
        ? `${pet.owner.lastName} ${pet.owner.name}`
        : undefined,
  }));

  return (
    <div className="max-w-3xl mx-auto p-6">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">
        Planowanie wizyty
      </h1>

      <AddVisitForm isStaff={!!isStaff} pets={formattedPets} />
    </div>
  );
}
