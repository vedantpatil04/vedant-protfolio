interface Orderable {
  id: string
  order: number
}

/**
 * Simple up/down reordering rather than drag-and-drop — Phase 8 spec
 * §33 prefers simple controls over an "overly complicated
 * drag-and-drop framework", and this stays keyboard-accessible for
 * free since it's just buttons.
 */
export function useReorder<T extends Orderable>(
  items: T[],
  update: (id: string, input: Partial<T>, options?: { silent?: boolean }) => Promise<T>,
  reload: () => void,
) {
  const moveItem = async (index: number, direction: -1 | 1) => {
    const targetIndex = index + direction
    if (targetIndex < 0 || targetIndex >= items.length) return
    const current = items[index]
    const target = items[targetIndex]

    await Promise.all([
      update(current.id, { order: target.order } as Partial<T>, { silent: true }),
      update(target.id, { order: current.order } as Partial<T>, { silent: true }),
    ])
    reload()
  }

  return { moveItem }
}
