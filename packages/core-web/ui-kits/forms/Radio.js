import React from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'
import './Radio.scss'

const Radio = ({ label, name, value, htmlFor, onChange }) => (
  <label htmlFor={htmlFor} className='YesplzRadio'>
    <input
      id={htmlFor}
      type='radio'
      name={name}
      onChange={(event) => {
        onChange(name, event.target.checked)
      }}
      checked={value}
    />
    <div
      className={
        classNames('YesplzRadio-mask', {
          'is-checked': value
        })
      } />
    {label}
  </label>
)

Radio.propTypes = {
  label: PropTypes.string,
  name: PropTypes.string,
  value: PropTypes.bool,
  htmlFor: PropTypes.string,
  onChange: PropTypes.func.isRequired
}

Radio.defaultProps = {
  value: false,
  indeterminate: false,
  onChange: (name, value) => { console.debug('Unhandled `onChange` prop of `Checkbox`', name, value) }
}

export default Radio
