import { useEffect, useId, useLayoutEffect, useRef, useState } from "react";
import { motion, useReducedMotion } from "motion/react";

export type FaqCardItem = { question: string; answer: string };
const TILTS = [-1.5, 1.2, 1, -1.2, -1, 1.4, -1.2, 1];
const GAP = 24;
type Size = { closed: number; extra: number };
type Placement = { x: number; y: number; column: number };

// Balance the WHOLE set, not just cards after the expanded question.
// Keep the original alternating order unless a move improves the balance.
function arrange(heights: number[], width: number, desktop: boolean, opened: number | null = null) {
  const count = heights.length;
  const cardWidth = desktop ? (width - 28) / 2 : width;
  let columns = heights.map((_, i) => (desktop ? i % 2 : 0));
  if (desktop && count > 1) {
    const score = (assignment: number[]) => {
      const totals = [0, 0];
      let moveCost = 0;
      assignment.forEach((column, i) => {
        totals[column] += heights[i] + GAP;
        if (column !== i % 2) moveCost += 24 + i * 12;
      });
      // A small move penalty avoids unnecessary reshuffling for tiny differences.
      return Math.abs(totals[0] - totals[1]) + moveCost;
    };
    let best = score(columns);
    // IGNITE has eight questions. Exact search is bounded for larger FAQ lists.
    if (count <= 14) {
      for (let mask = 1; mask < 2 ** (count - 1); mask += 1) {
        const candidate = heights.map((_, i) => (i === 0 ? 0 : (mask >> (i - 1)) & 1));
        if (opened !== null && candidate[opened] !== opened % 2) continue;
        const next = score(candidate);
        if (next < best - 0.5) {
          best = next;
          columns = candidate;
        }
      }
    } else {
      // Greedy improvement can move earlier cards too, without exponential work.
      for (let pass = 0; pass < count; pass += 1) {
        let changed = false;
        for (let i = 1; i < count; i += 1) {
          if (i === opened) continue;
          const candidate = [...columns];
          candidate[i] = 1 - candidate[i];
          const next = score(candidate);
          if (next < best - 0.5) {
            columns = candidate;
            best = next;
            changed = true;
          }
        }
        if (!changed) break;
      }
    }
  }
  const bottoms = [0, 0];
  const positions: Placement[] = heights.map((height, i) => {
    const column = columns[i];
    const position = { column, x: column * (cardWidth + 28), y: bottoms[column] };
    bottoms[column] += height + (desktop ? GAP : 20);
    return position;
  });
  return { positions, cardWidth, height: Math.max(0, ...bottoms) - (count ? (desktop ? GAP : 20) : 0) };
}

