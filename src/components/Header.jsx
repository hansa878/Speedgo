// src/components/Header.jsx
export default function Header({ title, onMenu }) {
  return (
    <header className="sticky top-0 z-40 bg-white/70 backdrop-blur border-b">
      <div className="h-16 px-4 flex items-center gap-3">
        <button
          className="lg:hidden p-2 rounded-lg hover:bg-gray-100"
          onClick={onMenu}
          aria-label="Open menu"
        >
          ☰
        </button>
        <h1 className="text-lg font-semibold">{title}</h1>
        <div className="ml-auto flex items-center gap-2">
          <input
            placeholder="Search…"
            className="hidden md:block rounded-xl border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-red-400"
          />
          <div className="h-9 w-9 rounded-full bg-gray-200" />
        </div>
      </div>
    </header>
  );
}

