import React, { PureComponent } from 'react'
import { Tabs, Tab } from './style'

class TabsComponent extends PureComponent {
  render() {
    return (
      <Tabs onClick={this.handleTabClick.bind(this)}>
        <Tab className={'active'}>Tab1</Tab>
      </Tabs>
    )
  }

  handleTabClick() {
  }
}

export default TabsComponent
