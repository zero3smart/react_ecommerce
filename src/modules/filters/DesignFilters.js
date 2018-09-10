import React, { Component } from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'
import FormControlLabel from '@material-ui/core/FormControlLabel'
import { Switch } from 'ui-kits/forms'
import { withFocus } from 'hoc'
import './design-filters.css'

class DesignFilters extends Component {
  static propTypes = {
    solid: PropTypes.bool,
    pattern: PropTypes.bool,
    details: PropTypes.bool,
    className: PropTypes.string,
    onChange: PropTypes.func.isRequired
  }

  static defaultProps = {
    solid: false,
    pattern: false,
    details: false,
    onChange: (value, name) => {}
  }

  get handleChange () {
    return (event) => {
      this.props.onChange(event.target.checked, event.target.value)
    }
  }

  render () {
    const { solid, pattern, details, className } = this.props
    return (
      <div className={classNames('DesignFilters', { [className]: className })}>
        <FormControlLabel
          label='Solid'
          labelPlacement='start'
          control={
            <Switch
              checked={solid}
              onChange={this.handleChange}
              value='solid'
            />
          }
        />
        <FormControlLabel
          label='Pattern'
          labelPlacement='start'
          control={
            <Switch
              checked={pattern}
              onChange={this.handleChange}
              value='pattern'
            />
          }
        />
        <FormControlLabel
          label='Detail'
          labelPlacement='start'
          control={
            <Switch
              checked={details}
              onChange={this.handleChange}
              value='details'
            />
          }
        />
      </div>
    )
  }
}

export default withFocus(DesignFilters, true)
