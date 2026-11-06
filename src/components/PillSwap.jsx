import {
  Children,
  cloneElement,
  isValidElement,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from 'react';

/**
 * Sibling pills: solid fill follows hover/focus like Cancel | Save.
 * Sliding thumb tracks the active pill.
 * tone="inverse" = cream fill on dark hero. Default = ink fill on paper.
 */
export default function PillSwap({
  children,
  className = '',
  defaultActive = 0,
  tone = 'default',
  itemClassName = 'inline-flex items-center justify-center gap-2 rounded-full border px-6 py-3 text-sm font-medium transition',
}) {
  const [hover, setHover] = useState(null);
  const rootRef = useRef(null);
  const itemRefs = useRef([]);
  const [thumb, setThumb] = useState({ left: 0, top: 0, width: 0, height: 0, ready: false });

  const items = Children.toArray(children).filter(isValidElement);
  const allDisabled = items.length > 0 && items.every((c) => c.props.disabled);
  const activeIndex = allDisabled
    ? defaultActive
    : hover === null
      ? defaultActive
      : hover;

  const inverse = tone === 'inverse';
  const thumbBg = inverse ? '#f4f1ea' : 'var(--rw-ink)';

  function measure() {
    const root = rootRef.current;
    const el = itemRefs.current[activeIndex];
    if (!root || !el) return;
    const rr = root.getBoundingClientRect();
    const ir = el.getBoundingClientRect();
    setThumb({
      left: ir.left - rr.left,
      top: ir.top - rr.top,
      width: ir.width,
      height: ir.height,
      ready: true,
    });
  }

  useLayoutEffect(() => {
    measure();
  }, [activeIndex, items.length, tone]);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return undefined;
    const ro = typeof ResizeObserver !== 'undefined' ? new ResizeObserver(measure) : null;
    ro?.observe(root);
    window.addEventListener('resize', measure);
    return () => {
      ro?.disconnect();
      window.removeEventListener('resize', measure);
    };
  }, [activeIndex, items.length, tone]);

  return (
    <div
      ref={rootRef}
      className={`relative ${className}`}
      onMouseLeave={() => setHover(null)}
    >
      <span
        aria-hidden
        className="pointer-events-none absolute z-0 rounded-full shadow-sm transition-[transform,width,height,opacity] duration-300 ease-[cubic-bezier(0.16,1,0.3,1)]"
        style={{
          background: thumbBg,
          width: thumb.width,
          height: thumb.height,
          transform: `translate(${thumb.left}px, ${thumb.top}px)`,
          opacity: thumb.ready ? 1 : 0,
        }}
      />
      {items.map((child, i) => {
        const active = i === activeIndex;
        const activeText = inverse
          ? 'border-transparent text-[#0a0a0a] [&_svg]:text-[#0a0a0a]'
          : 'border-transparent text-[var(--rw-paper)] [&_svg]:text-[var(--rw-paper)]';
        const idleText = inverse
          ? 'border-white/30 bg-transparent text-[#f4f1ea] [&_svg]:text-[#f4f1ea]/80 hover:border-white/55'
          : 'border-[var(--rw-line)] bg-transparent text-[var(--rw-ink)] [&_svg]:text-[var(--rw-muted)] hover:border-[var(--rw-ink)]/40';

        const merged = ['relative z-10', itemClassName, active ? activeText : idleText, child.props.className]
          .filter(Boolean)
          .join(' ');

        return cloneElement(child, {
          key: child.key ?? i,
          ref: (node) => {
            itemRefs.current[i] = node;
            const r = child.ref;
            if (typeof r === 'function') r(node);
            else if (r && typeof r === 'object') r.current = node;
          },
          className: merged,
          onMouseEnter: (e) => {
            if (!child.props.disabled) setHover(i);
            child.props.onMouseEnter?.(e);
          },
          onFocus: (e) => {
            if (!child.props.disabled) setHover(i);
            child.props.onFocus?.(e);
          },
          onBlur: (e) => {
            setHover(null);
            child.props.onBlur?.(e);
          },
        });
      })}
    </div>
  );
}
