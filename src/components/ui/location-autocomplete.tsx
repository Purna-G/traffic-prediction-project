import { useState, useEffect, useRef } from 'react';
import { API_BASE_URL } from '@/lib/api';

import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import { MapPin, Loader2 } from 'lucide-react';

interface LocationSuggestion {
    name: string;
    full_name: string;
    lat: number;
    lon: number;
    type: string;
}

interface LocationAutocompleteProps {
    value: string;
    onChange: (value: string) => void;
    placeholder?: string;
    className?: string;
    error?: string;
}

export function LocationAutocomplete({
    value,
    onChange,
    placeholder = "Enter location",
    className,
    error
}: LocationAutocompleteProps) {
    const [suggestions, setSuggestions] = useState<LocationSuggestion[]>([]);
    const [isOpen, setIsOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [inputValue, setInputValue] = useState(value);
    const wrapperRef = useRef<HTMLDivElement>(null);
    const debounceRef = useRef<NodeJS.Timeout>();

    // Sync with external value
    useEffect(() => {
        setInputValue(value);
    }, [value]);

    // Click outside to close
    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        }
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const fetchSuggestions = async (query: string) => {
        if (query.length < 2) {
            setSuggestions([]);
            return;
        }

        setIsLoading(true);
        try {
            const response = await fetch(
                `http://localhost:5000/api/autocomplete?q=${encodeURIComponent(query)}`
            );
            const data = await response.json();
            setSuggestions(data);
            setIsOpen(data.length > 0);
        } catch (error) {
            console.error('Autocomplete error:', error);
            setSuggestions([]);
        } finally {
            setIsLoading(false);
        }
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newValue = e.target.value;
        setInputValue(newValue);
        onChange(newValue);

        // Debounce API calls
        if (debounceRef.current) {
            clearTimeout(debounceRef.current);
        }
        debounceRef.current = setTimeout(() => {
            fetchSuggestions(newValue);
        }, 300);
    };

    const handleSelect = (suggestion: LocationSuggestion) => {
        setInputValue(suggestion.name);
        onChange(suggestion.name);
        setSuggestions([]);
        setIsOpen(false);
    };

    return (
        <div ref={wrapperRef} className="relative">
            <div className="relative">
                <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                    value={inputValue}
                    onChange={handleInputChange}
                    onFocus={() => suggestions.length > 0 && setIsOpen(true)}
                    placeholder={placeholder}
                    className={cn(
                        "pl-10 pr-10 bg-background/50 backdrop-blur-sm border-border/50 transition-all",
                        "focus:ring-2 focus:ring-primary/20 focus:border-primary/50",
                        error && "border-destructive",
                        className
                    )}
                />
                {isLoading && (
                    <Loader2 className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground animate-spin" />
                )}
            </div>

            {/* Suggestions Dropdown */}
            {isOpen && suggestions.length > 0 && (
                <div className="absolute z-50 w-full mt-1 bg-popover/95 backdrop-blur-xl border border-border/50 rounded-lg shadow-xl overflow-hidden">
                    {suggestions.map((suggestion, index) => (
                        <button
                            key={`${suggestion.lat}-${suggestion.lon}-${index}`}
                            type="button"
                            onClick={() => handleSelect(suggestion)}
                            className={cn(
                                "w-full px-4 py-3 text-left hover:bg-accent/50 transition-colors",
                                "flex items-start gap-3 border-b border-border/30 last:border-0"
                            )}
                        >
                            <MapPin className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                            <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium text-foreground truncate">
                                    {suggestion.name}
                                </p>
                                <p className="text-xs text-muted-foreground truncate">
                                    {suggestion.full_name}
                                </p>
                            </div>
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
}
