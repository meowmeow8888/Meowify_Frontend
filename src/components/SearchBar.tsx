import { Search } from "lucide-react";

function SearchBar() {
  return (
    <div
      className="flex items-center justify-between
                 h-10 w-lg px-4
                 bg-[#2e3337] rounded-xl border border-transparent
                 focus-within:bg-black focus-within:border-white hover:border-white
                 transition-colors duration-150"
    >
      <input
        className="outline-none flex-1 bg-transparent"
        placeholder="Search"
      />
      <Search />
    </div>
  );
}

export default SearchBar;