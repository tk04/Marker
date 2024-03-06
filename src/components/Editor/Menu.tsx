import type { Editor } from "@tiptap/react";
import { BubbleMenu } from "@tiptap/react";

import type { ReactElement } from "react";
import {
  AiOutlineBold,
  AiOutlineItalic,
  AiOutlineStrikethrough,
} from "react-icons/ai";
import { HiListBullet } from "react-icons/hi2";
import { BsListOl } from "react-icons/bs";
import { HiOutlineCode } from "react-icons/hi";
import { TbBlockquote } from "react-icons/tb";
import { RxDividerHorizontal } from "react-icons/rx";

const MenuItem = ({
  icon,
  onClick,
  isActive = false,
}: {
  icon: ReactElement;
  isActive?: boolean;
  onClick?: () => void;
}) => {
  return (
    <button
      className={`${isActive && " bg-stone-200/60"
        } text-[16px] text-stone-400 p-2 rounded-md hover:bg-stone-200/60`}
      onClick={onClick}
    >
      {icon}
    </button>
  );
};
interface props {
  editor: Editor;
}
const Menu: React.FC<props> = ({ editor }) => {
  let menu = editor.chain();
  return (
    <BubbleMenu
      className={`space-x-2 border p-1 rounded-md text-xs bg-white`}
      editor={editor}
      updateDelay={0}
      tippyOptions={{ duration: 100 }}
    >
      <MenuItem
        icon={<AiOutlineBold />}
        isActive={editor?.isActive("bold")}
        onClick={() => menu?.focus().toggleBold().run()}
      />

      <MenuItem
        icon={<AiOutlineItalic />}
        isActive={editor?.isActive("italic")}
        onClick={() => menu?.focus().toggleItalic().run()}
      />

      <MenuItem
        icon={<AiOutlineStrikethrough />}
        isActive={editor?.isActive("strike")}
        onClick={() => menu?.focus().toggleStrike().run()}
      />

      <MenuItem
        icon={<HiOutlineCode />}
        isActive={editor?.isActive("codeBlock")}
        onClick={() => menu?.focus().toggleCodeBlock().run()}
      />

      <MenuItem
        icon={<HiListBullet />}
        isActive={editor?.isActive("bulletList")}
        onClick={() => menu?.focus().toggleBulletList().run()}
      />

      <MenuItem
        icon={<BsListOl />}
        isActive={editor?.isActive("orderedList")}
        onClick={() => menu?.focus().toggleOrderedList().run()}
      />

      <MenuItem
        icon={<TbBlockquote />}
        isActive={editor?.isActive("blockquote")}
        onClick={() => menu?.focus().toggleBlockquote().run()}
      />

      <MenuItem
        icon={<RxDividerHorizontal />}
        isActive={editor?.isActive("horizontalRule")}
        onClick={() => menu?.focus().setHorizontalRule().run()}
      />
    </BubbleMenu>
  );
};
export default Menu;
