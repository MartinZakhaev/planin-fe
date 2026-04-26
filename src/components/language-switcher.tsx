"use client";

import { LanguagesIcon } from "lucide-react";

import { useLanguage } from "@/context/language-context";
import { languages, type Language } from "@/lib/i18n";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";

interface LanguageSwitcherProps {
  className?: string;
  compact?: boolean;
}

export function LanguageSwitcher({ className, compact = false }: LanguageSwitcherProps) {
  const { language, setLanguage } = useLanguage();

  return (
    <div className={cn("flex items-center gap-2", className)}>
      {!compact && <LanguagesIcon className="size-4 text-muted-foreground" />}
      <Select value={language} onValueChange={(value) => setLanguage(value as Language)}>
        <SelectTrigger
          className={cn(
            "h-9 border-border/70 bg-background/80 text-xs shadow-xs backdrop-blur",
            compact ? "w-24" : "w-40"
          )}
          aria-label="Language"
        >
          <SelectValue />
        </SelectTrigger>
        <SelectContent align="end">
          {Object.entries(languages).map(([value, label]) => (
            <SelectItem key={value} value={value}>
              {compact ? value.toUpperCase() : label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
