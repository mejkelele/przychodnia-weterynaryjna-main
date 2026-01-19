"use client";

import { useActionState, useEffect } from "react";
import { createPetAction } from "@/lib/actions";
import OwnerSelect from "./OwnerSelect";
import PetForm from "./PetForm";

interface AddPetFormProps {
  isStaff: boolean;
  users: {
    id: string;
    name: string | null;
    lastName: string | null;
    email: string;
  }[];
}

export default function AddPetForm({ isStaff, users }: AddPetFormProps) {
  const [state, action, pending] = useActionState(createPetAction, undefined);

  useEffect(() => {
    if (state?.error) {
      alert(`Błąd: ${state.error}`);
    }
  }, [state]);

  return (
    <PetForm
      action={action}
      isPending={pending}
      submitLabel="Dodaj zwierzaka"
    >
      {isStaff && (
        <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
          <OwnerSelect users={users} />
        </div>
      )}
    </PetForm>
  );
}
