import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'
import likeSVGSrc from '../../assets/svg/like.svg'
import likeActiveSVGSrc from '../../assets/svg/like-active.svg'
import './like-button.css'

export default class LikeButton extends PureComponent {
  render () {
    const { active, onClick } = this.props
    const iconSource = active ? likeActiveSVGSrc : likeSVGSrc
    return (
      <div className={classNames('LikeButton', { active })}>
        <button onClick={onClick}>
          <img src={iconSource} alt='Like' />
        </button>
      </div>
    )
  }
}

LikeButton.propTypes = {
  active: PropTypes.bool,
  onClick: PropTypes.func
}

LikeButton.defaultProps = {
  active: false
}
