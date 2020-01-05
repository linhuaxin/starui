import React from 'react'
import { DataEntity, Key, NodeInstance, TreeProps } from './interface'

const DRAG_SIDE_RANGE = 0.25
const DRAG_MIN_GAP = 2

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

export function getDragNodesKeys(dragNodeKey: Key, keyEntities: Record<Key, DataEntity>): Key[] {
  const dragNodesKeys = [dragNodeKey]

  const entity = keyEntities[dragNodeKey]
  function dig(list: DataEntity[] = []) {
    list.forEach(({ key, children }) => {
      dragNodesKeys.push(key)
      dig(children)
    })
  }

  dig(entity.children)

  return dragNodesKeys
}

export function calcDropPosition(event: React.MouseEvent, treeNode: NodeInstance) {
  const { clientY } = event
  const { top, bottom, height } = treeNode.selectHandle.getBoundingClientRect()
  const des = Math.max(height * DRAG_SIDE_RANGE, DRAG_MIN_GAP)

  if (clientY <= top + des) {
    return -1
  }
  if (clientY >= bottom - des) {
    return 1
  }

  return 0
}

export function calcSelectedKeys(selectedKeys: Key[], props: TreeProps) {
  if (!selectedKeys) return undefined

  const { multiple } = props
  if (multiple) {
    return selectedKeys.slice()
  }

  if (selectedKeys.length) {
    return [selectedKeys[0]]
  }
  return selectedKeys
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

export function posToArr(pos: string) {
  return pos.split('-');
}
