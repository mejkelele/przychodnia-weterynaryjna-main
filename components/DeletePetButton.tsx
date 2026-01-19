"use client";

import { useState } from "react";
import { deletePetAction } from "@/lib/actions";
import { Trash2 } from "lucide-react";

interface DeletePetButtonProps {
  petId: string;
}

export default function DeletePetButton({ petId }: DeletePetButtonProps) {
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    const confirmed = window.confirm(
      "Czy na pewno chcesz usunąć rekord z bazy?"
    );

    if (!confirmed) return;

    setIsDeleting(true);
    await deletePetAction(petId);
  };

  return (
    <button
      onClick={handleDelete}
      disabled={isDeleting}
      className="flex items-center justify-center gap-2 p-2 text-sm font-medium text-red-600 bg-red-50 hover:bg-red-100 rounded-xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
    >
      <Trash2 className="w-4 h-4" />
      {isDeleting ? "Usuwanie..." : "Usuń "}
    </button>
  );
}
