import React from 'react'
import Head from 'next/head'
import { AppBar, Toolbar, Button, Typography } from '@material-ui/core'
import { Grid as MuiGrid } from '@material-ui/core'
import moment from 'moment'


class Page extends React.Component {
  intervalId = null
  get timerSpecs() {
    return {
      'work': {
        name: 'work',
        title: 'Work',
        duration: moment.duration('00:25:00'),
        message: 'Stop working, take a break',
        color: 'primary'
      },
      'break': {
        name: 'break',
        title: 'Break',
        duration: moment.duration('00:05:00'),
        message: 'Now, get back to work',
        color: 'default'
      }
    }
  }

  constructor(prop) {
    super(prop)
    const initialTimerSpec = this.timerSpecs.work
    this.state = {
      timerSpec: initialTimerSpec,
      isRunning: false,
      until: null,
      remaining: initialTimerSpec.duration
    }
    this.tick = this.tick.bind(this)
    this.notify = this.notify.bind(this)
    this.onClickStartButton = this.onClickStartButton.bind(this)

    // Start ticking
    this.intervalId = setInterval(this.tick, 1000)
  }

  render() {
    const color = this.state.timerSpec.color

    return (
      <React.Fragment>
        <Head><title>Tomatimer</title></Head>
        <TitleBar title={this.state.timerSpec.title} color={color} />
        <Grid>
          <Time duration={this.state.remaining} />
          <StartButton onClick={this.onClickStartButton}
            disabled={this.state.isRunning} color={color} />
        </Grid>
      </React.Fragment>
    )
  }

  onClickStartButton() {
    const until = moment().add(this.state.timerSpec.duration)
    this.setState({ isRunning: true, until: until })
    getCurrentWindow().hide()
  }

  tick() {
    if (!this.state.isRunning) { return }

    // update remaining duration
    let remainder = Math.max(this.state.until.diff(moment()), 0)
    const newState = { remaining: moment.duration(remainder) }

    // if time is up...
    if (remainder == 0) {
      newState.isRunning = false
      newState.until = null
      // switch timer
      const currentTimerName = this.state.timerSpec.name
      const nextTimerName = currentTimerName == 'work' ? 'break' : 'work'
      const nextTimerSpec = this.timerSpecs[nextTimerName]
      newState.timerSpec = nextTimerSpec
      newState.remaining = nextTimerSpec.duration

      this.notify()
    }
    this.setState(newState)
    updateTray(newState.remaining)
  }

  notify() {
    const n = new Notification(this.state.timerSpec.message)
    n.onclick = () => { getCurrentWindow().show() }
  }

  componentWillUnmount() {
    clearInterval(this.intervalId)
  }
}

function Grid({ ...props }) {
  const gridProps = {
    container: true,
    direction: 'column',
    justify: 'space-evenly',
    alignItems: 'center',
    style: {
      height: '90vh',
      width: '90%',
      marginLeft: '1em',
      marginRight: '1em'
    }
  }
  return (
    <MuiGrid {...gridProps}>
      {props.children}
    </MuiGrid>
  )
}

function TitleBar({ title, color }) {
  return (
    <AppBar color={color} position="static" style={{ alignItems: 'center' }}>
      <Toolbar>
        <Typography variant="h6">{title}</Typography>
      </Toolbar>
    </AppBar>
  )
}

function Time({ duration }) {
  const text = moment.utc(duration.asMilliseconds()).format('mm:ss')
  return (
    <Typography variant="h2" style={{ fontFamily: 'Space Mono' }}>
      {text}
    </Typography>
  )
}

function StartButton({ onClick, disabled, color }) {
  return (
    <Button variant="contained" color={color} size="large"
      onClick={onClick} disabled={disabled}>
      Start
    </Button>
  )
}

function getCurrentWindow() {
  return require('electron').remote.getCurrentWindow()
}

function updateTray(duration) {
  const title = moment.utc(duration.asMilliseconds()).format('mm:ss')
  require('electron').remote.getGlobal('setTrayTitle')(title)
}

export default Page;
