
import React from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface DashboardActionButtonProps {
  icon: React.ReactNode;
  label: string;
  onClick: () => void;
  className?: string;
}

const DashboardActionButton: React.FC<DashboardActionButtonProps> = ({
  icon,
  label,
  onClick,
  className,
}) => {
  return (
    <Button
      variant="outline"
      className={cn(
        "flex flex-col items-center justify-center h-24 w-full gap-2 py-4 bg-card/50 hover:bg-card/80 border-accent/20",
        className
      )}
      onClick={onClick}
    >
      <div className="text-accent">{icon}</div>
      <span className="text-foreground">{label}</span>
    </Button>
  );
};

export default DashboardActionButton;
