import { Children, cloneElement, isValidElement, useState } from 'react';

/**
 * Sibling pills: solid fill follows hover/focus.
 * Fill is on the active button itself (no absolute thumb) — no measure bugs.
 * tone="inverse" = cream fill. Default = black fill. Hard colors for light/dark.
 */
export default function PillSwap({
  children,
  className = '',
  defaultActive = 0,
  tone = 'default',
  itemClassName = 'inline-flex items-center justify-center gap-2 rounded-full border px-6 py-3 text-sm font-medium transition',
}) {
  const [hover, setHover] = useState(null);

  const items = Children.toArray(children).filter(isValidElement);
  const allDisabled = items.length > 0 && items.every((c) => c.props.disabled);
  const activeIndex = allDisabled
    ? defaultActive
    : hover === null
      ? defaultActive
      : hover;

  const inverse = tone === 'inverse';
  const activeCls = inverse
    ? 'border-transparent bg-[#f4f1ea] text-[#0a0a0a] [&_svg]:text-[#0a0a0a] shadow-sm'
    : 'border-transparent bg-[#0a0a0a] text-[#f4f1ea] [&_svg]:text-[#f4f1ea] shadow-sm';
  const idleCls = inverse
    ? 'border-white/30 bg-transparent text-[#f4f1ea] [&_svg]:text-[#f4f1ea]/80 hover:border-white/55'
    : 'border-[var(--rw-line)] bg-transparent text-[var(--rw-ink)] [&_svg]:text-[var(--rw-muted)] hover:border-[var(--rw-ink)]/50';

  return (
    <div className={className} onMouseLeave={() => setHover(null)}>
      {items.map((child, i) => {
        const active = i === activeIndex;
        const merged = [itemClassName, active ? activeCls : idleCls, child.props.className]
          .filter(Boolean)
          .join(' ');

        return cloneElement(child, {
          key: child.key ?? i,
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
