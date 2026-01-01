import { cn } from "@/app/lib/utils";

type PanelProps = {
  children: React.ReactNode;
  className?: string;
};

export function Panel({ children, className }: PanelProps) {
  return (
    <div
      className={cn(
        `
        relative
        bg-bgSoft
        border
        border-divider
        `,
        className
      )}
    >
      {children}
    </div>
  );
}
