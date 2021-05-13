'use strict'
import React, {useState} from 'react'
import PropTypes from 'prop-types'
import ReactDOM from 'react-dom'
import Card from '../api/Card'
import ClockInput from './ClockInput'
import {swipeVolunteer} from '../api/Fetch'

/* global sponsor */
const Kiosk = ({sponsor}) => {
  const [error, setError] = useState('')
  const [message, setMessage] = useState('')
  const [lockInput, setLockInput] = useState(false)

  const sendSwipe = (bannerId) => {
    setLockInput(true)
    const Promise = swipeVolunteer(bannerId, sponsor.id)
    Promise.then((response) => {
      const {success, result} = response.data
      if (success) {
        switch (result) {
          case 'in':
            setMessage('Thank you for clocking in.')
            break
          case 'out':
            setMessage('Thank you, you have clocked out.')
            break
        }
      } else {
        switch (result) {
          case 'punchedInElsewhere':
            setError('You are currently clocked in elsewhere.')
            break
          case 'notfound':
            setError('Could not find your account. Check at the desk.')
            break
        }
      }
      setLockInput(false)
      const reset = setTimeout(() => {
        setError('')
        setMessage('')
        clearTimeout(reset)
      }, 4000)
    })
  }

  if (error.length > 0) {
    return <div className="alert alert-warning lead text-center">{error}</div>
  } else if (message.length > 0) {
    return <div className="alert alert-success lead text-center">{message}</div>
  } else {
    return (
      <div>
        <Card
          title={`Welcome to ${sponsor.name}`}
          subtitle={
            <div className="text-center">
              Please swipe your student ID card or
              <br />
              type your Banner ID number below.
            </div>
          }
          content={<ClockInput sendSwipe={sendSwipe} lockInput={lockInput} />}
        />
      </div>
    )
  }
}

Kiosk.propTypes = {sponsor: PropTypes.object}

ReactDOM.render(<Kiosk sponsor={sponsor} />, document.getElementById('Kiosk'))
