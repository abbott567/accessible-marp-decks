/**
 * The single progressive-enhancement script inlined into every rendered deck
 * (unless `runtimeScript` is disabled). It does two things:
 *
 *  1. Uniform scaling — sets `--slide-scale` on each `div.marpit` to
 *     (container width / 1280) so the CSS `zoom` magnifies each fixed-size slide
 *     as one rigid unit. Re-run on resize. Without it, slides render at their
 *     full 1280px design size (the no-JS fallback).
 *
 *  2. Code-block focus — code blocks ship with `tabindex="0"` (+ role/label) so
 *     they are keyboard-scrollable even without JS. This removes those from any
 *     block that doesn't actually overflow, so only scrollable code stays in the
 *     tab order. Adapted from the author's blog-v2 (`c-code-block-scrolling`).
 */
export const pageScript = `<script>
  (() => {
    "use strict";

    const DESIGN_WIDTH = 1280;
    const OVERFLOW_TOLERANCE = 1;

    // --- 1. Uniform whole-slide scaling ---------------------------------
    // Fit-to-width alone would cancel browser zoom (Cmd/Ctrl and +): zooming
    // shrinks the viewport in CSS pixels, so a purely width-derived scale
    // re-fits and the text never gets bigger. Desktop page zoom shows up as a
    // devicePixelRatio change, so we multiply the fit scale by the zoom factor
    // since load — zooming then magnifies the deck (with scrollbars), as
    // WCAG 1.4.4 expects. Known trade-off: dragging the window to a display
    // with a different pixel density reads as a zoom until the next reload.
    const baseDPR = window.devicePixelRatio || 1;
    const decks = document.querySelectorAll("div.marpit");
    const scale = (deck) => {
      const zoomFactor = (window.devicePixelRatio || 1) / baseDPR;
      const fit = deck.clientWidth / DESIGN_WIDTH;
      deck.style.setProperty("--slide-scale", fit * zoomFactor);
    };
    const scaleAll = () => decks.forEach(scale);

    // --- 2. Focus only genuinely scrollable code blocks -----------------
    const isOverflowing = (el) => el.scrollWidth - el.clientWidth > OVERFLOW_TOLERANCE;
    const updateCode = (code) => {
      if (isOverflowing(code)) {
        if (!code.hasAttribute("tabindex")) {
          code.setAttribute("tabindex", "0");
          code.setAttribute("role", "region");
          code.setAttribute("aria-label", "Code block, scrollable");
        }
      } else if (code.getAttribute("tabindex") === "0") {
        code.removeAttribute("tabindex");
        code.removeAttribute("role");
        code.removeAttribute("aria-label");
      }
    };
    const blocks = document.querySelectorAll("pre > code");
    const updateAllCode = () => blocks.forEach(updateCode);

    const refresh = () => {
      scaleAll();
      updateAllCode();
    };

    const init = () => {
      refresh();

      // React to size changes (font load, dynamic content, the slide zoom).
      if ("ResizeObserver" in window) {
        const observer = new window.ResizeObserver(() => refresh());
        decks.forEach((deck) => observer.observe(deck));
      }

      // Re-evaluate on window resize, debounced to one call per frame.
      let frame = null;
      window.addEventListener("resize", () => {
        if (frame !== null) {
          return;
        }

        frame = window.requestAnimationFrame(() => {
          frame = null;
          refresh();
        });
      });
    };

    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", init);
    } else {
      init();
    }
  })();
</script>`
