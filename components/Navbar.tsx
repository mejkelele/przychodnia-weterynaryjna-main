// components/Navbar.tsx
import Link from "next/link";
import { getSession } from "@/lib/session";
import { logoutAction } from "@/lib/auth";

export default async function Navbar() {
  const session = await getSession();

  return (
    <nav className="bg-white border-b border-gray-200 sticky top-0 z-50 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <div className="flex-shrink-0">
            <Link
              href="/"
              className="text-xl font-bold text-gray-900 hover:text-blue-600 transition"
            >
              Weteryniarz
            </Link>
          </div>

          <div className="flex items-center gap-4">
            {session ? (
              <>
                <div className="hidden md:flex space-x-6 text-sm font-medium">
                  <Link
                    href="/dashboard"
                    className="text-gray-600 hover:text-blue-600 transition"
                  >
                    Panel
                  </Link>
                  <Link
                    href="/pets"
                    className="text-gray-600 hover:text-blue-600 transition"
                  >
                    Pacjenci
                  </Link>
                </div>
                <form action={logoutAction}>
                  <button className="text-sm font-medium text-red-600 hover:text-red-800 transition">
                    Wyloguj
                  </button>
                </form>
              </>
            ) : (
              <div className="flex space-x-4">
                <Link
                  href="/login"
                  className="text-sm font-medium text-gray-600 hover:text-blue-600 transition"
                >
                  Logowanie
                </Link>
                <Link
                  href="/register"
                  className="text-sm font-medium bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition"
                >
                  Rejestracja
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}