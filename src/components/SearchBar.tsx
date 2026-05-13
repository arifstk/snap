// src/components/SearchBar.tsx
'use client';
import { useEffect, useRef, useState } from "react";
import { Search, X } from "lucide-react";
import { useDispatch } from "react-redux";
import { setSearchQuery } from "@/redux/userSlice";
import { useRouter, usePathname } from "next/navigation";

interface Props {
  className?: string;
  autoFocus?: boolean;
  onClose?: () => void;
}

const SearchBar = ({ className = "", autoFocus = false, onClose }: Props) => {
  const dispatch = useDispatch();
  const router = useRouter();
  const pathname = usePathname();
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [allProductNames, setAllProductNames] = useState<string[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const skipSuggestionsRef = useRef(false); // ✅ suppress dropdown after selection

  useEffect(() => {
    const fetchNames = async () => {
      try {
        const res = await fetch("/api/products/names");
        const data = await res.json();
        setAllProductNames(data.names || []);
      } catch (err) {
        console.error("Failed to fetch product names", err);
      }
    };
    fetchNames();
  }, []);

  useEffect(() => {
    // ✅ If selection just happened, skip reopening the dropdown
    if (skipSuggestionsRef.current) {
      skipSuggestionsRef.current = false;
      return;
    }

    if (query.trim().length === 0) {
      setSuggestions([]);
      setShowDropdown(false);
      return;
    }

    const filtered = allProductNames
      .filter(name => name.toLowerCase().includes(query.toLowerCase()))
      .slice(0, 6);

    setSuggestions(filtered);
    setShowDropdown(filtered.length > 0);
  }, [query, allProductNames]);

  useEffect(() => {
    const handleOutside = (e: MouseEvent) => {
      if (
        dropdownRef.current && !dropdownRef.current.contains(e.target as Node) &&
        inputRef.current && !inputRef.current.contains(e.target as Node)
      ) {
        setShowDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleOutside);
    return () => document.removeEventListener("mousedown", handleOutside);
  }, []);

  const handleSearch = (value: string) => {
    setQuery(value);
    dispatch(setSearchQuery(value));
    if (value.trim() && pathname !== "/") {
      router.push("/");
    }
  };

  const handleSelect = (name: string) => {
    skipSuggestionsRef.current = true; // ✅ tell the effect to skip next run
    setQuery(name);
    setSuggestions([]);               // ✅ clear immediately
    setShowDropdown(false);           // ✅ close immediately
    dispatch(setSearchQuery(name));
    inputRef.current?.blur();         // ✅ remove focus so onFocus doesn't reopen
    if (pathname !== "/") router.push("/");
    onClose?.();
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    dispatch(setSearchQuery(query));
    setShowDropdown(false);
    if (pathname !== "/") router.push("/");
    onClose?.();
  };

  const handleClear = () => {
    setQuery("");
    dispatch(setSearchQuery(""));
    setSuggestions([]);
    setShowDropdown(false);
    inputRef.current?.focus();
  };

  return (
    <div className={`relative ${className}`}>
      <form
        onSubmit={handleSubmit}
        className="flex items-center bg-white rounded-full px-4 py-2 shadow-md w-full"
      >
        <Search className="text-gray-500 w-5 h-5 mr-2 shrink-0" />
        <input
          ref={inputRef}
          type="text"
          value={query}
          autoFocus={autoFocus}
          placeholder="Search groceries..."
          className="w-full focus:outline-none text-gray-700 placeholder-gray-400"
          onChange={(e) => handleSearch(e.target.value)}
          onFocus={() => {
            // ✅ Only reopen if user is actively typing, not after a selection
            if (!skipSuggestionsRef.current && suggestions.length > 0) {
              setShowDropdown(true);
            }
          }}
        />
        {query && (
          <button type="button" onClick={handleClear} className="text-gray-400 hover:text-gray-600 cursor-pointer shrink-0">
            <X size={16} />
          </button>
        )}
      </form>

      {/* Autocomplete Dropdown */}
      {showDropdown && (
        <div
          ref={dropdownRef}
          className="absolute top-full left-0 right-0 mt-2 bg-white rounded-xl shadow-xl border border-gray-100 z-99999 overflow-hidden"
        >
          {suggestions.map((name, index) => (
            <button
              key={index}
              type="button"
              onMouseDown={(e) => e.preventDefault()} // ✅ prevent input blur before click fires
              onClick={() => handleSelect(name)}
              className="flex items-center gap-3 w-full px-4 py-3 hover:bg-gray-50 text-left border-b border-gray-100 last:border-none transition-colors"
            >
              <Search className="w-4 h-4 text-gray-400 shrink-0" />
              <span className="text-gray-800">{name}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default SearchBar;