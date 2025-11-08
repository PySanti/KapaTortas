import { useState, useEffect } from "react";
import { Input } from "@/app/(views)/components/ui/input";
import { Command, CommandEmpty, CommandGroup, CommandItem, CommandList } from "@/app/(views)/components/ui/command";
import { Loader2 } from "lucide-react";

interface NominatinAutoProps {
  onSelect?: (suggestion: any) => void;
  defaultValue?: string;
  value?: string;
  onChange?: (value: string) => void;
}

export default function NominatinAuto({ onSelect, defaultValue, value, onChange }: NominatinAutoProps) {
    const [query, setQuery] = useState(value || defaultValue || "");
    const [suggestions, setSuggestions] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [open, setOpen] = useState(false);

    useEffect(() => {
        if (value !== undefined && query !== value) {
            setQuery(value);
        } else if (defaultValue && query !== defaultValue) {
            setQuery(defaultValue);
        }
    }, [value, defaultValue]);

    useEffect(() => {
        const delayDebouceFn = setTimeout(() => {
            if (query.length > 2) {
                fetchSuggestions();
            } else {
                setSuggestions([]);
            }
        }, 500); // Reduced from 1000ms to 500ms for better responsiveness

        return () => clearTimeout(delayDebouceFn);
    }, [query]);

    const fetchSuggestions = async () => {
        try {
            setIsLoading(true);
            const formattedQuery = `${query}, Caracas, Venezuela`;
            const response = await fetch(`https://nominatim.openstreetmap.org/search?format=json&addressdetails=1&q=${encodeURIComponent(formattedQuery)}&limit=5`);

            const data = await response.json();
            setSuggestions(data);
            setOpen(data.length > 0);
        } catch (error) {
            console.error("Error fetching suggestions:", error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleSuggestionClick = (suggestion: any) => {
        const displayValue = suggestion.display_name || suggestion.name || "";
        setQuery(displayValue);
        setSuggestions([]);
        setOpen(false);
        
        if (onChange) {
            onChange(displayValue);
        }
        
        if (onSelect) {
            onSelect(suggestion);
        }
    };

    return (
        <div className="relative w-full">
            <div className="flex items-center">
                <Input 
                    type="text" 
                    value={query} 
                    onChange={(e) => {
                        const newValue = e.target.value;
                        setQuery(newValue);
                        if (onChange) {
                            onChange(newValue);
                        }
                    }} 
                    placeholder="Buscar dirección..."
                    className="w-full"
                />
                {isLoading && (
                    <Loader2 className="h-4 w-4 animate-spin text-muted-foreground absolute right-3" />
                )}
            </div>
            
            {open && suggestions.length > 0 && (
                <div className="absolute z-50 w-full mt-1">
                    <Command className="rounded-lg border shadow-md">
                        <CommandList>
                            <CommandGroup heading="Sugerencias">
                                {suggestions.map((suggestion: any) => (
                                    <CommandItem
                                        key={suggestion.place_id}
                                        onSelect={() => handleSuggestionClick(suggestion)}
                                        className="cursor-pointer hover:bg-accent"
                                    >
                                        <div className="text-sm truncate">{suggestion.display_name}</div>
                                    </CommandItem>
                                ))}
                            </CommandGroup>
                        </CommandList>
                        <CommandEmpty>No se encontraron resultados.</CommandEmpty>
                    </Command>
                </div>
            )}
        </div>
    );
}