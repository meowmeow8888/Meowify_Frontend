import { Search } from "lucide-react";
import { useState, useEffect, useRef } from "react";

interface SearchBarProps {
  onQueryChange: (query: string) => void;
  onSearchSubmit: (query: string) => void;
  suggestions: string[];
}

function SearchBar({
  onQueryChange,
  onSearchSubmit,
  suggestions,
}: SearchBarProps) {
  const [value, setValue] = useState("");
  const debounceTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setShowDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVal = e.target.value;
    setValue(newVal);
    setShowDropdown(true);

    if (debounceTimer.current) clearTimeout(debounceTimer.current);
    debounceTimer.current = setTimeout(() => {
      if (newVal.trim()) {
        onQueryChange(newVal);
      }
    }, 400);
  };

  const selectSuggestion = (s: string) => {
    setValue(s);
    setShowDropdown(false);
    onSearchSubmit(s);
  };

  return (
    <div className="pl-134 relative group" ref={dropdownRef}>
      <div
        className="flex items-center justify-between
                 h-10 w-lg px-4
                 bg-[#2e3337] rounded-xl border border-transparent
                 focus-within:bg-black focus-within:border-white hover:border-white
                 transition-colors duration-150"
      >
        <input
          className="outline-none flex-1 bg-transparent text-white"
          placeholder="Search"
          value={value}
          onChange={handleChange}
          onFocus={() => value.trim() && setShowDropdown(true)}
          onKeyDown={(e) => e.key === "Enter" && selectSuggestion(value)}
        />
        <Search
          className="cursor-pointer text-gray-400 hover:text-white"
          onClick={() => value.trim() && onSearchSubmit(value)}
        />
      </div>
      {showDropdown && suggestions.length > 0 && (
        <div className="absolute top-10 right-0 w-lg bg-[#1a1c1e] border border-white/10 border-t-0 rounded-b-xl shadow-2xl z-50 overflow-hidden">
          {suggestions.map((s, i) => (
            <div
              key={i}
              onClick={() => selectSuggestion(s)}
              className="px-4 py-2.5 text-right text-gray-300 hover:bg-white/10 hover:text-white cursor-pointer transition-colors border-b border-white/5 last:border-0 flex items-center justify-end gap-3"
            >
              <span className="text-sm font-medium">{s}</span>
              <Search className="size-3.5 text-gray-500" />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default SearchBar;
