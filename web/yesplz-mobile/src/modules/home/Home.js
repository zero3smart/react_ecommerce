import React, { Component } from 'react'
import { AdvancedPresetList } from '@yesplz/core-web/modules/presets'
import { withTrackingProvider } from '@yesplz/core-web/hoc'
import { CATEGORY_TOPS, CATEGORY_SHOES, CATEGORY_PANTS } from '@yesplz/core-web/config/constants'
import HomeSlider from './HomeSlider'
import { NewProducts, RecommendedProducts } from 'modules/products'
import './home.css'

class Home extends Component {
  render () {
    return (
      <div className='Home'>
        <HomeSlider />
        <div style={{ overflowX: 'hidden' }}>
          <div className='container'>
            <NewProducts
              title='New Tops'
              category={CATEGORY_TOPS}
              limitPerPage={10}
            />
            <NewProducts
              title='New Jeans'
              category={CATEGORY_PANTS}
              limitPerPage={10}
            />
            <NewProducts
              title='New Shoes'
              category={CATEGORY_SHOES}
              limitPerPage={10}
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
