import { ArrowRight } from "lucide-react";

export const SearchButton = ({ onClick }: { onClick?: () => void }) => (
  <button
    type="submit"
    onClick={onClick}
    className="bg-red-500 text-white font-bold py-3 px-6 rounded-lg hover:bg-red-600 transition-colors flex items-center space-x-2 duration-300 absolute right-5"
  >
    <span>Find ticket</span>
    <ArrowRight size={20} />
  </button>
);
