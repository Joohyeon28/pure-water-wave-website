import { Badge } from "@/components/ui/badge";
import { LINE_KIND_LABELS } from "@/lib/line-kind";
import type { LineKind } from "@/lib/line-kind";

const variants: Record<LineKind, "default" | "secondary" | "outline"> = {
  refill: "secondary",
  bottled: "outline",
  contract: "default",
};

const LineKindBadge = ({ kind }: { kind: LineKind }) => (
  <Badge variant={variants[kind]} className="shrink-0 text-[10px] leading-none">
    {LINE_KIND_LABELS[kind]}
  </Badge>
);

export default LineKindBadge;
