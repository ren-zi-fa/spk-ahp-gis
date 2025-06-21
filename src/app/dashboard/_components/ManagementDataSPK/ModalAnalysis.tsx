"use client";

/* eslint-disable @typescript-eslint/no-explicit-any*/


import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { AnalysisSchema } from "@/schema";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { DialogTitle } from "@radix-ui/react-dialog";
import { toast } from "sonner";
import { mutate } from "swr";

type FormData = z.infer<typeof AnalysisSchema>;

export default function ModalAnalysis() {
  const [open, setOpen] = useState(false);
  const form = useForm<FormData>({
    resolver: zodResolver(AnalysisSchema),
    defaultValues: {
      analysisName: "",
      id: "",
    },
  });

  const { setError } = form;

  const onSubmit = async (values: FormData) => {
    const { analysisName } = values;
    try {
      const res = await fetch("/api/analysis", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          analysisName
        }),
      });

      const result = await res.json();

      if (res.ok) {
        toast.success("Analysis created successfully");
        mutate("/api/analysis");
        form.reset();
        setOpen(false);
        return;
      } else {
        setError("analysisName", {
          type: "server",
          message: result.message || "Terjadi kesalahan.",
        });
        return;
      }
    } catch (error: any) {
      setError("root", {
        type: "server",
        message: error.message || "Terjadi kesalahan saat mengirim data.",
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>Create Analysis</Button>
      </DialogTrigger>
      <DialogContent onInteractOutside={(e) => e.preventDefault()}>
        <DialogTitle>Name of your analysis</DialogTitle>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
            <FormField
              control={form.control}
              name="analysisName"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input
                      placeholder="analisis pertama"
                      {...field}
                      onChange={(e) => field.onChange(e.target.value)}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" className="w-full text-base py-2">
              Create
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
