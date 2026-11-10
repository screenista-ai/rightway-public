import { useEffect, useRef } from 'react';

/**
 * Horizontal strip: no native scrollbar. Mouse wheel / trackpad scrolls sideways.
 */
export default function HorizScroll({
  children,
  className = '',
  fade = true,
  ...rest
}) {
  const ref = useRef(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return undefined;

    function onWheel(e) {
      if (el.scrollWidth <= el.clientWidth + 1) return;
      const mostlyVertical = Math.abs(e.deltaY) >= Math.abs(e.deltaX);
      if (!mostlyVertical) return;
      el.scrollLeft += e.deltaY;
      e.preventDefault();
    }

    el.addEventListener('wheel', onWheel, { passive: false });
    return () => el.removeEventListener('wheel', onWheel);
  }, []);

  return (
    <div
      ref={ref}
      className={`rw-hscroll ${fade ? 'rw-hscroll-fade' : ''} ${className}`}
      {...rest}
    >
      {children}
    </div>
  );
}
