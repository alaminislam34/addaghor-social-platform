import { cn } from "@/lib/utils"

export function EmptyState({ icon: Icon, title, description, action, className }) {
  return (
    <div className={cn("flex flex-col items-center justify-center py-12 text-center", className)}>
      {Icon && <Icon className="h-16 w-16 text-muted-foreground/50 mb-4" />}
      <h2 className="text-xl font-semibold mb-2">{title}</h2>
      {description && <p className="text-muted-foreground max-w-md mb-4">{description}</p>}
      {action}
    </div>
  )
}
