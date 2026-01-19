"use client";

import { updatePetAction } from "@/lib/actions";
import { useActionState } from "react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import PetForm from "./PetForm";

interface EditPetFormProps {
  pet: {
    id: string;
    name: string;
    species: string;
    breed: string | null;
    birthDate: Date;
    weight: number;
    sex: string;
    notes: string | null;
    imageUrl: string | null;
  };
}

export default function EditPetForm({ pet }: EditPetFormProps) {
  const [state, action, pending] = useActionState(updatePetAction, undefined);
  const router = useRouter();

  useEffect(() => {
    if (state?.success) {
      router.push(`/pets/${pet.id}`);
    }
  }, [state, pet.id, router]);

  return (
    <PetForm
      action={action}
      defaultValues={pet}
      isPending={pending}
      submitLabel="Zapisz zmiany"
      cancelHref={`/pets/${pet.id}`}
    />
  );
}
