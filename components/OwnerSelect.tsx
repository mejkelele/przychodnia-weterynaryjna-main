"use client";

import { useState, useMemo } from "react";
import { User, Search, Check, X } from "lucide-react";

interface OwnerSelectProps {
  users: {
    id: string;
    name: string | null;
    lastName: string | null;
    email: string;
  }[];
}

export default function OwnerSelect({ users }: OwnerSelectProps) {
  const [query, setQuery] = useState("");
  const [selectedId, setSelectedId] = useState("");
  const [isOpen, setIsOpen] = useState(false);

  const filteredUsers = useMemo(() => {
    // jesli nie ma ostatnie 5
    if (!query) return users.slice(0, 5);

    return users.filter((user) => {
      const name = user.name || "";
      const lastName = user.lastName || "";
      const email = user.email || "";

      const searchString = `${name} ${lastName} ${email}`.toLowerCase();
      return searchString.includes(query.toLowerCase().trim());
    });
  }, [users, query]);

  const selectedUser = users.find((u) => u.id === selectedId);

  return (
    <div className="relative">
      <label className="block text-sm font-medium text-gray-700 mb-1">
        Właściciel
      </label>

      <input type="hidden" name="ownerId" value={selectedId} />

      {!selectedId ? (
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-4 w-4 text-gray-400" />
          </div>
          <input
            type="text"
            className="w-full pl-10 pr-4 p-2.5 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-gray-900"
            placeholder="Szukaj klienta"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setIsOpen(true);
            }}
            onFocus={() => setIsOpen(true)}
            // opoznienie, zeby klikniecie w liste zaczelo dzialac
            onBlur={() => setTimeout(() => setIsOpen(false), 200)}
          />
        </div>
      ) : (
        <div className="flex items-center justify-between p-2.5 border border-blue-200 bg-blue-50 rounded-lg">
          <div className="flex items-center gap-2 text-blue-800">
            <User className="h-4 w-4" />
            <span className="font-medium">
              {selectedUser?.name || "Bez imienia"}{" "}
              {selectedUser?.lastName || "Bez nazwiska"}
            </span>
            <span className="text-xs text-blue-600">
              ({selectedUser?.email})
            </span>
          </div>
          <button
            type="button"
            onClick={() => {
              setSelectedId("");
              setQuery("");
            }}
            className="text-blue-600 hover:text-blue-800 p-1 hover:bg-blue-100 rounded"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      )}

      {/* lista wynikow */}
      {isOpen && !selectedId && (
        <div className="absolute z-50 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-xl max-h-60 overflow-auto">
          {filteredUsers.length > 0 ? (
            filteredUsers.map((user) => (
              <div
                key={user.id}
                onMouseDown={() => {
                  setSelectedId(user.id);
                  setIsOpen(false);
                }}
                className="p-3 hover:bg-gray-50 cursor-pointer flex items-center justify-between border-b last:border-0 transition-colors"
              >
                <div>
                  <p className="font-medium text-gray-800">
                    {user.name || "-"} {user.lastName || "-"}
                  </p>
                  <p className="text-xs text-gray-500">{user.email}</p>
                </div>
              </div>
            ))
          ) : (
            <div className="p-4 text-sm text-gray-500 text-center">
              Brak wyników dla "{query}".
            </div>
          )}
        </div>
      )}
    </div>
  );
}
