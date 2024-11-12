"use client"

import * as React from "react"
import { format } from "date-fns"
import { CalendarIcon } from "lucide-react"
 
import { cn } from "@/app/controladores/lib/utils"
import { Button } from "@/app/(views)/components/ui/button"
import { Calendar } from "@/app/(views)/components/ui/calendar"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/app/(views)/components/ui/popover"

interface DatePickerProps {
    date: Date | undefined;
    setDate: (date: Date | undefined) => void;
}

export function DatePicker({ date, setDate }: DatePickerProps) {
    return (
        <Popover>
        <PopoverTrigger asChild>
            <Button
            variant={"ghost"}
            className={cn(
                "w-[240px] justify-start text-left font-light hover:bg-white hover:bg-opacity-10 border-b-2 rounded-md",
                !date && "text-muted-foreground "
            )}
            >
            <CalendarIcon className="text-white opacity-80 hover:bg-transparent " />
            {date ? 
            <span className="text-white text-base opacity-80">{format(date, "PPP")}</span> : 
            
            <span className="text-white text-base opacity-80">Escoge una fecha</span>}
            </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
            <Calendar
            mode="single"
            selected={date}
            onSelect={setDate}
            initialFocus
            className="bg-secondary-light"
            />
        </PopoverContent>
    </Popover>
    )
}