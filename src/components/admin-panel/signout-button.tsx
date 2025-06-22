"use client";

import { useState } from "react";
import { signOut } from "next-auth/react";
import { LogOut } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

interface Props {
  isOpen?: boolean;
}

export function SignOutButton({ isOpen }: Props) {
  const [open, setOpen] = useState(false);

  return (
    <TooltipProvider disableHoverableContent>
      <Dialog open={open} onOpenChange={setOpen}>
        <Tooltip delayDuration={100}>
          <TooltipTrigger asChild>
            <DialogTrigger asChild>
              <Button
                variant="outline"
                className="w-full justify-center h-10 mt-5"
              >
                <span className={cn(isOpen ? "mr-4" : "")}>
                  <LogOut size={18} />
                </span>
                <p
                  className={cn(
                    "whitespace-nowrap",
                    isOpen ? "opacity-100" : "opacity-0 hidden"
                  )}
                >
                  Sign out
                </p>
              </Button>
            </DialogTrigger>
          </TooltipTrigger>

          {!isOpen && <TooltipContent side="right">Sign out</TooltipContent>}
        </Tooltip>

        <DialogContent className="w-sm">
          <DialogHeader className="mt-10">
            <DialogTitle>Keluar dari dashboard?</DialogTitle>
          </DialogHeader>
          <DialogFooter className="mt-4 flex justify-end gap-2">
            <Button variant="outline" onClick={() => setOpen(false)}>
              Batal
            </Button>
            <Button
              variant="destructive"
              onClick={() => {
                setOpen(false);
                signOut({ callbackUrl: "/" });
              }}
            >
              Keluar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </TooltipProvider>
  );
}
