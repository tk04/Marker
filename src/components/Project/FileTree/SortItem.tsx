import { ReactNode } from "react";
import { IoMdCheckmark } from "react-icons/io";

interface props {
  active: boolean;
  children: ReactNode;
  onClick: () => void;
}
const SortItem: React.FC<props> = ({ active, children, onClick }) => {
  return (
    <button
      onClick={onClick}
      className={`flex pr-2 justify-between py-2 font-medium gap-2 items-center hover:bg-neutral-700 p-1 pl-3 w-full ${
        active && "bg-neutral-600"
      }`}
      tabIndex={0}
    >
      <div className="flex gap-2">{children}</div>
      {active && <IoMdCheckmark />}
    </button>
  );
};

export default SortItem;
