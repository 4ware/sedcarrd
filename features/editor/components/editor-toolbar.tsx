"use client";

import { ExternalLinkIcon, LayoutDashboardIcon, PaletteIcon, PencilIcon } from "lucide-react";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Link } from "@/i18n/navigation";

/** Floating menu at the top right, replacing the dashboard sidebar on the editor page. */
type EditorToolbarProps = {
  onEdit: (trigger: HTMLButtonElement) => void;
  onTheme: (trigger: HTMLButtonElement) => void;
  /** The person's slug: links to their public page. */
  slug: string;
};

export function EditorToolbar({ onEdit, onTheme, slug }: EditorToolbarProps) {
  const t = useTranslations("Editor.toolbar");

  return (
    <TooltipProvider delayDuration={300}>
      <nav
        aria-label={t("label")}
        className="fixed top-4 right-4 z-40 flex items-center gap-1 rounded-xl bg-foreground p-1.5 text-background shadow-lg ring-1 ring-white/15"
      >
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              type="button"
              variant="ghost"
              size="icon-lg"
              onClick={(event) => onEdit(event.currentTarget)}
              aria-label={t("edit")}
              className="hover:bg-background/15 hover:text-background"
            >
              <PencilIcon />
            </Button>
          </TooltipTrigger>
          <TooltipContent side="bottom">{t("edit")}</TooltipContent>
        </Tooltip>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              type="button"
              variant="ghost"
              size="icon-lg"
              onClick={(event) => onTheme(event.currentTarget)}
              aria-label={t("theme")}
              className="hover:bg-background/15 hover:text-background"
            >
              <PaletteIcon />
            </Button>
          </TooltipTrigger>
          <TooltipContent side="bottom">{t("theme")}</TooltipContent>
        </Tooltip>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button asChild variant="ghost" size="icon-lg" className="hover:bg-background/15 hover:text-background">
              <Link href={`/people/${slug}`} target="_blank" aria-label={t("publicPage")}>
                <ExternalLinkIcon />
              </Link>
            </Button>
          </TooltipTrigger>
          <TooltipContent side="bottom">{t("publicPage")}</TooltipContent>
        </Tooltip>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              asChild
              variant="ghost"
              size="icon-lg"
              className="hover:bg-background/15 hover:text-background"
            >
              <Link href="/dashboard" aria-label={t("dashboard")}>
                <LayoutDashboardIcon />
              </Link>
            </Button>
          </TooltipTrigger>
          <TooltipContent side="bottom">{t("dashboard")}</TooltipContent>
        </Tooltip>
      </nav>
    </TooltipProvider>
  );
}
