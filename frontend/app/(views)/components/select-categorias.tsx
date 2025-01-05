"use client";

import { useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/app/(views)/components/ui/select";
import React from "react";
import { cn } from "@/app/controladores/lib/utils";

type SelectCategoriasProps = {
  value?: string;
  placeholder: string;
  options: { label: string; value: string }[];
  className?: string;
  onChange?: (newValue: string) => void;
};

export function SelectCategorias({
  value,
  placeholder,
  options,
  className,
  onChange,
}: SelectCategoriasProps) {
  const [selectedValue, setSelectedValue] = useState(value);

  const handleValueChange = (newValue: string) => {
    setSelectedValue(newValue);
    if (onChange) {
      onChange(newValue);
    }
  };

  return (
    <Select value={selectedValue} onValueChange={handleValueChange}>
      <SelectTrigger className={cn(className)}>
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>
      <SelectContent>
        {options.map((option) => (
          <SelectItem key={option.value} value={option.value}>
            {option.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
