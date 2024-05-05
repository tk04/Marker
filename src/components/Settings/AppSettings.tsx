import { appWindow } from "@tauri-apps/api/window";
import { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useTheme, Theme } from "@/ThemeProvider";
import { Switch } from "../ui/switch";
import useStore from "@/store/appStore";

const AppSettings = () => {
  const { setTheme } = useTheme();
  const { settings, setSettings } = useStore((s) => ({
    settings: s.settings,
    setSettings: s.setSettings,
  }));

  const [open, setOpen] = useState(false);
  useEffect(() => {
    const unlisten = appWindow.onMenuClicked(({ payload: menuId }) => {
      if (menuId == "settings") {
        setOpen(true);
      }
    });
    return () => {
      unlisten.then((f) => f());
    };
  }, []);
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>App Settings</DialogTitle>
          <DialogDescription>
            Adjust the app configuration here.
          </DialogDescription>
        </DialogHeader>
        <div className="py-4 space-y-7">
          <div className="justify-between items-center flex">
            <div>
              <h1>Color Scheme</h1>
              <p className="text-neutral-500 text-xs">
                Choose the default theme for Marker
              </p>
            </div>
            <div>
              <Select
                defaultValue={localStorage.getItem("ui-theme") || "system"}
                onValueChange={(val: Theme) => setTheme(val)}
              >
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Choose a theme..." />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectItem value="light">Light</SelectItem>
                    <SelectItem value="dark">Dark</SelectItem>
                    <SelectItem value="system">System</SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="justify-between items-center flex">
            <div>
              <h1>Show Table of Contents</h1>
              <p className="text-neutral-500 text-xs">
                Toggle the table of contents next to the text editor.
              </p>
            </div>
            <div>
              <Switch
                checked={settings.showTOC}
                onCheckedChange={(e) => {
                  setSettings({ ...settings, showTOC: e });
                }}
                className="border-accent data-[state=checked]:bg-primary data-[state=unchecked]:bg-border"
              />
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
export default AppSettings;
