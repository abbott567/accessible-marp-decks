/**
 * A small progressive-enhancement script inlined into every rendered deck.
 *
 * Code blocks are given `tabindex="0"` (+ role/label) at build time so they are
 * keyboard-scrollable even without JavaScript — the safe, backwards-compatible
 * default. This script then *removes* those attributes from any block that does
 * not actually overflow, so only genuinely scrollable code stays in the tab
 * order. Adapted from the author's blog-v2 (`c-code-block-scrolling`); the
 * scroll container here is `pre > code` rather than `pre`.
 */
export const codeScrollScript = `<script>
  (() => {
    "use strict";

    // A small tolerance avoids false positives from sub-pixel rounding.
    const OVERFLOW_TOLERANCE = 1;

    const isOverflowing = (el) => el.scrollWidth - el.clientWidth > OVERFLOW_TOLERANCE;

    const update = (code) => {
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

    const init = () => {
      const blocks = document.querySelectorAll("pre > code");

      if (!blocks.length) {
        return;
      }

      const updateAll = () => blocks.forEach(update);

      updateAll();

      // Re-evaluate whenever a block's size changes (font load, dynamic
      // content, the slide scaling, etc.). ResizeObserver batches for us.
      if ("ResizeObserver" in window) {
        const observer = new window.ResizeObserver((entries) => {
          entries.forEach((entry) => update(entry.target));
        });

        blocks.forEach((code) => observer.observe(code));
      }

      // Also re-evaluate on window resize, debounced to a single frame.
      let frame = null;
      window.addEventListener("resize", () => {
        if (frame !== null) {
          return;
        }

        frame = window.requestAnimationFrame(() => {
          frame = null;
          updateAll();
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
