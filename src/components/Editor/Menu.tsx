import { Editor } from "@tiptap/react";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { type ChangeEvent, useCallback, useState } from "react";
import type { ReactElement } from "react";
import { MdArrowDropDown } from "react-icons/md";
import { FiLink } from "react-icons/fi";
import { BsCameraVideo } from "react-icons/bs";
import {
  AiOutlineBold,
  AiOutlineItalic,
  AiOutlineStrikethrough,
} from "react-icons/ai";
import { HiListBullet } from "react-icons/hi2";
import { BsListOl } from "react-icons/bs";
import { HiOutlineCode } from "react-icons/hi";
import type { MenuProps } from "antd";
import { Dropdown } from "antd";
import { getLinkText } from "./hasLink";
import { IoImageOutline } from "react-icons/io5";
import { TbBlockquote } from "react-icons/tb";
import { RxDividerHorizontal } from "react-icons/rx";

const items: MenuProps["items"] = [
  {
    label: "Heading 1",
    key: 1,
  },
  {
    type: "divider",
  },
  {
    label: "Heading 2",
    key: 2,
  },
  {
    label: "Heading 3",
    key: 3,
  },
  {
    type: "divider",
  },
  {
    label: "Normal Text",
    key: 0,
  },
];

interface props {
  editor: Editor | null;
}
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
        } text-xl text-stone-400 p-2 rounded-md hover:bg-stone-200/60`}
      onClick={onClick}
    >
      {icon}
    </button>
  );
};
const Menu: React.FC<props> = ({ editor }) => {
  let menu = editor?.chain();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isButtonModalOpen, setIsButtonModalOpen] = useState(false);
  const [linkText, setLinkText] = useState("");
  const [href, setHref] = useState("");

  const [buttonText, setButtonText] = useState("");
  const [buttonLink, setButtonLink] = useState("");

  const showModal = () => {
    if (!editor || !menu) return;
    const previousUrl = editor?.getAttributes("link").href;
    if (previousUrl) {
      menu.focus().unsetMark("link").run();
      return;
    }
    setHref(previousUrl);

    const { view, state } = editor;
    const { from, to } = view.state.selection;
    //@ts-ignore
    let nodeBefore = view.state.selection.$cursor?.nodeBefore;
    //@ts-ignore
    let nodeAfter = view.state.selection.$cursor?.nodeAfter;

    if (previousUrl && nodeBefore) {
      let linkText = getLinkText(nodeBefore, nodeAfter);
      setLinkText(linkText || "");
    } else {
      setLinkText(state.doc.textBetween(from, to, ""));
    }
    setIsModalOpen(true);
  };

  const headingClickHandler = ({ key }: { key: string }) => {
    if (!editor || !menu) return;
    if (key == "0") {
      menu.focus().setParagraph().run();
      return;
    }
    menu
      .focus()
      .toggleHeading({ level: Number.parseInt(key) as any })
      .run();
  };

  const setLink = useCallback(() => {
    if (!editor) return;
    if (href === null) {
      return;
    }
    if (href === "") {
      editor.chain().focus().extendMarkRange("link").unsetLink().run();
      return;
    }

    editor
      .chain()
      .focus()
      .extendMarkRange("link")
      .setLink({ href: href })
      .command(({ tr }) => {
        tr.insertText(linkText);
        return true;
      })
      .run();
  }, [editor, href, linkText]);

  const fileInputHandler = async (e: ChangeEvent<HTMLInputElement>) => {
    if (!editor) return;
    if (e.target.files && e.target.files[0]) {
      editor
        .chain()
        .focus()
        .setImage({ src: URL.createObjectURL(e.target.files[0]) })
        .focus("end")
        .run();
      editor.commands.createParagraphNear();
      //@ts-ignore
      e.target.value = null;
    }
  };

  const videoInputHandler = async (e: ChangeEvent<HTMLInputElement>) => {
    if (!editor) return;
    if (e.target.files && e.target.files[0]) {
      editor
        .chain()
        .focus()
        .setVideo({
          src: URL.createObjectURL(e.target.files[0]),
        })
        .run();
      editor.commands.createParagraphNear();
      //@ts-ignore
      e.target.value = null;
    }
  };
  const addButtonHandler = () => {
    if (!editor || !menu) return;
    menu
      .focus()
      .setButton({
        href: buttonLink,
        text: buttonText,
      })
      .run();
    editor.commands.createParagraphNear();

    setIsButtonModalOpen(false);
  };
  return (
    <>
      <div className="bg-white w-full flex flex-wrap py-3 edit-menu">
        <div>
          <Dropdown
            menu={{ items, onClick: headingClickHandler }}
            trigger={["click"]}
          >
            <a
              onClick={(e) => e.preventDefault()}
              className="text-stone-400 text-sm cursor-pointer items-center flex h-full select-none"
            >
              <p>Text Style</p> <MdArrowDropDown />
            </a>
          </Dropdown>
        </div>
        <div>
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
        </div>

        <div>
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
        </div>
        <div className="flex items-center">
          <Dialog
            open={isModalOpen}
            onOpenChange={(val) => setIsModalOpen(val)}
          >
            <DialogTrigger
              className={`${editor?.isActive("link") && "bg-stone-200/60"
                } text-xl text-stone-400 p-2 rounded-md hover:bg-stone-200/60`}
              onClick={showModal}
            >
              <FiLink />
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add Link</DialogTitle>
              </DialogHeader>

              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  setLink();
                  setIsModalOpen(false);
                }}
              >
                <div className="space-y-5 mt-5">
                  <div>
                    <Label htmlFor="text" className="block mb-2" aria-required>
                      Text<span className="text-red-500">*</span>
                    </Label>
                    <Input
                      placeholder="Enter text..."
                      required
                      className="h-10"
                      value={linkText}
                      onChange={(value) => setLinkText(value.target.value)}
                    />
                  </div>

                  <div>
                    <Label htmlFor="text" className="block mb-2" aria-required>
                      Link Address<span className="text-red-500">*</span>
                    </Label>
                    <Input
                      required
                      placeholder="Enter URL.."
                      className="h-10"
                      value={href}
                      onChange={(value) => setHref(value.target.value)}
                    />
                  </div>
                </div>
                <DialogFooter className="mt-5">
                  <Button type="submit">Add Link</Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>

          <input
            type="file"
            hidden
            accept="image/*"
            id="image-input"
            onChange={fileInputHandler}
          />
          <label
            htmlFor="image-input"
            className="text-xl text-stone-400 rounded-md hover:bg-stone-200/60 cursor-pointer p-2 inline-block text-center"
          >
            <IoImageOutline />
          </label>

          <input
            type="file"
            hidden
            accept="video/mp4"
            id="video-input"
            onChange={videoInputHandler}
          />
          <label
            htmlFor="video-input"
            className="text-xl text-stone-400 rounded-md hover:bg-stone-200/60 cursor-pointer p-2 inline-block text-center"
          >
            <BsCameraVideo />
          </label>
        </div>
        <div>
          <Dialog
            open={isButtonModalOpen}
            onOpenChange={(val) => setIsButtonModalOpen(val)}
          >
            <DialogTrigger
              asChild
              onClick={() => {
                setButtonText("");
                setButtonLink("");
              }}
            >
              <button className="text-sm text-stone-400 p-2 rounded-md hover:bg-stone-200/60 select-none">
                Button
              </button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add Button</DialogTitle>
              </DialogHeader>
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  addButtonHandler();
                }}
              >
                <div className="space-y-5 mt-5">
                  <div>
                    <Label htmlFor="text" className="block mb-2" aria-required>
                      Text<span className="text-red-500">*</span>
                    </Label>
                    <Input
                      placeholder="Enter text..."
                      required
                      className="h-10"
                      value={buttonText}
                      onChange={(value) => setButtonText(value.target.value)}
                    />
                  </div>

                  <div>
                    <Label htmlFor="text" className="block mb-2" aria-required>
                      Link Address<span className="text-red-500">*</span>
                    </Label>
                    <Input
                      placeholder="Enter URL.."
                      required
                      className="h-10"
                      value={buttonLink}
                      onChange={(value) => setButtonLink(value.target.value)}
                    />
                  </div>
                </div>
                <DialogFooter className="mt-5">
                  <Button>Add Button</Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </div>
    </>
  );
};
export default Menu;
