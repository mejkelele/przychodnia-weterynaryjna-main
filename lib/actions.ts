"use server";

import { db } from "@/lib/db";
import { getSession } from "@/lib/session";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { getVisitPrice } from "@/lib/constants";
// ==========================================
// 🐶 SEKCJA ZWIERZAKI (PETS)
// ==========================================

export async function createPetAction(formData: FormData) {
  const session = await getSession();
  if (!session || !session.userId) return;

  const role = session.role as string;
  const userId = session.userId as string; // Fix typów

  let ownerId = formData.get("ownerId") as string;

  // SCENARIUSZ 1: Zwykły właściciel dodaje swojego zwierzaka
  if (role === "owner") {
    ownerId = userId;
  }

  // SCENARIUSZ 2: Admin/Vet tworzy klienta bez konta
  const isNewOwnerMode = formData.get("isNewOwnerMode") === "true";

  if ((role === "admin" || role === "vet") && isNewOwnerMode) {
    const newUser = await db.user.create({
      data: {
        name: formData.get("ownerName") as string,
        lastName: formData.get("ownerLastName") as string,
        email: formData.get("ownerEmail") as string,
        phone: formData.get("ownerPhone") as string,
        address: formData.get("ownerAddress") as string,
        role: "owner",
        password: "konto_techniczne_brak_hasla", // Wymagane przez bazę
      },
    });
    ownerId = newUser.id;
  }

  if (!ownerId) {
    throw new Error("Błąd: Nie udało się przypisać właściciela.");
  }

  await db.pet.create({
    data: {
      name: formData.get("petName") as string,
      species: formData.get("species") as string,
      breed: formData.get("breed") as string,
      sex: formData.get("sex") as string,
      birthDate: new Date(formData.get("birthDate") as string),
      weight: parseFloat(formData.get("weight") as string),
      imageUrl: (formData.get("imageUrl") as string) || "",
      notes: (formData.get("notes") as string) || "",
      ownerId: ownerId,
    },
  });

  revalidatePath("/pets");
  redirect("/pets");
}

export async function deletePetAction(petId: string) {
  const session = await getSession();
  if (!session || !session.userId) return;

  const userId = session.userId as string;

  // Pobieramy rolę, żeby zabezpieczyć backend
  const user = await db.user.findUnique({
    where: { id: userId },
    select: { role: true },
  });
  const role = user?.role?.trim().toLowerCase();

  // ZABEZPIECZENIE: Weterynarz nie może usuwać
  if (role === "vet") {
    throw new Error("Weterynarz nie może usuwać kartotek.");
  }

  // ZABEZPIECZENIE: Owner może usuwać tylko swoje
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
  
  // Sprawdzamy rolę
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

  // LOGIKA CENOWA:
  // 1. Pobieramy cenę bazową z cennika
  let finalPrice = getVisitPrice(type);
  
  // 2. Jeśli wizytę tworzy Weterynarz i wpisał inną cenę ręcznie, nadpisujemy ją
  const manualPrice = formData.get("price") as string;
  if (isStaff && manualPrice) {
    finalPrice = parseFloat(manualPrice);
  }

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
      price: finalPrice, // <-- Tutaj wchodzi cena automatyczna lub ręczna
      vetId: isStaff ? userId : undefined,
    },
  });

  revalidatePath(`/pets/${petId}`);
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
      vetId: userId, // Przypisujemy lekarza, który kliknął
      price: price, // Ustawiamy cenę
    },
  });

  revalidatePath("/pets");
}

export async function rejectVisitAction(visitId: string) {
  const session = await getSession();
  if (!session || !session.userId) return;

  // Opcjonalnie: można dodać sprawdzenie czy to admin/vet/właściciel wizyty
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

  // Zabezpieczenie: Tylko personel może edytować dane medyczne/ceny
  if (role !== "vet" && role !== "admin") {
    throw new Error("Brak uprawnień do edycji.");
  }

  const visitId = formData.get("visitId") as string;
  const description = formData.get("description") as string;
  const diagnosis = formData.get("diagnosis") as string;
  const price = parseFloat(formData.get("price") as string);
  const status = formData.get("status") as string; // Pozwalamy też zmienić status ręcznie

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
  // Sprawdzamy czy użytkownik jest zalogowany
  if (!session || !session.userId) throw new Error("Brak autoryzacji");

  const name = formData.get("name") as string;
  const lastName = formData.get("lastName") as string;
  const phone = formData.get("phone") as string;
  const address = formData.get("address") as string;

  // Walidacja podstawowa
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

  // Odświeżamy ścieżkę, aby zobaczyć zmiany od razu
  revalidatePath("/dashboard/profile");
}