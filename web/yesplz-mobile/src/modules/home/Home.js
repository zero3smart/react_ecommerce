import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { AdvancedPresetList } from '@yesplz/core-web/modules/presets'
import { withTrackingProvider } from '@yesplz/core-web/hoc'
import { CATEGORY_TOPS, CATEGORY_SHOES, CATEGORY_PANTS } from '@yesplz/core-web/config/constants'
import { GroupTitle } from '@yesplz/core-web/ui-kits/misc'

import HomeSlider from './HomeSlider'
import { NewProducts, RecommendedProducts } from 'modules/products'
import './home.css'

class Home extends Component {
  static propTypes = {
    history: PropTypes.func
  }

  handleClickNewProductsTitle = category => () => {
    this.props.history.push(`/products/${category}`)
  }

  handleClickNewArrivals = category => () => {
    this.props.history.push(`/products/${category}/list?listingView=single&page=new`)
  }

  handleClickSlideItem = category => () => {
    this.props.history.push(`/products/${category}`)
  }

  render () {
    return (
      <div className='Home'>
        <HomeSlider onClickSlideItem={this.handleClickSlideItem} />
        <div style={{ overflowX: 'hidden' }}>
          <div className='container'>
            <GroupTitle onClickTitle={this.handleClickNewArrivals(CATEGORY_TOPS)}>New Tops</GroupTitle>
            <NewProducts
              title='New Tops'
              category={CATEGORY_TOPS}
              limitPerPage={10}
              onProductPresetClick={this.handleClickNewProductsTitle(CATEGORY_TOPS)}
            />
            <GroupTitle onClickTitle={this.handleClickNewArrivals(CATEGORY_PANTS)}>New Jeans</GroupTitle>
            <NewProducts
              title='New Jeans'
              category={CATEGORY_PANTS}
              limitPerPage={10}
              onProductPresetClick={this.handleClickNewProductsTitle(CATEGORY_PANTS)}
            />
            <GroupTitle onClickTitle={this.handleClickNewArrivals(CATEGORY_SHOES)}>New Shoes</GroupTitle>
            <NewProducts
              title='New Shoes'
              category={CATEGORY_SHOES}
              limitPerPage={10}
              onProductPresetClick={this.handleClickNewProductsTitle(CATEGORY_SHOES)}
            />
          </div>
        </div>
        <div style={{ overflowX: 'hidden' }}>
          <div className='container'>
            <h2 className='SubHeader'>Editors Picks</h2>
            <AdvancedPresetList presetMatchesCount={3} useMinimalPreset />
          </div>
        </div>

        <div className='container'>
          <h2 className='SubHeader'>Explore</h2>
          <RecommendedProducts
            limitPerPage={3}
            enableFetchNext
            useScrollFetcher
          />
        </div>
      </div>
    )
  }
}

export default withTrackingProvider('Home')(Home)
