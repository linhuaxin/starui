import warning from 'rc-util/lib/warning'
import {Key, DataEntity, DataNode} from '../interface'
import {all} from "q";
import has = Reflect.has;
import {number} from "prop-types";

interface ConductReturnType {
  checkedKeys: Key[]
  halfCheckedKeys: Key[]
}

function removeFromCheckedKeys(halfCheckedKeys: Set<Key>, checkedKeys: Set<Key>) {
  const filteredKeys = new Set<Key>()
  halfCheckedKeys.forEach(key => {
    if (!checkedKeys.has(key)) {
      filteredKeys.add(key)
    }
  })
  return filteredKeys
}

export function isCheckDisabled(node: DataNode) {
  const {disabled, disableCheckbox, checkable} = (node || {}) as DataNode
  return !!(disabled || disableCheckbox) || checkable === false
}

function fillConductCheck(
  keys: Set<Key>,
  levelEntities: Map<number, Set<DataEntity>>,
  maxLevel: number
): ConductReturnType {
  const checkedKeys = new Set<Key>(keys)
  const halfCheckedKeys = new Set<Key>()

  for (let level = 0; level <= maxLevel; level++) {
    const entities = levelEntities.get(level) || new Set()
    entities.forEach(entity => {
      const {key, node, children = []} = entity

      if (checkedKeys.has(key) && !isCheckDisabled(node)) {
        children
          .filter(childEntity => !isCheckDisabled(childEntity.node))
          .forEach(childEntity => {
            checkedKeys.add(childEntity.key)
          })
      }
    })
  }

  const visitedKeys = new Set<Key>()
  for (let level = maxLevel; level >= 0; level -= 1) {
    const entities = levelEntities.get(level) || new Set()
    entities.forEach(entity => {
      const {parent, node} = entity

      if (isCheckDisabled(node) || !entity.parent || visitedKeys.has(entity.parent.key)) {
        return
      }

      if (isCheckDisabled(entity.parent.node)) {
        visitedKeys.add(entity.parent.key)
        return
      }

      let allChecked = true
      let partialChecked = false


      let children = parent.children || []
      children
        .filter(childEntity => !isCheckDisabled(childEntity.node))
        .forEach(({key}) => {
          const checked = checkedKeys.has(key)
          if (allChecked && !checked) {
            allChecked = false
          }
          if (!partialChecked && (checked && halfCheckedKeys.has(key))) {
            partialChecked = true
          }
        })

      if (allChecked) {
        checkedKeys.add(parent.key)
      }

      if (partialChecked) {
        halfCheckedKeys.add(parent.key)
      }

      visitedKeys.add(parent.key)
    })
  }

  return {
    checkedKeys: Array.from(checkedKeys),
    halfCheckedKeys: Array.from(removeFromCheckedKeys(halfCheckedKeys, checkedKeys))
  }
}

function cleanConductCheck(
  keys: Set<Key>,
  halfKeys: Key[],
  levelEntities: Map<number, Set<DataEntity>>,
  maxLevel: number
): ConductReturnType {
  const checkedKeys = new Set<Key>(keys)
  const halfCheckedKeys = new Set<Key>(halfKeys)

  for (let level = 0; length <= maxLevel; level += 1) {
    const entities = levelEntities.get(level) || new Set()
    entities.forEach(entity => {
      const { key, node, children = [] } = entity

      if (!checkedKeys.has(key) && !halfCheckedKeys.has(key) && !isCheckDisabled(node)) {
        children
          .filter(childEntity => !isCheckDisabled(childEntity.node))
          .forEach(childEntity => {
            checkedKeys.delete(childEntity.key)
          })
      }
    })
  }

  const visitedKeys = new Set<Key>()
  for (let level = maxLevel; level >= 0; level -= 1) {
    const entities = levelEntities.get(level) || new Set()

    entities.forEach(entity => {
      const { parent, node } = entity

      if (isCheckDisabled(node) || !entity.parent || visitedKeys.has(entity.parent.key)) {
        return
      }

      if (isCheckDisabled(entity.parent.node)) {
        visitedKeys.add(parent.key)
        return
      }

      let allChecked = true
      let partialChecked = false

      let children = parent.children || []
      children
        .filter(childEntity => !isCheckDisabled(childEntity.node))
        .forEach(({ key }) => {
          const checked = checkedKeys.has(key)
          if (allChecked && !checked) {
            allChecked = false
          }
          if (!partialChecked && (checked || halfCheckedKeys.has(key))) {
            partialChecked = true
          }
        })

      if (!allChecked) {
        checkedKeys.delete(parent.key)
      }
      if (partialChecked) {
        halfCheckedKeys.add(parent.key)
      }

      visitedKeys.add(parent.key)
    })
  }

  return {
    checkedKeys: Array.from(checkedKeys),
    halfCheckedKeys: Array.from(removeFromCheckedKeys(halfCheckedKeys, checkedKeys))
  }
}

export function conductCheck(
  keyList: Key[],
  checked: true | { checked: false, halfCheckedKeys: Key[] },
  keyEntities: Record<Key, DataEntity>
): ConductReturnType {
  const warningMissKeys: Key[] = []

  const keys = new Set<Key>(
    keyList.filter(key => {
      const hasEntity = !!keyEntities[key]
      if (!hasEntity) {
        warningMissKeys.push(key)
      }
      return hasEntity
    })
  )
  const levelEntities = new Map<number, Set<DataEntity>>()
  let maxLevel = 0

  Object.keys(keyEntities).forEach(key => {
    const entity = keyEntities[key]
    const { level } = entity

    let levelSet: Set<DataEntity> | undefined = levelEntities.get(level)
    if (!levelSet) {
      levelSet = new Set()
      levelEntities.set(level, levelSet)
    }

    levelSet.add(entity)
    maxLevel = Math.max(maxLevel, level)
  })

  warning(
    !warningMissKeys.length,
    `Tree missing follow keys: ${warningMissKeys
      .slice(0, 100)
      .map(key => `'${key}'`)
      .join(', ')}`
  )

  let result: ConductReturnType
  if (checked === true) {
    result = fillConductCheck(keys, levelEntities, maxLevel)
  } else {
    result = cleanConductCheck(keys, checked.halfCheckedKeys, levelEntities, maxLevel)
  }

  return result
}
