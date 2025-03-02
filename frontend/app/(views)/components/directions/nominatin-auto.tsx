import { useState, useEffect } from "react";
import { Input } from "@/app/(views)/components/ui/input";
import { Command, CommandEmpty, CommandGroup, CommandItem, CommandList } from "@/app/(views)/components/ui/command";
import { Loader2 } from "lucide-react";

interface NominatinAutoProps {
  onSelect?: (suggestion: any) => void;
  value?: string;
  onChange?: (value: string) => void;
}

export default function NominatinAuto({ onSelect, value, onChange }: NominatinAutoProps) {
  const [query, setQuery] = useState(value || "");
  const [suggestions, setSuggestions] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (value !== undefined && value !== query) {
      setQuery(value);
    }
  }, [value]);

  useEffect(() => {
    const delayDebouceFn = setTimeout(() => {
      if (query.length > 2) {
        fetchSuggestions();
      } else {
        setSuggestions([]);
      }
    }, 500);

    return () => clearTimeout(delayDebouceFn);
  }, [query]);

  const fetchSuggestions = async () => {
    try {
      setIsLoading(true);
      const formattedQuery = `${query}, Caracas, Venezuela`;
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&addressdetails=1&q=${encodeURIComponent(
          formattedQuery
        )}&limit=5&accept-language=es`
      );

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
    setQuery(suggestion.name);
    setSuggestions([]);
    setOpen(false);

    if (onSelect) {
      onSelect(suggestion);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setQuery(newValue);

    if (onChange) {
      onChange(newValue);
    }
  };

  return (
    <div className="relative w-full">
      <div className="flex items-center">
        <Input
          type="text"
          value={query}
          onChange={handleInputChange}
          placeholder="Buscar dirección..."
          className="w-full"
        />
        {isLoading && <Loader2 className="h-4 w-4 animate-spin text-muted-foreground absolute right-3" />}
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
