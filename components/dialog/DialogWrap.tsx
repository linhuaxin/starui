import * as React from 'react'
import Dialog from './Dialog'
import Portal from 'rc-util/lib/PortalWrapper'
import IDialogPropTypes from './IDialogPropTypes'
import { IDialogChildProps } from './Dialog'

export default (props: IDialogPropTypes) => {
  const { visible, getContainer, forceRender } = props
  if (getContainer === false) {
    return (
      <Dialog
        {...props}
        getOpenCount={() => 2}
      />
    )
  }

  return (
    <Portal
      visible={visible}
      forceRender={forceRender}
      getContainer={getContainer}
    >
      {(childProps: IDialogChildProps) => (
        <Dialog
          {...props}
          {...childProps}
        />
      )}
    </Portal>
  )
}
