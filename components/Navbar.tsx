import Link from "next/link";

export default function Navbar() {
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
          </div>
        </div>
      </div>
    </nav>
  );
}
