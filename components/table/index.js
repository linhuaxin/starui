import React, { PureComponent } from 'react'
import { Table } from './style'

class TableComponent extends PureComponent {
  render() {
    let { children } = this.props

      return (
        <Table>{ children }</Table>
      )
  }
}

export default TableComponent