import { db } from "@/lib/db";
import { getSession } from "@/lib/session";
import { redirect } from "next/navigation";
import { cache } from "react";

export const getUserContext = cache(async () => {
  const session = await getSession();

  if (!session || !session.userId) {
    return null;
  }

  const userId = session.userId as string;

  const user = await db.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      role: true,
      name: true,
      email: true,
    },
  });

  if (!user) return null;

  const role = user.role;
  const isStaff = ["admin", "vet"].includes(role);
  const isOwner = role === "owner";

  return {
    user,
    userId: user.id,
    role,
    isStaff,
    isOwner,
  };
});

export const getRequiredUserContext = async () => {
  const context = await getUserContext();
  if (!context) {
    redirect("/login");
  }
  return context;
};
