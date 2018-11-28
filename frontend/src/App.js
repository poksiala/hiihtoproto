import React, { Component } from 'react';
import styled from 'styled-components'
import good1 from './img/good1.png'
import bad1 from './img/bad1.png'
import good2 from './img/good2.png'
import bad2 from './img/bad2.png'
import neutral from './img/neutral.png'
import thanks from './audio/kiitos.ogg'
import remember from './audio/muistathan.ogg'

const WS_URL = "ws://192.168.10.98:8080"
const MIXED_DELAY = 1000
const CLEAR_DELAY = 10000
const AUDIO_DELAY = 4000

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
    this.timeouts = []
    this.connection = null
    this.content = React.createRef()
  }

  playAudio = (audio) => (new Audio(audio)).play()

  clearTimeouts = () => {
    this.timeouts.forEach((id) => clearTimeout(id))
    this.timeout = []
  }

  /**
   * Set status immediately to positive for duration of CLEAR_DELAY.
   * Play positive audio after duration of AUDIO_DELAY.
   */
  startPositiveRoutine = () => {
    this.clearTimeouts()
    this.setState({status: 1})
    this.timeouts = [
      setTimeout(() => this.setState({status: 0}), CLEAR_DELAY),
      setTimeout(() => this.playAudio(thanks), AUDIO_DELAY)
    ]
  }

  /**
   * Set status to negative after MIXED_DELAY for duration of CLEAR_DELAY.
   * Play negative audio after duration of MIXED_DELAY + AUDIO_DELAY.
   */
  startNegativeRoutine = () => {
    this.clearTimeouts()
    this.timeouts = [
      setTimeout(() => this.setState({status: -1}), MIXED_DELAY),
      setTimeout(() => this.setState({status: 0}), MIXED_DELAY + CLEAR_DELAY),
      setTimeout(() => this.playAudio(remember), MIXED_DELAY + AUDIO_DELAY)
    ]
  }

  /**
   * If status is neutral and bio is opened show positive.
   * If mixed is opened show negative after MIXED_DELAY.
   * 
   * Bio takes precedence and can replace negative status.
   */
  handleMessage = (data) => {
    console.log(data)
    if (this.state.status === 0) {
      if (data.bio) {
        this.startPositiveRoutine()
      } else if (data.mixed) {
        this.startNegativeRoutine()
      }
    } else if (this.state.status === -1 && data.bio) {
      this.startPositiveRoutine()
    }
  }

  connect = () => {
    if (WS_URL) {
      this.connection = new WebSocket(WS_URL, 'echo-protocol')
      this.connection.onmessage = (evt) => this.handleMessage(JSON.parse(evt.data))
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

  selectImg = () => {
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