export const FaqCards = ({ items }: { items: FaqCardItem[] }) => {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const [shown, setShown] = useState(false);
  const [width, setWidth] = useState(0);
  const [desktop, setDesktop] = useState(false);
  const [sizes, setSizes] = useState<Size[]>([]);
  const rootRef = useRef<HTMLDivElement>(null);
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);
  const buttonRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const answerRefs = useRef<(HTMLDivElement | null)[]>([]);
  const reduceMotion = useReducedMotion();
  const id = useId();

  useLayoutEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    const media = window.matchMedia("(min-width: 768px)");
    const update = () => {
      setWidth(root.clientWidth);
      setDesktop(media.matches);
    };
    update();
    const observer = new ResizeObserver(update);
    observer.observe(root);
    media.addEventListener("change", update);
    return () => {
      observer.disconnect();
      media.removeEventListener("change", update);
    };
  }, []);

  useLayoutEffect(() => {
    if (!width) return;
    const measure = () => {
      const next = items.map((_, i) => {
        const card = cardRefs.current[i];
        const button = buttonRefs.current[i];
        const answer = answerRefs.current[i];
        if (!card || !button || !answer) return { closed: 110, extra: 0 };
        const css = getComputedStyle(card);
        const closed = button.offsetHeight + parseFloat(css.paddingTop) +
          parseFloat(css.paddingBottom) + parseFloat(css.borderTopWidth) + parseFloat(css.borderBottomWidth);
        return { closed, extra: answer.offsetHeight };
      });
      setSizes((old) => old.length === next.length && old.every((s, i) =>
        Math.abs(s.closed - next[i].closed) < 0.5 && Math.abs(s.extra - next[i].extra) < 0.5
      ) ? old : next);
    };
    measure();
    const observer = new ResizeObserver(measure);
    buttonRefs.current.forEach((el) => { if (el) observer.observe(el); });
    answerRefs.current.forEach((el) => { if (el) observer.observe(el); });
    // Font loading also changes line wrapping; the observer remeasures it.
    return () => observer.disconnect();
  }, [width, desktop, items]);

  useEffect(() => {
    if (reduceMotion) { setShown(true); return; }
    const root = rootRef.current;
    if (!root) return;
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) { setShown(true); observer.disconnect(); }
    }, { threshold: 0.05 });
    observer.observe(root);
    return () => observer.disconnect();
  }, [reduceMotion]);

  const ready = width > 0 && sizes.length === items.length;
  const heights = items.map((_, i) => (sizes[i]?.closed ?? 110) +
    (openIndex === i ? sizes[i]?.extra ?? 0 : 0));
  const layout = arrange(heights, width, desktop, openIndex);
  // Reserve the tallest possible single-open desktop layout up front.
  // This keeps the section/footer height and page scroll position stable.
  let reservedHeight = layout.height;
  if (desktop && ready) {
    reservedHeight = Math.max(reservedHeight, ...items.map((_, opened) =>
      arrange(sizes.map((size, i) => size.closed + (i === opened ? size.extra : 0)), width, true, opened).height
    ));
  }
  const transition = reduceMotion ? { duration: 0 } :
    { type: "spring" as const, stiffness: 230, damping: 30, mass: 0.8 };

  return (
    <div ref={rootRef} className="relative w-full [overflow-anchor:none]"
      style={{ height: ready ? Math.max(0, reservedHeight) : undefined }}>
      {items.map((item, i) => {
        const open = openIndex === i;
        const position = layout.positions[i];
        return (
          <motion.div key={`${i}:${item.question}`} initial={false}
            animate={{ x: position.x, y: position.y }} transition={transition}
            className={width ? "absolute left-0 top-0" : "relative mb-5"}
            style={{ width: width ? layout.cardWidth : "100%", visibility: ready ? "visible" : "hidden", zIndex: open ? 4 : position.column !== (desktop ? i % 2 : 0) ? 3 : 1 }}>
            {/* The same DOM node slides between columns; nothing remounts. */}
            <motion.div initial={false} animate={{ opacity: shown ? 1 : 0, y: shown ? 0 : 20 }}
              transition={reduceMotion ? { duration: 0 } : { duration: 0.35 }}>
              <div ref={(el) => { cardRefs.current[i] = el; }}
                style={{ ["--tilt" as string]: `${TILTS[i % TILTS.length]}deg` }}
                className={`group rounded-[32px] border border-stone-200/80 bg-white/95 p-6 text-[#141412] md:p-7 hover:border-[#3f6212]/35 shadow-[0_8px_28px_-12px_rgba(20,20,18,0.12)] transition-[transform,box-shadow,border-color] duration-300 ease-out motion-reduce:transition-none motion-reduce:[transform:none] ${open ? "[transform:rotate(0deg)] shadow-[0_20px_44px_-16px_rgba(20,20,18,0.22)] ring-2 ring-[#3f6212]/20" : "[transform:rotate(var(--tilt))] hover:[transform:rotate(0deg)_scale(1.015)]"}`}>
                <button ref={(el) => { buttonRefs.current[i] = el; }} type="button"
                  id={`${id}-question-${i}`} aria-controls={`${id}-answer-${i}`} aria-expanded={open}
                  onClick={() => setOpenIndex(open ? null : i)}
                  className="flex w-full cursor-pointer items-center justify-between gap-4 rounded-2xl text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-[#3f6212] focus-visible:ring-offset-2">
                  <span className="text-[17px] font-bold leading-snug text-[#141412] transition-colors group-hover:text-black md:text-[18px]">{item.question}</span>
                  <span className={`grid h-11 w-11 shrink-0 place-items-center rounded-full transition-[transform,background-color,color] duration-300 motion-reduce:transition-none ${open ? "rotate-180 bg-[#3f6212] text-white" : "bg-[#3f6212]/10 text-[#3f6212] group-hover:bg-[#3f6212]/20"}`}>
                    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="m6 9 6 6 6-6" /></svg>
                  </span>
                </button>
                <motion.div initial={false} id={`${id}-answer-${i}`} role="region"
                  aria-labelledby={`${id}-question-${i}`} aria-hidden={!open}
                  animate={{ height: open ? sizes[i]?.extra ?? 0 : 0, opacity: open ? 1 : 0 }}
                  transition={transition} className="overflow-hidden">
                  <div ref={(el) => { answerRefs.current[i] = el; }} className="pt-4">
                    <div className="border-t border-stone-200/60 pt-3">
                      <p className="whitespace-pre-line font-dm_sans text-[15px] leading-relaxed text-stone-700 md:text-[16px]">{item.answer}</p>
                    </div>
                  </div>
                </motion.div>
              </div>
            </motion.div>
          </motion.div>
        );
      })}
    </div>
  );
};
export default FaqCards;