/* Blocks flagged "new". In the tree these show as a small dot after the
 * label (see .newDot); the config-drawer header shows the full pill instead,
 * where there's room and the emphasis is wanted. Single source of truth so
 * the tree dot and the drawer badge can never disagree about what's new. */
export const NEW_BLOCKS = ['bundle', 'promotion'];

export const isNewBlock = (id: string) => NEW_BLOCKS.includes(id);

/* "New" pill for the config-drawer header. */
export function NewBadge() {
  return (
    <span className="ml-1.5 inline-flex items-center rounded-full bg-[#eef2ff] px-1.5 py-1 align-middle text-[10px] font-medium text-[#4f46e5]">
      New
    </span>
  );
}
