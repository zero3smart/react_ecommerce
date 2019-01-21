import React from 'react'
import PropTypes from 'prop-types'
import './section-title.css'

const SectionTitle = ({ title, subtitle, style, titleStyle }) => (
  <div className='SectionTitle' style={style}>
    <div className='container'>
      <h3 style={titleStyle}>{title}</h3>
      <p>{subtitle}</p>
    </div>
  </div>
)

SectionTitle.propTypes = {
  title: PropTypes.string,
  subtitle: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.element
  ]),
  style: PropTypes.object,
  titleStyle: PropTypes.object
}

export default SectionTitle
