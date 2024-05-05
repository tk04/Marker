import { appWindow } from "@tauri-apps/api/window";
import { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

const AppSettings = () => {
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
        <div className="grid gap-4 py-4">
          <h1>settings...</h1>
        </div>
      </DialogContent>
    </Dialog>
  );
};
export default AppSettings;
