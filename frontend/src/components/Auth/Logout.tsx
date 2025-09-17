"use client";

import { LogOut } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useRouter } from "next/navigation";

export function LogoutButton() {
  const [open, setOpen] = useState(false);
  const router = useRouter();

  const handleLogout = async () => {
    const token = localStorage.getItem("token");
    if (token) {
      const res = await fetch("http://localhost:8000/api/logout", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (res.ok) {
        localStorage.removeItem("token");
        window.location.reload();
        setOpen(false);
      }
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="gap-2 bg-transparent">
          <LogOut className="h-4 w-4" />
          ログアウト
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>ログアウトしますか？</DialogTitle>
          <DialogDescription>
            ログアウトすると、現在のセッションが終了します。
            再度ログインが必要になります。
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>
            キャンセル
          </Button>
          <Button onClick={handleLogout}>ログアウト</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
