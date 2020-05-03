import Head from 'next/head'
import moment from 'moment'
import { Container, Button } from 'react-bootstrap'
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
    }
  }

  render() {
    console.log("state: ", this.state)
    const disabled = this.state.timerIs != 'stopped'

    return (
      <div className="container">
        <Head>
          <title>Tomatimer</title>
          <link rel="icon" href="/favicon.ico" />
        </Head>
        <Container style={{ marginTop: '1rem' }}>
          <Button variant="primary" onClick={this.onStart} disabled={disabled}>
            Start
          </Button>
        </Container>
      </div>
    )
  }

  onStart() {
    const willStopAt = moment() + moment.duration(DURATION)
    this.setState({ timerIs: 'running', willStopAt: willStopAt })
  }

  notify() {
    new Notification("Time is up")
  }
}
