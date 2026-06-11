import { cn } from "@/lib/utils";

interface SectionHeaderProps {
  title: string;
  description?: string;
  action?: React.ReactNode;
  className?: string;
}

export function SectionHeader({ title, description, action, className }: SectionHeaderProps) {
  return (
    <div className={cn("mb-4 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between", className)}>
      <div>
        <h2 className="text-lg font-bold text-foreground md:text-xl">{title}</h2>
        {description && (
          <p className="mt-1 text-sm text-muted-foreground md:text-base">{description}</p>
        )}
      </div>
      {action}
    </div>
  );
}
