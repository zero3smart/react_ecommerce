import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { InfoBanner } from 'ui-kits/banners'
import { withStyles } from '@material-ui/core/styles'
import ExpansionPanel from '@material-ui/core/ExpansionPanel'
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary'
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails'
import Typography from '@material-ui/core/Typography'
import './faq.css'

class Faq extends Component {
  static propTypes = {
    classes: PropTypes.object
  }

  get faqs () {
    return [
      {
        title: 'Who’s the team YesPlz?',
        content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse malesuada lacus ex, sit amet blandit leo lobortis eget.'
      },
      {
        title: 'I want to give you my feedback, how do I contact you?',
        content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse malesuada lacus ex, sit amet blandit leo lobortis eget.'
      },
      {
        title: 'I am social, where do I find you?',
        content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse malesuada lacus ex, sit amet blandit leo lobortis eget.'
      },
      {
        title: 'I need the instruction again, where can I find it?',
        content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse malesuada lacus ex, sit amet blandit leo lobortis eget.'
      }
    ]
  }

  render () {
    const { classes } = this.props
    return (
      <div id='MainScroll' className='Faq'>
        <InfoBanner style={styles.infoBanner} className='animated fadeInDown'>
          <h3>FAQ</h3>
          <p>All about YesPlz</p>
        </InfoBanner>
        <div className={classes.root}>
          {
            this.faqs.map((faq, index) => (
              <ExpansionPanel key={index} className={classes.panel}>
                <ExpansionPanelSummary className={classes.headingWrapper}>
                  <Typography className={classes.heading}>
                    <span>{index + 1}.</span>  {faq.title}
                  </Typography>
                </ExpansionPanelSummary>
                <ExpansionPanelDetails className={classes.detail}>
                  <Typography>
                    {faq.content}
                  </Typography>
                </ExpansionPanelDetails>
              </ExpansionPanel>
            ))
          }
        </div>
      </div>
    )
  }
}

const styles = theme => ({
  root: {
    width: '100%',
    padding: '20px 25px'
  },
  panel: {
    boxShadow: 'none',
    border: 0,
    '&:before': {
      display: 'none'
    },
    '& > content': {
      display: 'none'
    }
  },
  headingWrapper: {
    paddingLeft: 0,
    paddingRight: 0
  },
  heading: {
    fontSize: 14,
    color: '#4A4A4A',
    paddingLeft: 20,
    position: 'relative',
    '& > span': {
      position: 'absolute',
      top: 0,
      left: 0
    }
  },
  detail: {
    padding: 0
  }
})

export default withStyles(styles)(Faq)
