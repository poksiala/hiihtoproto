import React, { Component } from 'react';
import styled from 'styled-components'
import good1 from './img/good1.png'
import bad1 from './img/bad1.png'
import good2 from './img/good2.png'
import bad2 from './img/bad2.png'
import neutral from './img/neutral.png'

const selectRandom = (l) => l[Math.floor(Math.random() * l.length)]

const Content = styled.div`
  width: 1920px;
  height: 1080px;
  background-image: url(${props => props.img});
`

class App extends Component {
  constructor(props) {
    super(props)
    this.state = { status: 1 }
  }

  selectImg() {
    if (this.state.status === 0) {
      return neutral
    } else if (this.state.status === -1) {
      return selectRandom([bad1, bad2])
    } else {
      return selectRandom([good1, good2])
    }
  }

  render() {
    return (
      <Content img={this.selectImg()} />
    );
  }
}

// <img src={this.selectImg()} className="App-logo" alt="logo" />

export default App;
