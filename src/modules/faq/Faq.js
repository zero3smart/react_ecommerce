import React, { Component } from 'react'
import { compose } from 'redux'
import PropTypes from 'prop-types'
import { withTrackingProvider } from 'hoc'
import { InfoBanner } from 'ui-kits/banners'
import { withStyles } from '@material-ui/core/styles'
import ExpansionPanel from '@material-ui/core/ExpansionPanel'
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary'
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails'
import Typography from '@material-ui/core/Typography'
import IconOpenSrc from 'assets/svg/accordion-circle-open.svg'
import IconClosedSrc from 'assets/svg/accordion-circle-closed.svg'
import instagramSvgSrc from 'assets/svg/instagram.svg'
import './faq.css'

class Faq extends Component {
  static propTypes = {
    classes: PropTypes.object
  }

  constructor (props) {
    super(props)
    this.state = {
      activeIndex: -1
    }
  }

  get faqs () {
    return [
      // {
      //   title: 'Who’s the team YesPlz?',
      //   content: ''
      // },
      {
        title: 'I am social, where do I find you?',
        content: `Glad to hear that! We are on Instagram find us #yesplz_fashion Look forward to seeing you there!
        <br/><br/>
        <a href='https://www.instagram.com/yesplz_fashion/' target='_blank' rel='noopener noreferrer' class='SocialLink'>
          Follow Us <img src='${instagramSvgSrc}' alt='Yesplz Instagram' />
        </a>
        `
      },
      {
        title: 'I want to give you my feedback, how do I contact you?',
        content: 'First, thank you! We are always looking for feedbacks to make your experience better. Simply email us to <a href="mailto:hello@yesplz.us">hello@yesplz.us</a>'
      }
      // {
      //   title: 'I need the instruction again, where can I find it?',
      //   content: 'Look no further. Here we have the instructions how to use our search filters. Please email us at mailto:hello@yesplz.us if you can’t find the right instruction, we will reply back in 24 hours.'
      // }
    ]
  }

  makeAccordionChangeHandler (key) {
    return (_, expanded) => {
      let activeIndex = -1
      if (expanded) {
        activeIndex = key
      }

      this.setState({ activeIndex })
    }
  }

  render () {
    const { classes } = this.props
    const { activeIndex } = this.state

    return (
      <div id='MainScroll' className='Faq'>
        <InfoBanner style={styles.infoBanner} className='animated fadeInDown'>
          <h3>FAQ</h3>
          <p>All about YesPlz</p>
        </InfoBanner>
        <div className={classes.root}>
          {
            this.faqs.map((faq, index) => (
              <ExpansionPanel
                key={index}
                className={classes.panel}
                onChange={this.makeAccordionChangeHandler(index)}
                classes={{ expanded: 'expanded' }}>
                <ExpansionPanelSummary
                  expandIcon={<img src={activeIndex === index ? IconOpenSrc : IconClosedSrc} />}
                  className={classes.headingWrapper}
                  classes={{ expanded: 'expanded', expandIcon: 'expandIcon' }}>
                  <Typography className={classes.heading}>
                    <span>{index + 1}.</span>  {faq.title}
                  </Typography>
                </ExpansionPanelSummary>
                <ExpansionPanelDetails className={classes.detail}>
                  <Typography className={classes.body}>
                    <span dangerouslySetInnerHTML={{ __html: faq.content }} />
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
    paddingBottom: 10,
    marginBottom: 20,
    borderBottom: '1px solid #979797',
    '&:before': {
      display: 'none'
    },
    '& > content': {
      display: 'none'
    },
    '&.expanded': {
      paddingBottom: 20
    }
  },
  headingWrapper: {
    paddingLeft: 40,
    paddingRight: 0,
    position: 'relative',
    '&.expanded': {
      minHeight: 48
    },
    '& > .expanded': {
      margin: '12px 0'
    },
    '& > .expandIcon': {
      width: 20,
      height: 20,
      position: 'absolute',
      left: 0,
      top: 12,
      margin: '12px 0'
    },
    '& > .expandIcon img': {
      width: '100%'
    }
  },
  heading: {
    fontSize: 14,
    color: 'rgba(0, 0, 0, 0.6)',
    paddingLeft: 20,
    position: 'relative',
    '& > span': {
      position: 'absolute',
      top: 0,
      left: 0
    }
  },
  body: {
    color: 'rgba(0, 0, 0, 0.87)',
    paddingTop: 10,
    paddingLeft: 60
  },
  detail: {
    padding: 0
  }
})

export default compose(withStyles(styles), withTrackingProvider('FAQ'))(Faq)
