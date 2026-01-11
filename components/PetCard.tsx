import Link from "next/link";
import { Pet } from "@/types";
// Importujemy profesjonalne ikonki
import { Dog, Cat, Rabbit, ArrowRight, Calendar } from "lucide-react";

interface PetCardProps {
  pet: Pet;
}

export default function PetCard({ pet }: PetCardProps) {
  // Prosta logika obliczania wieku
  const currentYear = new Date().getFullYear();
  // Zakładam, że w mockData zmieniłeś birthYear na birthDate (string), jeśli nie - użyj birthYear
  const birthYear = new Date(pet.birthDate).getFullYear();
  const age = currentYear - birthYear;

  // Funkcja pomocnicza do ustalania kolorów i ikon
  // To spełnia punkt: "instrukcje if/switch" wewnątrz komponentu
  const getTheme = (species: string) => {
    switch (species) {
      case "pies":
        return {
          bg: "bg-blue-50", // Bardzo jasny niebieski tło
          border: "border-blue-100", // Delikatna ramka
          iconColor: "text-blue-600", // Kolor ikonki
          icon: <Dog className="w-6 h-6" />,
          label: "Pies",
        };
      case "kot":
        return {
          bg: "bg-orange-50",
          border: "border-orange-100",
          iconColor: "text-orange-600",
          icon: <Cat className="w-6 h-6" />,
          label: "Kot",
        };
      default:
        return {
          bg: "bg-gray-50",
          border: "border-gray-200",
          iconColor: "text-gray-600",
          icon: <Rabbit className="w-6 h-6" />, // Domyślna ikonka dla innych
          label: species,
        };
    }
  };

  const theme = getTheme(pet.species);

  return (
    <div
      className={`
      relative overflow-hidden rounded-2xl border transition-all duration-300 hover:shadow-lg
      ${theme.bg} ${theme.border}
    `}
    >
      <div className="p-6">
        {/* nagłówek karty */}
        <div className="flex justify-between items-start mb-4">
          <div
            className={`p-3 rounded-xl bg-white shadow-sm ${theme.iconColor}`}
          >
            {theme.icon}
          </div>
          <span className="text-xs font-semibold uppercase tracking-wider text-gray-500 bg-white px-3 py-1 rounded-full shadow-sm">
            {theme.label}
          </span>
        </div>

        {/* Informacje */}
        <h3 className="text-xl font-bold text-gray-900 mb-1">{pet.name}</h3>
        <p className="text-sm text-gray-500 mb-4">{pet.breed}</p>

        {/* Szczegóły */}
        <div className="grid grid-cols-2 gap-4 text-sm text-gray-600 bg-white/50 p-3 rounded-xl mb-4">
          <div className="flex flex-col">
            <span className="text-xs text-gray-400 mb-1">Wiek</span>
            <span className="font-medium">{age} lat</span>
          </div>
          <div className="flex flex-col">
            <span className="text-xs text-gray-400 mb-1">Waga</span>
            <span className="font-medium">{pet.weight} kg</span>
          </div>
        </div>

        {/* Akcje */}
        <Link
          href={`/pets/${pet.id}`}
          className="group flex items-center justify-between w-full py-2.5 px-4 bg-white rounded-xl text-sm font-semibold text-gray-700 shadow-sm hover:text-blue-600 transition-colors"
        >
          <span>Profil i historia</span>
          <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
        </Link>
      </div>
    </div>
  );
}
