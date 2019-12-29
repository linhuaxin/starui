import { DataEntity, Key } from './interface'

export function arrAdd(list: Key[], value: Key) {
  const clone = list.slice()

  if (clone.indexOf(value) === -1) {
    clone.push(value)
  }
  return clone
}

export function arrDel(list: Key[], value: Key) {
  const clone = list.slice()
  const index = clone.indexOf(value)

  if (index >= 0) {
    clone.splice(index, 1)
  }
  return clone
}

export function conductExpandParent(keyList: Key[], keyEntities: Record<Key, DataEntity>) {
  const expandedKeys = {}

  function conductUp(key: Key) {
    if (expandedKeys[key]) return

    const entity = keyEntities[key]
    if (!entity) return

    expandedKeys[key] = true

    const { parent, node } = entity

    if (node.disabled) return

    if (parent) {
      conductUp(parent.key)
    }
  }

  (keyList || []).forEach(key => {
    conductUp(key)
  })

  return Object.keys(expandedKeys)
}
