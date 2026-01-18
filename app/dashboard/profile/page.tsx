import { db } from "@/lib/db";
import { getSession } from "@/lib/session";
import { updateUserAction } from "@/lib/actions";
import { redirect } from "next/navigation";

export default async function ProfilePage() {
  const session = await getSession();
  if (!session?.userId) redirect("/login");

  const user = await db.user.findUnique({
    where: { id: session.userId as string },
  });

  // --- POPRAWKA TUTAJ ---
  // Jeśli sesja istnieje, ale użytkownika nie ma w bazie (np. stara sesja),
  // przekieruj natychmiast do logowania, zamiast pokazywać błąd.
  if (!user) {
    redirect("/login");
  }
  // ----------------------

  return (
    <div className="max-w-2xl mx-auto p-6">
      <div className="bg-white rounded-xl shadow-sm border p-6">
        <h1 className="text-2xl font-bold mb-6 text-gray-800">Edycja Profilu</h1>
        
        <form action={updateUserAction} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Imię
              </label>
              <input
                name="name"
                defaultValue={user.name}
                className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500 outline-none"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Nazwisko
              </label>
              <input
                name="lastName"
                defaultValue={user.lastName}
                className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500 outline-none"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email (nie można zmienić)
            </label>
            <input
              type="email"
              value={user.email}
              disabled
              className="w-full p-2 border rounded-md bg-gray-100 text-gray-500 cursor-not-allowed"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Telefon
            </label>
            <input
              name="phone"
              defaultValue={user.phone || ""}
              placeholder="np. 500 123 456"
              className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Adres
            </label>
            <textarea
              name="address"
              defaultValue={user.address || ""}
              placeholder="Twój adres zamieszkania"
              className="w-full p-2 border rounded-md h-24 focus:ring-2 focus:ring-blue-500 outline-none resize-none"
            />
          </div>

          <div className="pt-4 border-t">
            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-2.5 rounded-md hover:bg-blue-700 transition font-medium"
            >
              Zapisz zmiany
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}