// lib/actions.ts
"use server";

import { createPet, createUser } from "@/lib/api"; // Upewnij się, że te funkcje są w lib/api.ts
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { getSession } from "@/lib/session"; // Importujemy sesję

export async function createPetAction(formData: FormData) {
  const session = await getSession();
  
  // Sprawdzamy czy użytkownik jest zalogowany
  if (!session || !session.userId) {
    redirect("/login");
  }

  let ownerId = session.userId as string;

  // Tutaj logika może być rozbudowana:
  // Jeśli to Weterynarz, może przesłać 'ownerId' w formularzu lub stworzyć nowego usera.
  // Na razie uprośćmy: jeśli wypełniono dane właściciela, tworzymy nowego (jak było), 
  // ALE jeśli pola są puste, zakładamy, że to zalogowany user dodaje swojego zwierzaka.

  const ownerEmail = formData.get("ownerEmail") as string;

  // Jeśli podano email właściciela, a zalogowany to np. weterynarz (lub logika tworzenia nowego usera)
  if (ownerEmail && ownerEmail.trim() !== "") {
     const newOwner = await createUser({
      name: formData.get("ownerName") as string,
      lastName: formData.get("ownerLastName") as string,
      email: ownerEmail,
      phone: formData.get("ownerPhone") as string,
      password: "temp-password-123", // Hasło tymczasowe lub wymagane pole
      role: "owner",
      address: formData.get("ownerAddress") as string,
    });
    ownerId = newOwner.id;
  }

  // Tworzenie zwierzaka
  await createPet({
    ownerId: ownerId,
    name: formData.get("petName") as string,
    species: formData.get("species") as "pies" | "kot" | "inne",
    sex: formData.get("sex") as "male" | "female",
    breed: formData.get("breed") as string,
    weight: parseFloat(formData.get("weight") as string),
    birthDate: formData.get("birthDate") as string,
    notes: formData.get("notes") as string,
    imageUrl: formData.get("imageUrl") as string,
  });

  revalidatePath("/pets");
  revalidatePath("/dashboard");
  redirect("/dashboard"); // Przekierowanie do panelu
}

export async function deletePetAction(petId: string) {
  // Opcjonalnie: sprawdź czy user ma prawo usunąć (np. jest właścicielem)
  await db.pet.delete({
    where: {
      id: petId,
    },
  });
  revalidatePath("/pets");
  revalidatePath("/dashboard");
  redirect("/pets");
}