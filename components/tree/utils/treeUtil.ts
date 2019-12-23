import {TreeNodeProps} from '../TreeNode'
import warning from 'rc-util/lib/warning'


export function convertNodePropsToEventData(props: TreeNodeProps): any {
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
      }
    })
  }

  return eventData
}
