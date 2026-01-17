// lib/constants.ts

export const VISIT_TYPES = {
  konsultacja: { label: "Konsultacja ogólna", price: 120 },
  szczepienie: { label: "Szczepienie podstawowe", price: 80 },
  odrobaczenie: { label: "Odrobaczenie", price: 50 },
  zabieg: { label: "Zabieg chirurgiczny", price: 400 },
  kontrola: { label: "Wizyta kontrolna", price: 0 },
  online: { label: "Teleporada", price: 100 },
} as const;

export type VisitTypeKey = keyof typeof VISIT_TYPES;

export function getVisitPrice(type: string): number {
  return VISIT_TYPES[type as VisitTypeKey]?.price || 0;
}

export function getVisitLabel(type: string): string {
  return VISIT_TYPES[type as VisitTypeKey]?.label || type;
}