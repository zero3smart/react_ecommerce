import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { InfoBanner } from 'yesplz@ui-kits/banners'
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
      // {
      //   title: 'Who’s the team YesPlz?',
      //   content: ''
      // },
      {
        title: 'I am social, where do I find you?',
        content: 'Glad to hear that! We are on Instagram find us #yesplz_fashion Look forward to seeing you there!'
      },
      {
        title: 'I want to give you my feedback, how do I contact you?',
        content: 'First, thank you! We are always looking for feedbacks to make your experience better. Simply email us to hello@yesplz.us'
      }
      // {
      //   title: 'I need the instruction again, where can I find it?',
      //   content: 'Look no further. Here we have the instructions how to use our search filters. Please email us at mailto:hello@yesplz.us if you can’t find the right instruction, we will reply back in 24 hours.'
      // }
    ]
  }

  render () {
    const { classes } = this.props
    return (
      <div id='MainScroll' className='Faq'>
        <InfoBanner className={`animated fadeInDown ${classes.infoBanner}`}>
          <div className='container'>
            <h1>FAQ</h1>
            <p className={classes.infoBannerDescription}>All about YesPlz</p>
          </div>
        </InfoBanner>
        <div className='faqs-questions container'>
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
                    <Typography className={classes.body}>
                      {faq.content}
                    </Typography>
                  </ExpansionPanelDetails>
                </ExpansionPanel>
              ))
            }
          </div>
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
    marginBottom: 30,
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
    fontSize: 36,
    color: '#4A4A4A',
    paddingLeft: 50,
    position: 'relative',
    '& > span': {
      position: 'absolute',
      top: 0,
      left: 0
    }
  },
  body: {
    fontSize: 36
  },
  detail: {
    padding: 0
  },
  infoBanner: {
    padding: '30px 20px 40px'
  },
  infoBannerDescription: {
    fontSize: '36px!important'
  }
})

export default withStyles(styles)(Faq)
