/**
 * Buy Stock button tokens — extracted from Figma nodes 26:740, 33:92, 53:410, 63:268.
 */

export const BUTTON_TOKENS = {
  height: 40,
  paddingX: 16,
  paddingY: 10,
  borderRadius: 100,
  borderWidth: 2,
  borderColor: "#1f5fe0",
  backgroundColor: "#1f5fe0",
  fontSize: 16,
  fontWeight: 600,
  lineHeight: 22,
  letterSpacing: -0.16,
  textColor: "#ffffff",
  /** Enabled resting state — Figma 33:92 */
  insetShadowDefault: "inset 0px 0px 1px 3px rgba(255,255,255,0.24)",
  /** Hover state — Figma 53:410, 63:268 */
  insetShadowHover: "inset 0px 0px 1px 4px rgba(255,255,255,0.32)",
  /** Hover background — Figma loading flow button spec */
  backgroundColorHover: "#1f4aae",
  hoverTransitionDuration: 0.18,
  /** Disabled hidden state — Figma 26:740 */
  disabledOpacity: 0,
} as const;
