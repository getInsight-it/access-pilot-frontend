import { CheckCircle } from "lucide-react";

export type StatusCardTone = "success" | "primary" | "violet" | "danger";

export interface StatusCardData {
  label: string;
  value: number;
  icon: typeof CheckCircle;
  tone: StatusCardTone;
}
