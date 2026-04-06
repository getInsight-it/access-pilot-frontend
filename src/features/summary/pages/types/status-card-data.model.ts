import { Users } from "lucide-react";

export type SummaryCardTone = "success" | "warning" | "primary";

export interface SummaryCardData {
  title: string;
  description: string;
  value: number;
  icon: typeof Users;
  tone: SummaryCardTone;
}
