import type { CSSProperties } from "react";
import type { HeadingConfig } from "@/lib/site-types";

export type MergedHeading = {
  eyebrow?: string;
  title?: string;
  subtitle?: string;
  showEyebrow: boolean;
  showTitle: boolean;
  showSubtitle: boolean;
  wrapperCls: string;
  wrapperStyle: CSSProperties;
  eyebrowStyle: CSSProperties;
  titleStyle: CSSProperties;
  subtitleStyle: CSSProperties;
};

export function mergeHeading(
  override: HeadingConfig | undefined,
  defaults: { eyebrow?: string; title?: string; subtitle?: string; align?: "left" | "center" | "right" },
): MergedHeading {
  const h = override || {};
  const eyebrow = (h.eyebrow ?? defaults.eyebrow) || undefined;
  const title = (h.title ?? defaults.title) || undefined;
  const subtitle = (h.subtitle ?? defaults.subtitle) || undefined;
  const align = h.textAlign || defaults.align || "center";
  const alignCls =
    align === "left" ? "text-left" : align === "right" ? "text-right ml-auto" : "text-center mx-auto";
  return {
    eyebrow,
    title,
    subtitle,
    showEyebrow: !!eyebrow,
    showTitle: h.showHeading !== false && !!title,
    showSubtitle: h.showSubtitle !== false && !!subtitle,
    wrapperCls: alignCls,
    wrapperStyle: { maxWidth: h.maxWidth || undefined },
    eyebrowStyle: {
      fontSize: h.eyebrowFontSize ? `${h.eyebrowFontSize}px` : undefined,
      color: h.eyebrowColor || undefined,
    },
    titleStyle: {
      fontSize: h.titleFontSize ? `${h.titleFontSize}px` : undefined,
      color: h.titleColor || undefined,
      fontWeight: (h.fontWeight as CSSProperties["fontWeight"]) || undefined,
    },
    subtitleStyle: {
      fontSize: h.subtitleFontSize ? `${h.subtitleFontSize}px` : undefined,
      color: h.subtitleColor || undefined,
    },
  };
}