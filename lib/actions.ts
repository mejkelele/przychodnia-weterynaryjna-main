"use server";

import { db } from "@/lib/db";
import { getSession } from "@/lib/session";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

// ==========================================
// 🐶 SEKCJA ZWIERZAKI (PETS)
// ==========================================

// W pliku lib/actions.ts

export async function createPetAction(prevState: any, formData: FormData) {
  const session = await getSession();
  if (!session?.userId) return { error: "Brak autoryzacji" };

  const isStaff = session.role === "vet" || session.role === "admin";

  const name = formData.get("name") as string;
  const species = formData.get("species") as string;
  const breed = formData.get("breed") as string;
  const birthDateStr = formData.get("birthDate") as string;
  const sex = formData.get("sex") as string;
  const weightStr = formData.get("weight") as string;
  const formOwnerId = formData.get("ownerId") as string;
  const imageUrl = formData.get("imageUrl") as string;
  const notes = formData.get("notes") as string;
  if (!name || !species || !birthDateStr || !weightStr) {
    return { error: "Wypełnij wymagane pola." };
  }

  let finalOwnerId: string = session.userId as string;

  if (isStaff && formOwnerId) {
    finalOwnerId = formOwnerId;
  }

  try {
    await db.pet.create({
      data: {
        name,
        species,
        breed: breed || null,
        birthDate: new Date(birthDateStr),
        sex,
        weight: parseFloat(weightStr),
        ownerId: finalOwnerId,
        imageUrl: imageUrl || null,
        notes: notes || null,
      },
    });

    revalidatePath("/pets");
    revalidatePath("/dashboard");
    redirect("/pets");
  } catch (error) {
    console.error("Błąd tworzenia zwierzaka:", error);
    if ((error as Error).message === "NEXT_REDIRECT") {
      throw error;
    }
    return { error: "Wystąpił błąd podczas dodawania zwierzaka." };
  }
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
  const visitDate = new Date(dateStr);
  const now = new Date();
  if (visitDate < new Date(now.getTime() - 60000)) {
    throw new Error("Nie można umówić wizyty z datą wsteczną.");
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

export async function updatePetAction(prevState: any, formData: FormData) {
  const session = await getSession();
  if (!session || !session.userId) {
    return { error: "Musisz być zalogowany." };
  }

  const petId = formData.get("id") as string;
  const name = formData.get("name") as string;
  const species = formData.get("species") as string;
  const breed = formData.get("breed") as string;
  const birthDate = formData.get("birthDate") as string;
  const weight = formData.get("weight") as string;
  const sex = formData.get("sex") as string;
  const notes = formData.get("notes") as string;
  const imageUrl = formData.get("imageUrl") as string;

  try {
    // 1. Sprawdzenie uprawnień (czy to właściciel lub personel)
    const pet = await db.pet.findUnique({ where: { id: petId } });

    if (!pet) return { error: "Zwierzak nie istnieje." };

    const isOwner = pet.ownerId === session.userId;
    const isStaff = session.role === "vet" || session.role === "admin";

    if (!isOwner && !isStaff) {
      return { error: "Brak uprawnień do edycji tego zwierzaka." };
    }

    // 2. Aktualizacja
    await db.pet.update({
      where: { id: petId },
      data: {
        name,
        species,
        breed,
        birthDate: new Date(birthDate),
        weight: parseFloat(weight),
        sex,
        notes,
        imageUrl,
      },
    });

    revalidatePath(`/pets/${petId}`);
    revalidatePath("/pets");

    // Zwracamy sukces, aby komponent mógł zrobić przekierowanie
    return { success: true, petId };
  } catch (error) {
    console.error(error);
    return { error: "Błąd podczas aktualizacji danych." };
  }
}
