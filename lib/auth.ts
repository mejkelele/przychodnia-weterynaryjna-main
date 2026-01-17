// lib/auth.ts
"use server";

import { db } from "@/lib/db";
import { createSession, deleteSession } from "@/lib/session";
import bcrypt from "bcryptjs";
import { redirect } from "next/navigation";

export async function registerAction(prevState: any, formData: FormData) {
  const name = formData.get("name") as string;
  const lastName = formData.get("lastName") as string;
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  const phone = formData.get("phone") as string;

  if (!email || !password || !name) {
    return { error: "Wypełnij wymagane pola" };
  }

  // Sprawdź czy użytkownik istnieje
  const existingUser = await db.user.findUnique({ where: { email } });
  if (existingUser) {
    return { error: "Użytkownik o tym emailu już istnieje" };
  }

  // Zahaszuj hasło
  const hashedPassword = await bcrypt.hash(password, 10);

  // Utwórz użytkownika
  const user = await db.user.create({
    data: {
      name,
      lastName,
      email,
      password: hashedPassword,
      phone,
      role: "owner", // Domyślna rola
    },
  });

  await createSession(user.id, user.role);
  redirect("/dashboard");
}

export async function loginAction(prevState: any, formData: FormData) {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  const user = await db.user.findUnique({ where: { email } });

  if (!user) {
    return { error: "Nieprawidłowy email lub hasło" };
  }

  const isPasswordValid = await bcrypt.compare(password, user.password);

  if (!isPasswordValid) {
    return { error: "Nieprawidłowy email lub hasło" };
  }

  await createSession(user.id, user.role);
  redirect("/dashboard");
}

export async function logoutAction() {
  await deleteSession();
  redirect("/login");
}


export async function registerVetAction(prevState: any, formData: FormData) {
  const name = formData.get("name") as string;
  const lastName = formData.get("lastName") as string;
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  const phone = formData.get("phone") as string;

  // Prosta walidacja
  if (!email || !password || !name) {
    return { error: "Wypełnij wymagane pola" };
  }

  // Sprawdź czy użytkownik istnieje
  const existingUser = await db.user.findUnique({ where: { email } });
  if (existingUser) {
    return { error: "Użytkownik o tym emailu już istnieje" };
  }

  // Hashowanie hasła
  const hashedPassword = await bcrypt.hash(password, 10);

  // Tworzenie użytkownika z rolą VET
  const user = await db.user.create({
    data: {
      name,
      lastName,
      email,
      password: hashedPassword,
      phone,
      role: "vet", // <--- TUTAJ JEST KLUCZOWA RÓŻNICA
    },
  });

  await createSession(user.id, user.role);
  redirect("/dashboard");
}