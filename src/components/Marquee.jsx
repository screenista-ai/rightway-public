import React from 'react';

/**
 * Infinite horizontal marquee (Webflow / Goat Fuel style).
 * Duplicate track for seamless loop. Pure CSS — no extra deps.
 */
export default function Marquee({
  items = [],
  speed = 40,
  reverse = false,
  className = '',
  itemClassName = '',
  separator = '·',
}) {
  const list = items.filter(Boolean);
  if (!list.length) return null;
  const doubled = [...list, ...list];

  return (
    <div className={`rw-marquee ${className}`} aria-hidden="true">
      <div
        className={`rw-marquee__track ${reverse ? 'rw-marquee__track--reverse' : ''}`}
        style={{ '--rw-marquee-duration': `${speed}s` }}
      >
        {doubled.map((item, i) => (
          <span key={`${item}-${i}`} className={`rw-marquee__item ${itemClassName}`}>
            <span>{item}</span>
            {separator ? <span className="rw-marquee__sep">{separator}</span> : null}
          </span>
        ))}
      </div>
    </div>
  );
}
