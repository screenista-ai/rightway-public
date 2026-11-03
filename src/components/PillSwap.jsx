import { Children, cloneElement, isValidElement, useState } from 'react';

const ACTIVE =
  'border-zinc-900 bg-zinc-900 text-white [&_svg]:text-white';
const IDLE =
  'border-zinc-200 bg-white text-zinc-800 [&_svg]:text-zinc-500';

/**
 * Sibling pills: only one black fill. Idle = defaultActive. Hover/focus moves black
 * like Cancel | Save changes.
 */
export default function PillSwap({
  children,
  className = '',
  defaultActive = 0,
  itemClassName = 'inline-flex items-center justify-center gap-2 rounded-full border px-6 py-3 text-sm font-medium transition',
}) {
  const [hover, setHover] = useState(null);
  const items = Children.toArray(children).filter(isValidElement);
  const allDisabled = items.length > 0 && items.every((c) => c.props.disabled);

  return (
    <div className={className} onMouseLeave={() => setHover(null)}>
      {items.map((child, i) => {
        const active = allDisabled
          ? i === defaultActive
          : hover === i || (hover === null && i === defaultActive);
        const merged = [itemClassName, active ? ACTIVE : IDLE, child.props.className]
          .filter(Boolean)
          .join(' ');

        return cloneElement(child, {
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
