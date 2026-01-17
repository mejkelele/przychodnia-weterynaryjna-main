import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const users = [
  {
    id: "vt1",
    name: "Karol",
    lastName: "Falkowski",
    email: "karol@mljar.pl",
    phone: "123456789",
    role: "vet",
    address: "ul. Krańcowa 76, Łapy",
  },
  {
    id: "vt2",
    name: "Bartosz",
    lastName: "Dołkin",
    email: "bartosz@gwint.pl",
    phone: "987654321",
    role: "vet",
  },
  {
    id: "vt3",
    name: "Charlie",
    lastName: "Kirk",
    email: "charlie@wp.pl",
    phone: "112233445",
    role: "vet",
  },
  {
    id: "ow1",
    name: "Tymoteusz",
    lastName: "Dziejma",
    email: "tymitymi@gmail.com",
    phone: "500100200",
    role: "owner",
    address: "ul. Brodowicza 1, Choroszcz",
  },
  {
    id: "ow2",
    name: "Andrzej",
    lastName: "Duda",
    email: "andrzejekzb@wp.com",
    phone: "600300400",
    role: "owner",
    address: "ul. Tymkowa 2, Białystok",
  },
  {
    id: "ow3",
    name: "Michał",
    lastName: "Wiśniewski",
    email: "michcio@gmail.com",
    phone: "700500600",
    role: "owner",
    address: "ul. Kwiatowa 10, Olmonty",
  },
  {
    id: "ow4",
    name: "Jerzy",
    lastName: "Urban",
    email: "komuch@gmail.com",
    phone: "800700800",
    role: "owner",
    address: "ul. Polna 15, Warszawa",
  },
  {
    id: "ow5",
    name: "Katarzyna",
    lastName: "Kleks",
    email: "kleksik@gmail.com",
    phone: "900900900",
    role: "owner",
    address: "ul. Ogrodowa 20, Warszawa",
  },
];

const pets = [
  {
    id: "pet1",
    ownerId: "ow1",
    name: "Furasek",
    sex: "male",
    species: "kot",
    breed: "Maine Coon",
    weight: 7.5,
    birthDate: "2020-03-15",
    notes: "Koteczek",
    imageUrl:
      "https://lh3.googleusercontent.com/gg/AIJ2gl8Sl0wNcDBxCWQwn8Sf-jNTAcxa9-XxsBW1Iyto3CMUzyM_vZpkRcUt138WdKzVxWtQ7U9Ul3Um4Yuugynt_l-uS3gfMfD-2a8DlDnjfOZ4aFunAbQJNRlr2WT9hNg5OjhvgydMBKfpZPL7Uvp6_2t8aeH7Wg4T1GhpexpoBDaz9H-Lszo=s1024-rj-mp2",
  },
  {
    id: "pet2",
    ownerId: "ow4",
    name: "Azor",
    sex: "male",
    species: "pies",
    breed: "Gończy Poski",
    weight: 30,
    birthDate: "2018-07-01",
    notes: "Z adopcji",
  },
];

const visits = [
  {
    id: "vis1",
    petId: "pet1",
    vetId: "vt1",
    date: "2026-01-15T10:00:00Z",
    type: "szczepienie",
    status: "planowana",
    price: 80,
    description: "Szczepienie przeciwko wściekliźnie.",
    diagnosis: "Zwierzę zdrowe, szczepienie przebiegło pomyślnie.",
  },
  {
    id: "vis2",
    petId: "pet2",
    vetId: "vt2",
    date: "2026-01-18T14:30:00Z",
    type: "kontrola",
    status: "planowana",
    price: 50,
    description: "Rutynowa kontrola stanu zdrowia.",
    diagnosis: "Wszystkie parametry w normie, zwierzę w dobrej kondycji.",
  },
  {
    id: "vis3",
    petId: "pet1",
    vetId: "vt3",
    date: "2025-12-01T09:00:00Z",
    type: "odrobaczanie",
    status: "zakonczona",
    price: 40,
    description: "Podanie preparatu na odrobaczenie.",
    diagnosis: "Zwierzę dobrze zniosło podanie preparatu.",
  },
  {
    id: "vis4",
    petId: "pet2",
    vetId: "vt2",
    date: "2026-01-20T11:00:00Z",
    type: "zabieg",
    status: "planowana",
    price: 200,
    description: "Drobny zabieg chirurgiczny.",
    diagnosis: undefined,
  },
  {
    id: "vis5",
    petId: "pet2",
    vetId: "vt3",
    date: "2025-12-05T16:00:00Z",
    type: "badania_krwi",
    status: "zakonczona",
    price: 120,
    description: "Pobranie krwi do badań laboratoryjnych.",
    diagnosis: undefined,
  },
];

// --- LOGIKA SEEDOWANIA ---

async function main() {
  console.log("Seeding db");

  await prisma.visit.deleteMany();

  await prisma.pet.deleteMany();

  await prisma.user.deleteMany();

  console.log("Old data removed");

  for (const user of users) {
    await prisma.user.create({
      data: {
        ...user,
        password: "zaq1@WSX",
      },
    });
  }
  console.log(`Added ${users.length} users`);

  for (const pet of pets) {
    await prisma.pet.create({
      data: {
        ...pet,
        birthDate: new Date(pet.birthDate), //konwersja na date
      },
    });
  }
  console.log(`Added ${pets.length} pets`);

  for (const visit of visits) {
    await prisma.visit.create({
      data: {
        ...visit,
        date: new Date(visit.date), // konwersja na date
      },
    });
  }
  console.log(`Added ${visits.length} visits.`);

  console.log("Seeding success bracie");
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
