import { IoIosArrowForward } from "react-icons/io";
interface props {
  children: string;
  onClick: () => void;
}
const Option: React.FC<props> = ({ children, onClick }) => {
  return (
    <div
      className="flex justify-between items-center hover:bg-neutral-200/40 cursor-pointer rounded-lg py-2 px-2 w-44"
      onClick={onClick}
    >
      <p>{children}</p> <IoIosArrowForward />
    </div>
  );
};
export default Option;
