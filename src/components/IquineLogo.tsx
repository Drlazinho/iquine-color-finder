import { cn } from "@/lib/utils";

export function IquineLogo({ variant = "red", className }: { variant?: "red" | "white"; className?: string }) {
  const isRed = variant === "red";
  return (
    <div
      className={cn(
        "inline-flex items-center justify-center rounded-full px-5 py-2 font-serif font-bold tracking-tight",
        isRed ? "bg-iquine-red text-white" : "bg-white text-iquine-red",
        className,
      )}
    >
      <span className="text-lg">Iquine</span>
    </div>
  );
}
