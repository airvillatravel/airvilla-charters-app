import { Info } from "lucide-react";

export default function Tooltip({ text }: { text: string }) {
  return (
    <div className="group relative inline-block ml-1">
      <Info size={16} className="text-gray-500 cursor-help" />
      <div className="opacity-0 bg-gray-800 text-white text-xs rounded-lg py-2 px-3 absolute z-10 bottom-full left-1/2 transform -translate-x-1/2 -translate-y-2 group-hover:opacity-100 transition-opacity duration-300 w-48 pointer-events-none">
        {text}
        <svg
          className="absolute text-gray-800 h-2 w-full left-0 top-full"
          x="0px"
          y="0px"
          viewBox="0 0 255 255"
        >
          <polygon className="fill-current" points="0,0 127.5,127.5 255,0" />
        </svg>
      </div>
    </div>
  );
}
