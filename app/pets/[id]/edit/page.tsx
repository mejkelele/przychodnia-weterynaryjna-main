import { notFound, redirect } from "next/navigation";
import { db } from "@/lib/db";
import { getRequiredUserContext } from "@/lib/user-context";
import EditPetForm from "@/components/EditPetForm";
import { Pencil } from "lucide-react";

interface EditPetPageProps {
  params: Promise<{ id: string }>;
}

export default async function EditPetPage({ params }: EditPetPageProps) {
  const { userId, isStaff } = await getRequiredUserContext();
  const resolvedParams = await params;

  const pet = await db.pet.findUnique({
    where: { id: resolvedParams.id },
  });

  if (!pet) return notFound();

  const isOwner = pet.ownerId === userId;
  if (!isOwner && !isStaff) {
    redirect("/pets");
  }

  return (
    <div className="max-w-2xl mx-auto p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
          <div className="bg-blue-100 p-2 rounded-lg">
            <Pencil className="w-6 h-6 text-blue-600" />
          </div>
          Edycja: {pet.name}
        </h1>
      </div>

      <EditPetForm pet={pet} />
    </div>
  );
}
