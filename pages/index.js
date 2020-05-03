import Head from 'next/head'
import moment from 'moment/moment'
import { Container, Row, Col, Button } from 'react-bootstrap'
import 'bootstrap/dist/css/bootstrap.min.css'

const DURATION = 3 * 1000

export default class Page extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      timerIs: 'stopped',
      willStopAt: null,
      remaining: moment.duration(DURATION)
    }
    this.onStart = this.onStart.bind(this)
    this.onPause = this.onPause.bind(this)
    this.tick = this.tick.bind(this)
  }

  render() {
    const startable = this.state.timerIs != 'running'
    const pausable = this.state.timerIs == 'running'

    return (
      <div className="container">
        <Head>
          <title>Tomatimer</title>
          <link rel="icon" href="/favicon.ico" />
        </Head>
        <Container fluid style={{ marginTop: '1rem' }}>
          <Row>
            <Col>
              <DurationClock duration={this.state.remaining} />
            </Col>
          </Row>
          <Row>
            <Col>
              <Button variant="primary" disabled={!startable}
                onClick={this.onStart}>
                Start
              </Button>
            </Col>
            <Col>
              <Button variant="secondary" disabled={!pausable}
                onClick={this.onPause}>
                Pause
              </Button>
            </Col>
          </Row>
        </Container>
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
        state.remaining = moment.duration(DURATION)
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
}

function DurationClock({ duration }) {
  const min = duration.minutes().toString().padStart(2, '0')
  const sec = duration.seconds().toString().padStart(2, '0')
  return (
    <div className="h1 text-monospace">
      {min}:{sec}
    </div>
  )
}
