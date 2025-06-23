"use client";

import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle2Icon, Loader2 } from "lucide-react";
import { useSession } from "next-auth/react";
import useSWR from "swr";
import { fetcher } from "@/lib/fetcher";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { User } from "@prisma/client";
import { useState, useEffect } from "react";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import { toast } from "sonner";

const AccountSchema = z
  .object({
    username: z.string().min(1, "Username wajib diisi"),
    password: z.string().min(2, "Password minimal 2 karakter"),
    confirmPassword: z
      .string()
      .min(2, "Konfirmasi password minimal 2 karakter"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    path: ["confirmPassword"],
    message: "Konfirmasi password tidak cocok",
  });

type FormValues = z.infer<typeof AccountSchema>;

export default function AccountsCard() {
  const { data: session } = useSession();
  const { data: user } = useSWR<User>(
    session?.user.id ? `/api/user/${session.user.id}` : null,
    fetcher
  );

  const form = useForm<FormValues>({
    resolver: zodResolver(AccountSchema),
    defaultValues: {
      username: "",
      password: "",
      confirmPassword: "",
    },
  });

  const [isLoading, setIsLoading] = useState(false);
  const [updateSuccess, setUpdateSuccess] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [confirmName, setConfirmName] = useState(""); // NEW

  useEffect(() => {
    if (user) {
      form.reset({
        username: user.username || "",
        password: "",
        confirmPassword: "",
      });
    }
  }, [user, form]);

  const handleConfirmSubmit = form.handleSubmit(async (data) => {
    if (confirmName.trim().toLowerCase() !== "skirk") {
      toast.error("Salah bukan itu namanya");
      return;
    }

    if (!session?.user.id) {
      toast.error("Session tidak ditemukan.");
      return;
    }

    setIsLoading(true);
    try {
      const res = await fetch(`/api/user/${session.user.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: data.username,
          password: data.password,
        }),
      });

      if (!res.ok) {
        const error = await res.json();
        toast.error(`Gagal update: ${error.error}`);
      } else {
        await res.json();
        setUpdateSuccess(true);
        toast.success("Akun berhasil diperbarui!");
        form.reset({
          username: data.username,
          password: "",
          confirmPassword: "",
        });
      }
    } catch (err) {
      console.log(err);
      toast.error("Terjadi kesalahan saat update.");
    } finally {
      setIsLoading(false);
      setConfirmOpen(false);
      setConfirmName("");
    }
  });

  if (!user) {
    return (
      <Card className="max-w-md mx-auto mt-8 p-6 text-center">
        <p className="text-muted-foreground">Memuat...</p>
      </Card>
    );
  }

  return (
    <>
      {updateSuccess && (
        <Alert className="bg-green-500 w-sm mx-auto">
          <CheckCircle2Icon />
          <AlertTitle>Sukses! Akun berhasil diupdate</AlertTitle>
          <AlertDescription className="text-white">
            Perubahan akan diterapkan saat Anda logout
          </AlertDescription>
        </Alert>
      )}

      <Card className="max-w-md mx-auto mt-8">
        <Form {...form}>
          <form onSubmit={(e) => e.preventDefault()}>
            <CardContent className="space-y-4 py-6">
              <FormField
                control={form.control}
                name="username"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Username</FormLabel>
                    <FormControl>
                      <Input placeholder="Masukkan username" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <Input
                        type="password"
                        placeholder="Masukkan password baru"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="confirmPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Konfirmasi Password</FormLabel>
                    <FormControl>
                      <Input
                        type="password"
                        placeholder="Ulangi password"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>

            <CardFooter>
              <Dialog open={confirmOpen} onOpenChange={setConfirmOpen}>
                <DialogTrigger asChild>
                  <Button type="button">Update Account</Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Konfirmasi Update</DialogTitle>
                    <DialogDescription>
                      Siapa Nama Guru{" "}
                      <span className="font-bold text-black">Tartaglia</span>
                    </DialogDescription>
                  </DialogHeader>

                  <div className="grid gap-4 pt-2">
                    <Input
                      placeholder="Name"
                      value={confirmName}
                      onChange={(e) => setConfirmName(e.target.value)}
                    />
                  </div>

                  <DialogFooter className="pt-4">
                    <Button
                      variant="outline"
                      onClick={() => setConfirmOpen(false)}
                    >
                      Batal
                    </Button>
                    <Button
                      type="button"
                      onClick={handleConfirmSubmit}
                      disabled={isLoading}
                    >
                      {isLoading ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        "Ya, Update"
                      )}
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </CardFooter>
          </form>
        </Form>
      </Card>
    </>
  );
}
