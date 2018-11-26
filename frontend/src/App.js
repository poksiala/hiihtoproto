import React, { Component } from 'react';
import styled from 'styled-components'
import good1 from './img/good1.png'
import bad1 from './img/bad1.png'
import good2 from './img/good2.png'
import bad2 from './img/bad2.png'
import neutral from './img/neutral.png'

const WS_URL = null
const MIXED_DELAY = 1000
const CLEAR_DELAY = 10000

const selectRandom = (l) => l[Math.floor(Math.random() * l.length)]

const Content = styled.div`
  width: 1920px;
  height: 1080px;
  background-image: url(${props => props.img});
`

class App extends Component {
  constructor(props) {
    super(props)
    this.state = { 
      status: 0,
    }
    this.timeout = null
    this.connection = null
    this.content = React.createRef()
  }

  /**
   * If status is neutral and bio is opened show positive.
   * if mixed is opened show negative after MIXED_DELAY.
   * 
   * Bio takes precedence and can replace negative status.
   */
  handleMessage = (data) => {
    if (this.state.status === 0) {
      if (data.bio) {
        clearTimeout(this.timeout)
        this.setState({status: 1})
        this.timeout = setTimeout(() => this.setState({status: 0}), CLEAR_DELAY)
      } else if (data.mixed) {
        clearTimeout(this.timeout)
        this.timeout = setTimeout(() => {
            this.setState({status: -1})
            this.timeout = setTimeout(() => {
              this.setState({status: 0})
            }, CLEAR_DELAY)
          }, MIXED_DELAY
        )
      }
    } else if (this.state.status === -1 && data.bio) {
      clearTimeout(this.timeout)
      this.setState({status: 1})
      this.timeout = setTimeout(() => {
        this.setState({status: 0})
      }, CLEAR_DELAY)
    }
  }

  connect = () => {
    if (WS_URL) {
      this.connection = new WebSocket(WS_URL)
      this.connection.onmessage = (evt) => this.handleMessage(evt.data)
      this.connection.onclose = () => setTimeout(this.connect, 2000)
    }
  }

  handleKeyDown = (e) => {
    this.handleMessage({
      bio: (e.key === 'k'),
      mixed: (e.key === 'j')
    })
  }

  componentDidMount = () => {
    this.connect()
    this.content.current.focus()
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
      <Content 
        img={this.selectImg()}
        tabIndex="0"
        onKeyDown={this.handleKeyDown}
        ref={this.content}
      />
    );
  }
}

export default App;
