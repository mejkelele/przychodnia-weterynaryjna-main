export type VisitType =
  | "szczepienie"
  | "kontrola"
  | "zabieg"
  | "odrobaczanie"
  | "badania_krwi"
  | "rtg"
  | "usg"
  | "stomatologia"
  | "chipowanie"
  | "online"
  | "emergency";

export type VisitStatus =
  | "w_trakcie"
  | "planowana"
  | "zakonczona"
  | "anulowana";
export type UserRole = "owner" | "vet" | "admin";

export interface User {
  id: string;
  name: string;
  lastName: string;
  email: string;
  phone: string;
  role: UserRole;
  address?: string;
}

export interface Pet {
  id: string;
  ownerId: string;
  name: string;
  species: "pies" | "kot" | "inne";
  sex: "male" | "female" | "unknown";
  breed?: string;
  weight: number;
  birthDate: string;
  notes?: string;
  imageUrl?: string;
}

export interface Visit {
  id: string;
  petId: string;
  vetId: string;
  date: string;
  type: VisitType;
  status: VisitStatus;
  price: number;
  description: string;
  diagnosis?: string;
}
