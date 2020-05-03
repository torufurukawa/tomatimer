import Head from 'next/head'
import moment from 'moment/moment'
import { Container, Row, Col, Button } from 'react-bootstrap'
import 'bootstrap/dist/css/bootstrap.min.css'

const DURATION = 3 * 1000

export default class Page extends React.Component {
  constructor(props) {
    super(props)
    this.state = { timerIs: 'stopped', willStopAt: null }
    this.onStart = this.onStart.bind(this)
    this.tick = this.tick.bind(this)
    this.notify = this.notify.bind(this)
  }

  render() {
    const disabled = this.state.timerIs != 'stopped'
    let remaining = moment.duration(0)
    if (this.state.willStopAt) {
      remaining = this.state.willStopAt.clone().subtract(moment())
    }

    return (
      <div className="container">
        <Head>
          <title>Tomatimer</title>
          <link rel="icon" href="/favicon.ico" />
        </Head>
        <Container fluid style={{ marginTop: '1rem' }}>
          <Row>
            <Col>
              <DurationClock duration={remaining} />
            </Col>
          </Row>
          <Row>
            <Col>
              <Button variant="primary" disabled={disabled}
                onClick={this.onStart} >
                Start
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
      if (moment().isSameOrAfter(this.state.willStopAt)) {
        this.setState(
          { timerIs: 'stopped', willStopAt: null },
          () => { this.notify() }
        )
      }
      this.forceUpdate()
    }
  }

  onStart() {
    const willStopAt = moment().add(moment.duration(DURATION))
    this.setState({ timerIs: 'running', willStopAt: willStopAt.clone() })
  }

  notify() {
    new Notification("Time is up")
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
