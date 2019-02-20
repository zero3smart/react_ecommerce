import React from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'
import './Checkbox.scss'

const Checkbox = ({ label, name, value, htmlFor, indeterminate, onChange }) => (
  <label htmlFor={htmlFor} className='YesplzCheckbox'>
    <input
      id={htmlFor}
      type='checkbox'
      onChange={(event) => {
        onChange(name, indeterminate ? false : event.target.checked)
      }}
      checked={value}
    />
    <div
      className={
        classNames('YesplzCheckbox-mask', {
          'is-indeterminate': indeterminate,
          'is-checked': value
        })
      } />
    {label}
  </label>
)

Checkbox.propTypes = {
  label: PropTypes.string,
  name: PropTypes.string,
  value: PropTypes.bool,
  indeterminate: PropTypes.bool,
  htmlFor: PropTypes.string,
  onChange: PropTypes.func.isRequired
}

Checkbox.defaultProps = {
  value: false,
  indeterminate: false,
  onChange: (name, value) => { console.debug('Unhandled `onChange` prop of `Checkbox`', name, value) }
}

export default Checkbox
