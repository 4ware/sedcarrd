import { CircleAlertIcon } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

/** Form-level error message; renders nothing without a message. */
export function FormError({ message }: { message?: string | null }) {
  if (!message) return null;

  return (
    <Alert variant="destructive">
      <CircleAlertIcon />
      <AlertDescription>{message}</AlertDescription>
    </Alert>
  );
}
