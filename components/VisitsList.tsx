"use client";

import {
  Calendar,
  CheckCircle,
  Clock,
  PawPrint,
  User,
  ChevronRight,
  Stethoscope,
  Banknote,
  XCircle,
} from "lucide-react";
import Link from "next/link";

interface Visit {
  id: string;
  date: Date;
  type: string;
  status: string;
  price: number;
  vet?: { name: string; lastName: string } | null;
  pet: {
    id: string;
    name: string;
    owner?: { name: string; lastName: string } | null;
  };
}

interface GlobalVisitsListProps {
  visits: Visit[];
  userRole: string;
}

export default function GlobalVisitsList({
  visits,
  userRole,
}: GlobalVisitsListProps) {
  const isStaff = userRole === "admin" || userRole === "vet";

  const getStatusConfig = (status: string) => {
    switch (status) {
      case "confirmed":
        return {
          label: "Potwierdzona",
          className: "bg-green-100 text-green-600",
          icon: <CheckCircle className="w-5 h-5" />,
        };
      case "cancelled":
        return {
          label: "Anulowana",
          className: "bg-red-100 text-red-600",
          icon: <XCircle className="w-5 h-5" />,
        };
      case "completed":
        return {
          label: "Zakończona",
          className: "bg-blue-100 text-blue-600",
          icon: <CheckCircle className="w-5 h-5" />,
        };
      default:
        return {
          label: "Oczekująca",
          className: "bg-yellow-100 text-yellow-600",
          icon: <Clock className="w-5 h-5" />,
        };
    }
  };

  if (visits.length === 0) {
    return (
      <div className="text-center py-16 bg-gray-50 rounded-2xl border-2 border-dashed border-gray-200">
        <Calendar className="w-12 h-12 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900">Pusty grafik</h3>
        <p className="text-gray-500">Brak zaplanowanych wizyt.</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
      <div className="hidden md:grid grid-cols-12 gap-4 p-4 bg-gray-50 border-b border-gray-200 text-xs font-semibold text-gray-500 uppercase tracking-wider">
        <div className="col-span-3">Data i Status</div>
        <div className="col-span-3">Pacjent</div>
        <div className="col-span-3">Lekarz / Cena</div>
        <div className="col-span-3 text-right">Akcja</div>
      </div>

      <div className="divide-y divide-gray-100">
        {visits.map((visit) => {
          const statusConfig = getStatusConfig(visit.status);

          return (
            <div
              key={visit.id}
              className="group hover:bg-blue-50/50 transition-colors"
            >
              <Link href={`/visits/${visit.id}`} className="block">
                <div className="grid grid-cols-1 md:grid-cols-12 gap-4 p-4 items-center">
                  <div className="col-span-3 flex items-center gap-3">
                    <div
                      className={`p-2 rounded-lg shrink-0 ${statusConfig.className}`}
                    >
                      {statusConfig.icon}
                    </div>
                    <div>
                      <p className="font-bold text-gray-900 text-sm capitalize">
                        {visit.type}
                      </p>
                      <p
                        className="text-xs text-gray-500"
                        suppressHydrationWarning={true}
                      >
                        {new Date(visit.date).toLocaleDateString("pl-PL", {
                          day: "numeric",
                          month: "short",
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </p>

                      <span
                        className={`md:hidden inline-block mt-1 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase ${statusConfig.className}`}
                      >
                        {statusConfig.label}
                      </span>
                    </div>
                  </div>

                  <div className="col-span-3">
                    <div className="flex items-center gap-2 text-sm font-medium text-gray-900">
                      <PawPrint className="w-4 h-4 text-blue-500" />
                      {visit.pet.name}
                    </div>

                    {isStaff && visit.pet.owner && (
                      <div className="flex items-center gap-1 text-xs text-gray-500 mt-1">
                        <User className="w-3 h-3" />
                        {visit.pet.owner.name} {visit.pet.owner.lastName}
                      </div>
                    )}
                  </div>

                  <div className="col-span-3">
                    {visit.vet ? (
                      <div className="flex items-center gap-1 text-sm text-gray-700">
                        <Stethoscope className="w-3 h-3 text-purple-500" />
                        {visit.vet.lastName}
                      </div>
                    ) : (
                      <span className="text-xs text-gray-400 italic">
                        Nie przypisano
                      </span>
                    )}

                    <div className="flex items-center gap-1 text-xs text-gray-500 mt-1 font-medium">
                      <Banknote className="w-3 h-3" />
                      {visit.price > 0 ? `${visit.price} PLN` : "Do ustalenia"}
                    </div>
                  </div>

                  <div className="col-span-3 flex justify-end items-center gap-2">
                    <span className="hidden md:inline text-xs font-medium text-blue-600 group-hover:translate-x-1 transition-transform">
                      Szczegóły
                    </span>
                    <ChevronRight className="w-5 h-5 text-gray-300 group-hover:text-blue-500 transition-colors" />
                  </div>
                </div>
              </Link>
            </div>
          );
        })}
      </div>
    </div>
  );
}
