import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'
import likeSVGSrc from 'assets/svg/like.svg'
import likeWhiteSVGSrc from 'assets/svg/like-white.svg'
import './like-button.css'

export default class LikeButton extends PureComponent {
  static propTypes = {
    active: PropTypes.bool,
    onClick: PropTypes.func
  }

  static defaultProps = {
    active: false
  }

  render () {
    const { active, onClick } = this.props
    const iconSource = active ? likeWhiteSVGSrc : likeSVGSrc
    return (
      <div className={classNames('LikeButton', { active })}>
        <button onClick={onClick}>
          <img src={iconSource} alt='Like' />
        </button>
      </div>
    )
  }
}
