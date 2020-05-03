import Head from 'next/head'
import moment from 'moment/moment'
import { Container, Row, Col, Button, InputGroup, FormControl } from 'react-bootstrap'
import 'bootstrap/dist/css/bootstrap.min.css'

const DURATION = 3 * 1000

export default class Page extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      timerIs: 'stopped',
      willStopAt: null,
      remaining: moment.duration(DURATION),
      isSetting: false,
      duration: moment.duration(DURATION),
    }
    this.onStart = this.onStart.bind(this)
    this.onPause = this.onPause.bind(this)
    this.tick = this.tick.bind(this)
    this.updateDuration = this.updateDuration.bind(this)
  }

  render() {
    const startable = this.state.timerIs != 'running'
    const pausable = this.state.timerIs == 'running'
    let Content
    if (this.state.isSetting) {
      Content = <Settings
        duration={this.state.duration}
        onSubmit={this.updateDuration}
        onCancel={() => { this.setState({ isSetting: false }) }} />
    } else {
      Content = <Display
        remaining={this.state.remaining}
        startable={startable} pausable={pausable}
        onStart={this.onStart} onPause={this.onPause}
        onSetting={() => { this.setState({ isSetting: true }) }} />
    }

    return (
      <div className="container">
        <Head>
          <title>Tomatimer</title>
          <link rel="icon" href="/favicon.ico" />
        </Head>
        {Content}
      </div>
    )
  }

  componentDidMount() {
    Notification.requestPermission()
    setInterval(this.tick, 500)
  }

  tick() {
    if (this.state.timerIs == 'running') {
      const timeLimit = this.state.willStopAt.clone()
      const now = moment()
      const remaining = moment.duration(timeLimit.subtract(now).min(0))
      const state = { remaining: remaining }

      // When time is up...
      if (remaining.as('seconds') == 0) {
        state.timerIs = 'stopped'
        state.willStopAt = null
        state.remaining = moment.duration(this.state.duration)
        new Notification("Time is up")
      }

      this.setState(state)
    }
  }

  onStart() {
    const willStopAt = moment().add(this.state.remaining)
    this.setState({ timerIs: 'running', willStopAt: willStopAt })
  }

  onPause() {
    this.setState({ timerIs: 'paused' })
  }

  updateDuration(duration) {
    this.setState({
      duration: duration.clone(),
      remaining: duration.clone(),
      isSetting: false
    })
  }
}

function Display({ remaining, startable, pausable, onStart, onPause,
  onSetting }) {
  return (
    <Container fluid style={{ marginTop: '1rem' }}>
      <Row>
        <Col>
          <DurationClock duration={remaining} onClick={onSetting} />
        </Col>
      </Row>
      <Row>
        <Col>
          <Button variant="primary" disabled={!startable}
            onClick={onStart}>
            Start
        </Button>
        </Col>
        <Col>
          <Button variant="secondary" disabled={!pausable}
            onClick={onPause}>
            Pause
        </Button>
        </Col>
      </Row>
    </Container>
  )
}

function DurationClock({ duration, onClick }) {
  const min = duration.minutes().toString().padStart(2, '0')
  const sec = duration.seconds().toString().padStart(2, '0')
  return (
    <div className="h1 text-monospace" onClick={onClick}>
      {min}:{sec}
    </div>
  )
}

class Settings extends React.Component {
  constructor(props) {
    super(props)
    const duration = props.duration
    this.state = {
      min: duration.minutes().toString(),
      sec: duration.seconds().toString()
    }
    this.onMinutesChange = this.onMinutesChange.bind(this)
    this.onSecondsChange = this.onSecondsChange.bind(this)
    this.onOk = this.onOk.bind(this)
    this.submit = props.onSubmit
    this.cancel = props.onCancel
  }

  render() {
    return (
      <Container fluid style={{ marginTop: '1rem' }}>
        <Row>
          <Col>
            <InputGroup>
              <FormControl value={this.state.min}
                onChange={this.onMinutesChange} />
              <div className="input-group-prepend input-group-append">
                <InputGroup.Text>:</InputGroup.Text>
              </div>
              <FormControl value={this.state.sec}
                onChange={this.onSecondsChange} />
            </InputGroup>
          </Col>
        </Row>
        <Row style={{ marginTop: '1rem' }}>
          <Col>
            <Button variant="primary" onClick={this.onOk}>OK</Button>
          </Col>
          <Col>
            <Button variant="secondary" onClick={this.cancel}>Cancel</Button>
          </Col>
        </Row>
      </Container>
    )
  }

  onMinutesChange(event) {
    this.setState({ min: event.target.value })
  }

  onSecondsChange(event) {
    this.setState({ sec: event.target.value })
  }

  onOk() {
    const durationStr = '00:' + this.state.min + ':' + this.state.sec
    const duration = moment.duration(durationStr)
    this.submit(duration)
  }
}
