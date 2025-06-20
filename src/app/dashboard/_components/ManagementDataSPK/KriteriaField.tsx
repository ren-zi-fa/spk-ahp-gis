"use client";

import { useFormContext, useFieldArray } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Plus, Trash } from "lucide-react";

export default function KriteriaFields({ name }: { name: "criteria" }) {
  const {
    register,
    control,
    formState: { errors },
  } = useFormContext();

  const { fields, append, remove } = useFieldArray({
    control,
    name,
  });

  return (
    <div className="space-y-3">
      {fields.map((field, index) => (
        <div key={field.id} className="relative">
          <Input
            placeholder={`Kriteria ${index + 1}`}
            {...register(`${name}.${index}.name` as const)}
            className="pr-10"
          />
          <button
            type="button"
            onClick={() => remove(index)}
            className="absolute right-2 top-1/2 -translate-y-1/2 text-red-500"
          >
            <Trash className="w-4 h-4" />
          </button>
        </div>
      ))}
      {errors[name] ? (
        <p className="text-red-500 text-xs">criteria should not empty</p>
      ) : (
        ""
      )}

      <Button
        type="button"
        onClick={() => append({ name: "" })}
        variant="outline"
        className="w-full flex items-center gap-2"
      >
        <Plus className="w-4 h-4" /> Tambah Kriteria
      </Button>
    </div>
  );
}
