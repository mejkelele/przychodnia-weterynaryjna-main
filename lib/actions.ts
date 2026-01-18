"use server";

import { db } from "@/lib/db";
import { getSession } from "@/lib/session";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

// ==========================================
// 🐶 SEKCJA ZWIERZAKI (PETS)
// ==========================================

// ZMIANA: Dodano parametr prevState (wymagany przez useActionState)
// w pliku lib/actions.ts

export async function createPetAction(prevState: any, formData: FormData) {
  const session = await getSession();
  if (!session || !session.userId) {
    return { error: "Brak autoryzacji" };
  }

  const role = session.role as string;
  const userId = session.userId as string;

  let ownerId = formData.get("ownerId") as string;

  // SCENARIUSZ 1: Zwykły właściciel dodaje swojego zwierzaka
  if (role === "owner") {
    ownerId = userId;
  }

  // SCENARIUSZ 2: Admin/Vet tworzy klienta bez konta
  const isNewOwnerMode = formData.get("isNewOwnerMode") === "true";

  try {
    if ((role === "admin" || role === "vet") && isNewOwnerMode) {
      // Sprawdzamy czy email już zajęty
      const existingUser = await db.user.findUnique({
        where: { email: formData.get("ownerEmail") as string },
      });
      if (existingUser) {
        return { error: "Użytkownik o takim emailu już istnieje." };
      }

      const newUser = await db.user.create({
        data: {
          name: formData.get("ownerName") as string,
          lastName: formData.get("ownerLastName") as string,
          email: formData.get("ownerEmail") as string,
          phone: formData.get("ownerPhone") as string,
          address: formData.get("ownerAddress") as string,
          role: "owner",
          password: "konto_techniczne_brak_hasla",
        },
      });
      ownerId = newUser.id;
    }

    if (!ownerId) {
      return { error: "Błąd: Nie udało się przypisać właściciela." };
    }

    // --- TUTAJ BYŁ BŁĄD (petName -> name) ---
    const name = formData.get("name") as string; // Zmieniono z 'petName' na 'name'
    if (!name) return { error: "Imię zwierzaka jest wymagane." };

    await db.pet.create({
      data: {
        name: name, 
        species: (formData.get("species") as string) || "Pies",
        breed: (formData.get("breed") as string) || "",
        sex: (formData.get("sex") as string) || "Samiec",
        birthDate: new Date((formData.get("birthDate") as string) || new Date().toISOString()),
        weight: parseFloat((formData.get("weight") as string) || "0"),
        imageUrl: (formData.get("imageUrl") as string) || "",
        notes: (formData.get("notes") as string) || "",
        ownerId: ownerId,
      },
    });

  } catch (error) {
    console.error("Create Pet Error:", error);
    return { error: "Wystąpił błąd podczas zapisywania w bazie." };
  }

  revalidatePath("/pets");
  redirect("/pets");
}

export async function deletePetAction(petId: string) {
  const session = await getSession();
  if (!session || !session.userId) return;

  const userId = session.userId as string;

  const user = await db.user.findUnique({
    where: { id: userId },
    select: { role: true },
  });
  const role = user?.role?.trim().toLowerCase();

  if (role === "vet") {
    throw new Error("Weterynarz nie może usuwać kartotek.");
  }

  if (role === "owner") {
    const pet = await db.pet.findUnique({
      where: { id: petId },
      select: { ownerId: true },
    });
    if (!pet || pet.ownerId !== userId) {
      throw new Error("Nie masz uprawnień do usunięcia tego zwierzaka.");
    }
  }

  try {
    await db.pet.delete({
      where: { id: petId },
    });
    revalidatePath("/pets");
  } catch (error) {
    console.error("Błąd usuwania:", error);
    throw new Error("Nie udało się usunąć zwierzęcia");
  }
}

// ==========================================
// 🩺 SEKCJA WIZYTY (VISITS)
// ==========================================

