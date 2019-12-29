import warning from 'rc-util/lib/warning'
import {
  DataEntity,
  DataNode,
  EventDataNode,
  FlattenNode, Key,
  TreeNodeProps, TreeNodeRequiredProps, Wrapper
} from '../interface'

export function flattenTreeData(
  treeNodeList: DataNode[] = [],
  expandedKeys: Key[] | true = [],
): FlattenNode[] {
  const flattenList: FlattenNode[] = []

  function dig(list: DataNode[], parent: FlattenNode = null): FlattenNode[] {
    return list.map((treeNode, index) => {
      const pos: string = getPosition(parent ? parent.pos : '0', index)
      const mergedKey = getKey(treeNode.key, pos)

      // Add FlattenDataNode into list
      const flattenNode: FlattenNode = {
        ...treeNode,
        parent,
        pos,
        children: null,
        data: treeNode,
        isStart: [...(parent ? parent.isStart : []), index === 0],
        isEnd: [...(parent ? parent.isEnd : []), index === list.length - 1],
      }

      flattenList.push(flattenNode)

      // Loop treeNode children
      if (expandedKeys === true || expandedKeys.includes(mergedKey)) {
        flattenNode.children = dig(treeNode.children || [], flattenNode)
      } else {
        flattenNode.children = []
      }

      return flattenNode
    })
  }

  dig(treeNodeList)
  return flattenList
}

export function convertNodePropsToEventData(props: TreeNodeProps): EventDataNode {
  const {
    data,
    expanded,
    selected,
    checked,
    loaded,
    loading,
    halfChecked,
    dragOver,
    dragOverGapTop,
    dragOverGapBottom,
    pos,
    active
  } = props

  const eventData = {
    ...data,
    expanded,
    selected,
    checked,
    loaded,
    loading,
    halfChecked,
    dragOver,
    dragOverGapTop,
    dragOverGapBottom,
    pos,
    active
  }

  if (!('props' in eventData)) {
    Object.defineProperty(eventData, 'props', {
      get() {
        warning(
          false,
          'Second param return from event is node data instead of TreeNode instance. Please read value directly instead of reading from `props`.'
        )
        return props
      },
    })
  }

  return eventData
}

export function getKey(key: Key, pos: string) {
  if (key !== null && key !== undefined) {
    return key
  }
  return pos
}

export function getPosition(level: string | number, index: number) {
  return `${level}-${index}`
}

export function traverseDataNodes(
  dataNodes: DataNode[],
  callback: (data: {
    node: DataNode
    index: number
    pos: string
    key: Key
    parentPos: string | number
    level: number
  }) => void,
) {
  function processNode(
    node: DataNode,
    index?: number,
    parent?: { node: DataNode; pos: string; level: number },
  ) {
    const children = node ? node.children : dataNodes
    const pos = node ? getPosition(parent.pos, index) : '0'

    // Process node if is not root
    if (node) {
      const data = {
        node,
        index,
        pos,
        key: node.key !== null ? node.key : pos,
        parentPos: parent.node ? parent.pos : null,
        level: parent.level + 1,
      }

      callback(data)
    }

    // Process children node
    if (children) {
      children.forEach((subNode, subIndex) => {
        processNode(subNode, subIndex, { node, pos, level: parent ? parent.level + 1 : -1 })
      })
    }
  }

  processNode(null)
}

export function convertDataToEntities(
  dataNodes: DataNode[],
  {
    initWrapper,
    processEntity,
    onProcessFinished,
  }: {
    initWrapper?: (wrapper: Wrapper) => Wrapper
    processEntity?: (entity: DataEntity, wrapper: Wrapper) => void
    onProcessFinished?: (wrapper: Wrapper) => void
  } = {},
) {
  const posEntities = {}
  const keyEntities = {}
  let wrapper = {
    posEntities,
    keyEntities,
  }

  if (initWrapper) {
    wrapper = initWrapper(wrapper) || wrapper
  }

  traverseDataNodes(dataNodes, item => {
    const { node, index, pos, key, parentPos, level } = item
    const entity: DataEntity = { node, index, key, pos, level }

    const mergedKey = getKey(key, pos)

    posEntities[pos] = entity
    keyEntities[mergedKey] = entity

    // Fill children
    entity.parent = posEntities[parentPos]
    if (entity.parent) {
      entity.parent.children = entity.parent.children || []
      entity.parent.children.push(entity)
    }

    if (processEntity) {
      processEntity(entity, wrapper)
    }
  })

  if (onProcessFinished) {
    onProcessFinished(wrapper)
  }

  return wrapper
}

export function getTreeNodeProps(
  key: Key,
  {
    expandedKeys,
    selectedKeys,
    loadedKeys,
    loadingKeys,
    checkedKeys,
    halfCheckedKeys,
    dragOverNodeKey,
    dropPosition,
    keyEntities,
  }: TreeNodeRequiredProps,
) {
  const entity = keyEntities[key]

  const treeNodeProps = {
    eventKey: key,
    expanded: expandedKeys.indexOf(key) !== -1,
    selected: selectedKeys.indexOf(key) !== -1,
    loaded: loadedKeys.indexOf(key) !== -1,
    loading: loadingKeys.indexOf(key) !== -1,
    checked: checkedKeys.indexOf(key) !== -1,
    halfChecked: halfCheckedKeys.indexOf(key) !== -1,
    pos: String(entity ? entity.pos : ''),

    // [Legacy] Drag props
    dragOver: dragOverNodeKey === key && dropPosition === 0,
    dragOverGapTop: dragOverNodeKey === key && dropPosition === -1,
    dragOverGapBottom: dragOverNodeKey === key && dropPosition === 1,
  }

  return treeNodeProps
}

export function parseCheckedKeys(keys: Key[] | { checked: Key[]; halfChecked: Key[] }) {
  if (!keys) {
    return null
  }

  // Convert keys to object format
  let keyProps
  if (Array.isArray(keys)) {
    // [Legacy] Follow the api doc
    keyProps = {
      checkedKeys: keys,
      halfCheckedKeys: undefined,
    }
  } else if (typeof keys === 'object') {
    keyProps = {
      checkedKeys: keys.checked || undefined,
      halfCheckedKeys: keys.halfChecked || undefined,
    }
  } else {
    warning(false, '`checkedKeys` is not an array or an object')
    return null
  }

  return keyProps
}
