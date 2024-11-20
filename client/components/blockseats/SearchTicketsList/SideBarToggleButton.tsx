import { FilterIcon } from "./FilterIcon";

export const SideBarToggleButton = ({
  isOpen,
  onClick,
}: {
  isOpen: boolean;
  onClick: () => void;
}) => (
  <button
    // className="bg-red-500 text-white px-4 py-2 rounded-lg shadow-md text-center flex sm:transform-none xl:hidden"
    className="bg-red-500 text-white px-4 py-2 rounded-lg shadow-md text-center inline-flex flex-row items-center justify-center space-x-2  w-full min-w-max sm:w-auto sm:transform-none xl:hidden"
    onClick={onClick}
  >
    <FilterIcon />
    <span className="ml-1 xl:hidden">{isOpen ? "Hide" : "Show"} Filter</span>
  </button>
);
