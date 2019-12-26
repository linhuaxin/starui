import warning from 'rc-util/lib/warning'
import {
  DataNode,
  EventDataNode,
  FlattenNode,
  TreeNodeProps
} from '../interface'

export function flattenTreeData(
  treeData: DataNode[] = []
): FlattenNode[] {
  const flattenList: FlattenNode[] = []

  function dig(list: DataNode[], level: number, parent: FlattenNode = null): FlattenNode[] {
    return list.map((treeNode, index) => {
      const flattenNode = {
        ...treeNode,
        parent,
        children: [],
        data: treeNode,
        level
      }

      flattenList.push(flattenNode)
      if (treeNode.children) {
        flattenNode.children = dig(treeNode.children, level + 1, flattenNode)
      }
      return flattenNode
    })
  }

  dig(treeData, 1)
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
