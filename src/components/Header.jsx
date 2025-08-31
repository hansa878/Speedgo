// src/components/Header.jsx
// src/components/Header.jsx
export default function Header({ setOpen }) {
  return (
    <header className="sticky top-0 z-40 bg-white border-b h-16 flex items-center px-4">
      {/* Hamburger menu for mobile */}
      <button
        onClick={() => setOpen(true)}
        className="lg:hidden p-2 rounded-lg hover:bg-gray-100"
        aria-label="Open sidebar"
      >
        {/* Hamburger icon */}
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
          className="w-6 h-6"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
          />
        </svg>
      </button>

      {/* Title */}
      <h1 className="ml-3 font-semibold text-lg text-gray-700">
        SpeedGo Admin Panel
      </h1>
    </header>
  );
}
