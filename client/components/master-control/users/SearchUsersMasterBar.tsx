import { Search } from "lucide-react";

export default function SearchUsersMasterBar({
  placeholder = "Search…",
  searchInput,
  setSearchInput,
}: {
  placeholder?: string;
  searchInput: string;
  setSearchInput: React.Dispatch<React.SetStateAction<string>>;
}) {
  return (
    <form className="relative">
      <label htmlFor="action-search" className="sr-only">
        Search
      </label>
      <input
        id="action-search"
        className="bg-gray-200 dark:bg-gray-700 dark:text-white rounded-lg py-2 pl-10 pr-4 w-64  border-none focus:outline-none focus:ring-2 focus:ring-red-500 hover:ring-2 hover:ring-red-500 hover:border-red-500"
        type="search"
        placeholder={placeholder}
        value={searchInput}
        onChange={(e) => setSearchInput(e.target.value)}
      />
      <button
        className="absolute inset-0 right-auto group"
        type="button"
        aria-label="Search"
      >
        <Search className="absolute left-3 top-2.5 text-gray-400" size={20} />
      </button>
    </form>
  );
}
