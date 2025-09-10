import { formatDistanceToNow } from "date-fns";

export function timeAgo(date: string | number | Date): string {
  return formatDistanceToNow(new Date(date), { addSuffix: true });
}
