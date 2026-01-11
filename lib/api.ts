import { pets, visits, users } from "@/data/mock";
import { Pet, Visit, User } from "@/types";
const delay = (ms: number) => new Promise((res) => setTimeout(res, ms));

export async function getAllPets(): Promise<Pet[]> {
  await delay(1000);
  return pets;
}

export async function getPetById(id: string): Promise<Pet | undefined> {
  await delay(1000);
  return pets.find((pet) => pet.id === id);
}

export async function getVisitsByPetId(petId: string): Promise<Visit[]> {
  await delay(1000);
  return visits
    .filter((visit) => visit.petId === petId)
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
}

export async function getUserById(id: string): Promise<User | undefined> {
  await delay(100);
  return users.find((user) => user.id === id);
}
