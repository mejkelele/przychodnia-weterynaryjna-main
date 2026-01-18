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

  // ZMIANA: Usunąłem całkowicie sekcję "where".
  // Teraz pobierze KAŻDEGO użytkownika z bazy.
  const usersList = isStaff
    ? await db.user.findMany({
        // where: { role: "owner" }, <--- USUNIĘTE, żeby nie blokowało wyników
        select: {
          id: true,
          name: true,
          lastName: true,
          email: true,
          // Dodaję role do select, żebyś mógł podejrzeć w konsoli serwera co tam siedzi
          role: true,
        },
        orderBy: { lastName: "asc" },
      })
    : [];

  // DIAGNOSTYKA SERWEROWA:
  // Spójrz w terminal (tam gdzie odpaliłeś 'npm run dev'),
  // zobaczysz jakie role mają twoi użytkownicy.
  if (isStaff) {
    console.log("Znalezieni użytkownicy w bazie:", usersList);
  }

  return (
    <div className="max-w-2xl mx-auto p-6">
      <AddPetForm isStaff={isStaff} users={usersList} />
    </div>
  );
}
