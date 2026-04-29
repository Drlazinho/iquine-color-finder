import { cn } from "@/lib/utils";
import logoIquine from "@/assets/logo-iquine.png";

export function IquineLogo({ variant = "red", className }: { variant?: "red" | "white"; className?: string }) {
  return (
    <img
      src={logoIquine}
      alt="Iquine"
      className={cn(
        "h-10 w-auto object-contain",
        className,
      )}
    />
  );
}
