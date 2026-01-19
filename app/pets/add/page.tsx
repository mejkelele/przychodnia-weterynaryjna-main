import { getSession } from "@/lib/session";
import { db } from "@/lib/db";
import { redirect } from "next/navigation";
import AddPetForm from "@/components/AddPetForm";

export default async function AddPetPage() {
  const session = await getSession();

  const role = (session?.role as string)?.trim().toLowerCase();
  const isStaff = role === "vet" || role === "admin";

  if (!session?.userId) {
    redirect("/login");
  }

  // pobieranie użytkowników z bazy
  const usersList = isStaff
    ? await db.user.findMany({
        select: {
          id: true,
          name: true,
          lastName: true,
          email: true,
          role: true,
        },
        orderBy: { lastName: "asc" },
      })
    : [];

// diagnostyka serwerowa
  if (isStaff) {
    console.log("Znalezieni użytkownicy w bazie:", usersList);
  }

  return (
    <div className="max-w-2xl mx-auto p-6">
      <AddPetForm isStaff={isStaff} users={usersList} />
    </div>
  );
}
