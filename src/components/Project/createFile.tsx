import { HiPlus } from "react-icons/hi2";

interface props {
  onClick: () => void;
}
const CreateFile: React.FC<props> = ({ onClick }) => {
  return (
    <div
      className="addFile p-1 invisible hover:bg-neutral-200 group-hover:visible z-20 w-fit rounded-md cursor-pointer"
      title="Create file"
      onClick={onClick}
    >
      <HiPlus />
    </div>
  );
};
export default CreateFile;