export async function createVisitAction(formData: FormData) {
  const session = await getSession();
  if (!session || !session.userId) throw new Error("Brak autoryzacji");

  const userId = session.userId as string;

  const user = await db.user.findUnique({
    where: { id: userId },
    select: { role: true },
  });
  const role = user?.role?.trim().toLowerCase() || "guest";
  const isStaff = role === "admin" || role === "vet";

  const petId = formData.get("petId") as string;
  const description = formData.get("description") as string;
  const dateStr = formData.get("date") as string;
  const type = formData.get("type") as string;

  const priceRaw = formData.get("price") as string;
  const price = isStaff && priceRaw ? parseFloat(priceRaw) : 0;

  if (!petId || !description || !dateStr || !type) {
    throw new Error("Wypełnij wymagane pola");
  }

  await db.visit.create({
    data: {
      petId,
      description,
      type,
      date: new Date(dateStr),
      status: isStaff ? "confirmed" : "pending",
      price: price,
      vetId: isStaff ? userId : undefined,
    },
  });

  revalidatePath(`/pets/${petId}`);
  revalidatePath("/pets");
  revalidatePath("/visits");
}

export async function acceptVisitAction(formData: FormData) {
  const session = await getSession();
  if (!session || !session.userId) throw new Error("Brak autoryzacji");

  const userId = session.userId as string;

  const user = await db.user.findUnique({
    where: { id: userId },
    select: { role: true },
  });
  const role = user?.role?.trim().toLowerCase();

  if (role !== "vet" && role !== "admin") {
    throw new Error("Brak uprawnień do akceptacji wizyt.");
  }

  const visitId = formData.get("visitId") as string;
  const priceRaw = formData.get("price") as string;
  const price = parseFloat(priceRaw);

  if (!visitId || isNaN(price)) {
    throw new Error("Błędne dane (brak ID lub ceny).");
  }

  await db.visit.update({
    where: { id: visitId },
    data: {
      status: "confirmed",
      vetId: userId,
      price: price,
    },
  });

  revalidatePath("/pets");
}

export async function rejectVisitAction(visitId: string) {
  const session = await getSession();
  if (!session || !session.userId) return;

  await db.visit.update({
    where: { id: visitId },
    data: { status: "cancelled" },
  });

  revalidatePath("/pets");
}

export async function editVisitAction(formData: FormData) {
  const session = await getSession();
  if (!session || !session.userId) throw new Error("Brak autoryzacji");

  const user = await db.user.findUnique({
    where: { id: session.userId as string },
    select: { role: true },
  });
  const role = user?.role?.trim().toLowerCase();

  if (role !== "vet" && role !== "admin") {
    throw new Error("Brak uprawnień do edycji.");
  }

  const visitId = formData.get("visitId") as string;
  const description = formData.get("description") as string;
  const diagnosis = formData.get("diagnosis") as string;
  const price = parseFloat(formData.get("price") as string);
  const status = formData.get("status") as string;

  await db.visit.update({
    where: { id: visitId },
    data: {
      description,
      diagnosis,
      price,
      status,
    },
  });

  revalidatePath(`/visits/${visitId}`);
  revalidatePath("/visits");
}

// ==========================================
// 👤 SEKCJA UŻYTKOWNIK (PROFILE)
// ==========================================

export async function updateUserAction(formData: FormData) {
  const session = await getSession();
  if (!session || !session.userId) throw new Error("Brak autoryzacji");

  const name = formData.get("name") as string;
  const lastName = formData.get("lastName") as string;
  const phone = formData.get("phone") as string;
  const address = formData.get("address") as string;

  if (!name || !lastName) {
    throw new Error("Imię i nazwisko są wymagane.");
  }

  await db.user.update({
    where: { id: session.userId as string },
    data: {
      name,
      lastName,
      phone,
      address,
    },
  });

  revalidatePath("/dashboard/profile");
}