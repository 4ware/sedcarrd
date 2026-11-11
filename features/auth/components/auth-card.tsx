import type { ReactNode } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";

type AuthCardProps = {
  title: string;
  description: string;
  children: ReactNode;
  footer?: ReactNode;
};

export function AuthCard({ title, description, children, footer }: AuthCardProps) {
  return (
    <Card className="gap-6 py-8 shadow-xl shadow-black/5 ring-0">
      <CardHeader className="gap-2 px-8">
        <CardTitle>
          <h1 className="font-serif text-3xl font-semibold tracking-tight">{title}</h1>
        </CardTitle>
        <CardDescription className="text-base">{description}</CardDescription>
      </CardHeader>
      <CardContent className="px-8">{children}</CardContent>
      {footer ? <CardFooter className="justify-center border-t-0 bg-transparent px-8 pt-0">{footer}</CardFooter> : null}
    </Card>
  );
}
