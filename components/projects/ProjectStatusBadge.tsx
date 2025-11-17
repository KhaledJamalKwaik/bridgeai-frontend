import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

type ProjectStatus = "pending" | "approved" | "rejected" | "active" | "completed" | "archived";

interface ProjectStatusBadgeProps {
  status: ProjectStatus;
  className?: string;
}

const statusConfig: Record<ProjectStatus, { label: string; variant: any; icon: string }> = {
  pending: {
    label: "Pending Approval",
    variant: "outline",
    icon: "⏳",
  },
  approved: {
    label: "Approved",
    variant: "secondary",
    icon: "✓",
  },
  rejected: {
    label: "Rejected",
    variant: "destructive",
    icon: "✗",
  },
  active: {
    label: "Active",
    variant: "default",
    icon: "▶",
  },
  completed: {
    label: "Completed",
    variant: "secondary",
    icon: "✓✓",
  },
  archived: {
    label: "Archived",
    variant: "outline",
    icon: "📦",
  },
};

export function ProjectStatusBadge({ status, className }: ProjectStatusBadgeProps) {
  const config = statusConfig[status];

  return (
    <Badge variant={config.variant} className={cn("gap-1.5", className)}>
      <span>{config.icon}</span>
      <span>{config.label}</span>
    </Badge>
  );
}