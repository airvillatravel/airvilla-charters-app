import { ArrowRightLeft } from "lucide-react";

export const FlipButton = ({ onClick }: any) => (
  <div className="flex justify-center items-center">
    <button
      type="button"
      onClick={onClick}
      className="p-2 bg-white rounded-full shadow-md hover:shadow-lg transition-shadow"
    >
      <ArrowRightLeft size={24} className="dark:text-gray-800" />
    </button>
  </div>
);
