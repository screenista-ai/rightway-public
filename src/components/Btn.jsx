/**
 * Site action button. Black fill follows pointer (hover/focus).
 * variant: "primary" | "ghost"
 */
export default function Btn({
  as: Comp = 'button',
  variant = 'primary',
  className = '',
  type = 'button',
  disabled,
  children,
  ...rest
}) {
  const base =
    'inline-flex items-center justify-center gap-1.5 rounded-full px-4 py-2 text-xs font-semibold transition border disabled:cursor-not-allowed disabled:opacity-40';
  const idle =
    variant === 'ghost'
      ? 'border-zinc-200 bg-white text-zinc-700'
      : 'border-zinc-900 bg-zinc-900 text-white';
  const hover =
    'hover:border-zinc-900 hover:bg-zinc-900 hover:text-white focus-visible:border-zinc-900 focus-visible:bg-zinc-900 focus-visible:text-white focus-visible:outline-none';

  const props = {
    className: `${base} ${idle} ${hover} ${className}`.trim(),
    disabled,
    ...rest,
  };
  if (Comp === 'button') props.type = type;
  return <Comp {...props}>{children}</Comp>;
}
