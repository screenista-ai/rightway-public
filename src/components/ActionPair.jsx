import PillSwap from './PillSwap.jsx';

/**
 * Cancel | primary pair. Black fill follows the hovered button.
 */
export default function ActionPair({
  cancelLabel = 'Cancel',
  saveLabel = 'Save changes',
  onCancel,
  onSave,
  saving = false,
  dirty = true,
  saveType = 'submit',
}) {
  const disabled = saving || !dirty;

  return (
    <PillSwap
      className="flex flex-wrap items-center gap-2 pt-1"
      defaultActive={1}
      itemClassName="rounded-full border px-4 py-2 text-xs font-semibold transition disabled:cursor-not-allowed disabled:opacity-40"
    >
      <button type="button" onClick={onCancel} disabled={disabled}>
        {cancelLabel}
      </button>
      <button type={saveType} onClick={onSave} disabled={disabled}>
        {saving ? 'Saving…' : saveLabel}
      </button>
    </PillSwap>
  );
}
