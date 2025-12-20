function Header() {
  return (
    <header className="w-full bg-[#0C2B4E] shadow px-4 py-3 flex items-center gap-3">
      <div className="flex items-center gap-2">
        <button
          type="button"
          className="cursor-pointer hover:bg-[#163d6b] rounded p-2 transition md:hidden"
        >
          <span className="text-white text-2xl">☰</span>
        </button>

        <h1 className="text-white text-xl md:text-2xl font-semibold tracking-tight md:ml-4" >
          GrowthNest
        </h1>
      </div>
      <form
        role="search"
        className="
          hidden
          sm:flex
          items-center gap-2
          mx-4
          flex-1
          max-w-xl
        "
        onSubmit={(e) => e.preventDefault()}
      >
        <input
          type="search"
          name="q"
          placeholder="Search for anything"
          aria-label="Search through site content"
          className="
            w-full
            px-3 py-2
            rounded-md
            text-sm
            outline-none
            bg-[#1A3D64]
            text-white
            focus:ring-2
            focus:ring-[#4a90e2]
            placeholder:text-gray-200
          "
        />
        <button
          type="submit"
          className="
            px-3 py-2
            rounded-md
            bg-[#163d6b]
            text-white
            text-sm
            hover:bg-[#1f4f88]
            transition
            cursor-pointer
          "
        >
          ⌕
        </button>
      </form>
      <button className="sm:hidden ml-auto p-2 rounded-full hover:bg-[#163d6b]">
        <span className="text-white text-lg">⌕</span>
      </button>
      <div className="hidden sm:flex items-center gap-3 ml-auto">
        <button className="
          px-3 md:px-4
          py-1.5
          rounded-md
          bg-[#1D546C]
          text-[#0C2B4E]
          text-xs md:text-sm
          font-semibold
          shadow-sm
          hover:bg-[#f8c549]
          transition
          whitespace-nowrap
        ">
          Schedule Session
        </button>

        <button className="relative p-2 rounded-full hover:bg-[#163d6b]">
    <svg
    xmlns="http://www.w3.org/2000/svg"
    className="h-5 w-5 text-white"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.8"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M15 17h5l-1.4-1.4A2 2 0 0 1 18 14.2V11a6 6 0 1 0-12 0v3.2c0 .5-.2 1-.6 1.4L4 17h5" />
    <path d="M10 19a2 2 0 0 0 4 0" />
  </svg>
</button>
        <div className="flex items-center gap-2 pl-2 border-l border-[#1A3D64]">
          <div className="h-8 w-8 rounded-full bg-gray-300 overflow-hidden">
          </div>
          <div className="leading-tight text-white text-xs md:text-sm">
            <p className="font-medium">Mentor Name</p>
            <p className="text-[11px] text-gray-200">Senior Mentor</p>
          </div>
        </div>
      </div>
    </header>
  );
}

export default Header; 