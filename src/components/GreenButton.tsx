import * as React from "react";
import { Button } from "@/components/ui/button";
import { type VariantProps } from "class-variance-authority";
import { buttonVariants } from "@/components/ui/button";

type GreenButtonProps = React.ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean;
  };

export function GreenButton({ className, ...props }: GreenButtonProps) {
  return (
    <Button
      className={`bg-[rgb(0,153,63)] hover:bg-[rgb(0,133,53)] text-white transition-colors duration-200 ${
        className || ""
      }`}
      {...props}
    />
  );
}
