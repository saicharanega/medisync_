import { cn } from "@/lib/utils";

const variants = {
  confirmed: "bg-emerald-50 text-emerald-700 border-emerald-200",
  pending: "bg-amber-50 text-amber-700 border-amber-200",
  cancelled: "bg-red-50 text-red-700 border-red-200",
  completed: "bg-blue-50 text-blue-700 border-blue-200",
  paid: "bg-emerald-50 text-emerald-700 border-emerald-200",
  refunded: "bg-muted text-muted-foreground border-border"
};

export default function StatusBadge({ status }) {
  return (
    <span className={cn("inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border capitalize", variants[status] || "bg-muted text-muted-foreground")}>
      {status}
    </span>);

}