import { db } from "@/lib/db";
import { Pet, Visit, User, VisitType, VisitStatus } from "@/types";

export async function getAllPets(): Promise<Pet[]> {
  const pets = await db.pet.findMany({
    orderBy: { createdAt: "desc" },
  });

  return pets.map((pet) => ({
    ...pet,
    species: pet.species as "pies" | "kot" | "inne",
    sex: pet.sex as "male" | "female" | "unknown",
    birthDate: pet.birthDate.toISOString(), // Data na string
    breed: pet.breed || undefined,
    notes: pet.notes || undefined,
    imageUrl: pet.imageUrl || undefined,
  }));
}

export async function getPetById(id: string): Promise<Pet | null> {
  const pet = await db.pet.findUnique({ where: { id } });

  if (!pet) return null;

  return {
    ...pet,
    species: pet.species as "pies" | "kot" | "inne",
    sex: pet.sex as "male" | "female",
    birthDate: pet.birthDate.toISOString(),
    breed: pet.breed || undefined,
    notes: pet.notes || undefined,
    imageUrl: pet.imageUrl || undefined,
  };
}

export async function getVisitsByPetId(petId: string): Promise<Visit[]> {
  const visits = await db.visit.findMany({
    where: { petId },
    orderBy: { date: "desc" },
  });

  return visits.map((visit) => ({
    ...visit,
    type: visit.type as VisitType,
    status: visit.status as VisitStatus,
    date: visit.date.toISOString(),
    diagnosis: visit.diagnosis || undefined,
  }));
}


type CreatePetData = Omit<Pet, "id" | "ownerId"> & { ownerId: string }; // typ pomocniczy do tworzenia zwierzaczka

export async function createPet(data: CreatePetData) {
  return await db.pet.create({
    data: {
      name: data.name,
      species: data.species,
      sex: data.sex,
      breed: data.breed,
      weight: parseFloat(data.weight.toString()),
      birthDate: new Date(data.birthDate),
      notes: data.notes,
      imageUrl: data.imageUrl,
      ownerId: data.ownerId,
    },
  });
}

type CreateVisitData = Omit<Visit, "id">;

export async function createVisit(data: CreateVisitData) {
  return await db.visit.create({
    data: {
      petId: data.petId,
      vetId: data.vetId,
      date: new Date(data.date),
      type: data.type,
      status: data.status,
      price: parseFloat(data.price.toString()),
      description: data.description,
      diagnosis: data.diagnosis,
    },
  });
}

type CreateUserData = Omit<User, "id">;

export async function createUser(data: CreateUserData) {
  return await db.user.create({
    data: {
      name: data.name,
      lastName: data.lastName,
      email: data.email,
      phone: data.phone,
      role: data.role,
      address: data.address,
    },
  });
}
