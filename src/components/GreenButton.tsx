import { Button } from "@/components/ui/button";
import { type ButtonProps } from "@/components/ui/button";

export function GreenButton({ className, ...props }: ButtonProps) {
  return (
    <Button
      className={`bg-[rgb(0,153,63)] hover:bg-[rgb(0,133,53)] text-white transition-colors duration-200 ${className || ""}`}
      {...props}
    />
  );
}

