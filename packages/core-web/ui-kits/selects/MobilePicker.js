import React, { useEffect } from 'react'
import Picker from 'react-mobile-picker'
import PropTypes from 'prop-types'
import { Transition as RTransition } from 'react-transition-group'
import preventDefault from '@yesplz/core-web/utils/preventDefault'
import './MobilePicker.scss'

const MobilePicker = ({
  isVisible,
  optionGroups,
  valueGroups,
  onChange,
  onPick,
  onClose
}) => {
  useEffect(() => {
    if (isVisible) {
      window.ontouchmove = preventDefault
    } else {
      window.ontouchmove = null
    }
    return () => {
      window.ontouchmove = null
    }
  }, [isVisible])

  return (
    <RTransition timeout={500} in={isVisible}>
      {
        state => {
          if (state === 'exited') {
            return null
          }
          return (
            <div className={`MobilePicker ${state}`}>
              <div className='MobilePicker-backDrop' onClick={onClose} />
              <div className='MobilePicker-content'>
                <div className='MobilePicker-contentHeader'>
                  <button className='MobilePicker-button' onClick={onPick}>Done</button>
                </div>
                <Picker
                  optionGroups={optionGroups}
                  valueGroups={valueGroups}
                  onChange={onChange}
                />
              </div>
            </div>
          )
        }
      }
    </RTransition>
  )
}

MobilePicker.propTypes = {
  isVisible: PropTypes.bool,
  optionGroups: PropTypes.object,
  valueGroups: PropTypes.object,
  onChange: PropTypes.func,
  onPick: PropTypes.func,
  onClose: PropTypes.func
}

export default MobilePicker
