"use client";
import { Search } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function SearchByRefIdBar({
  path,
  placeholder = "Search…",
}: {
  path: string;
  placeholder?: string;
}) {
  const [refId, setRefId] = useState<string>("");
  const router = useRouter();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (refId.trim()) {
      router.push(`${path}/${refId}`);
      setRefId("");
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleSubmit(e);
    }
  };

  return (
    <form className="relative" onSubmit={handleSubmit}>
      <label htmlFor="action-search" className="sr-only">
        Search
      </label>
      <input
        id="action-search"
        className="bg-gray-200 dark:bg-gray-700 text-white rounded-lg py-2 pl-10 pr-4 w-64  border-none focus:outline-none focus:ring-2 focus:ring-red-500 hover:ring-2 hover:ring-red-500 hover:border-red-500"
        type="search"
        placeholder={placeholder}
        value={refId}
        onChange={(e) => setRefId(e.target.value)}
        onKeyDown={handleKeyDown}
      />
      <button
        className="absolute inset-0 right-auto group"
        type="submit"
        aria-label="Search"
      >
        <Search className="absolute left-3 top-2.5 text-gray-400" size={20} />
      </button>
    </form>
  );
}
