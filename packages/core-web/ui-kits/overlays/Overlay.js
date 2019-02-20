import React, { useEffect } from 'react'
import PropTypes from 'prop-types'
import PerfectScrollbar from 'react-perfect-scrollbar'
import preventDefault from '@yesplz/core-web/utils/preventDefault'
import Transition from '@yesplz/core-web/ui-kits/transitions/Transition'
import CloseSvg from '../../assets/svg/close-black.svg'
import './Overlay.scss'

const Overlay = ({ title, children, className, isVisible, onClose }) => {
  // make default window unscrollable
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
    <Transition timeout={{ enter: 100, exit: 200 }} show={isVisible} transition='fadeInUp'>
      <div className={`Overlay ${className}`} style={{ animationDuration: '300ms' }}>
        <PerfectScrollbar className='Overlay-scroll' style={{ touchAction: 'none' }}>
          <div className='container'>
            <div className='Overlay-header'>
              <h2>{title}</h2>
              <div className='Overlay-close' onClick={onClose}>
                <img src={CloseSvg} />
              </div>
            </div>
            <div className='Overlay-content'>
              {children}
            </div>
          </div>
        </PerfectScrollbar>
      </div>
    </Transition>
  )
}

Overlay.propTypes = {
  title: PropTypes.string.isRequired,
  children: PropTypes.any.isRequired,
  isVisible: PropTypes.bool.isRequired,
  className: PropTypes.string,
  onClose: PropTypes.func.isRequired
}

export default Overlay
