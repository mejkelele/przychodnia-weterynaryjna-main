"use client";

import { acceptVisitAction, rejectVisitAction } from "@/lib/actions";
import { useTransition, useState } from "react";
import { Check, X, CheckCircle } from "lucide-react";

interface VisitStatusActionsProps {
  visitId: string;
}

export default function VisitStatusActions({
  visitId,
}: VisitStatusActionsProps) {
  const [isPending, startTransition] = useTransition();
  const [isAccepting, setIsAccepting] = useState(false);

  if (isAccepting) {
    return (
      <form
        action={async (formData) => {
          await acceptVisitAction(formData);
          setIsAccepting(false);
        }}
        className="flex items-end gap-2 bg-yellow-50 p-4 rounded-xl border border-yellow-200"
      >
        <input type="hidden" name="visitId" value={visitId} />
        <div className="flex-1">
          <label className="block text-xs font-bold text-gray-700 mb-1">
            Potwierdź wizytę i ustal cenę (PLN)
          </label>
          <input
            type="number"
            name="price"
            step="0.01"
            min="0"
            placeholder="0.00"
            autoFocus
            required
            className="w-full text-sm border-gray-300 rounded-lg focus:ring-green-500 focus:border-green-500"
          />
        </div>
        <button
          type="submit"
          disabled={isPending}
          className="bg-green-600 hover:bg-green-700 text-white p-2.5 rounded-lg transition"
        >
          <Check className="w-5 h-5" />
        </button>
        <button
          type="button"
          onClick={() => setIsAccepting(false)}
          className="bg-white border border-gray-300 text-gray-600 hover:bg-gray-50 p-2.5 rounded-lg transition"
        >
          <X className="w-5 h-5" />
        </button>
      </form>
    );
  }

  return (
    <div className="flex gap-3">
      <button
        onClick={() => setIsAccepting(true)}
        className="flex-1 bg-green-600 hover:bg-green-700 text-white px-4 py-3 rounded-xl font-medium shadow-sm flex items-center justify-center gap-2 transition"
      >
        <CheckCircle className="w-5 h-5" />
        Przyjmij wizytę
      </button>

      <button
        onClick={() =>
          startTransition(async () => await rejectVisitAction(visitId))
        }
        disabled={isPending}
        className="px-6 py-3 bg-white border border-gray-300 text-red-600 hover:bg-red-50 hover:border-red-200 font-medium rounded-xl transition"
      >
        Odrzuć
      </button>
    </div>
  );
}
