import React from 'react'
import { HeroSlider } from 'ui-kits/sliders'

// slide images
import SliderTopsImage from './images/slider-tops-home.png'
import SliderPantsImage from './images/slider-pants-home.png'
import SliderShoesImage from './images/slider-shoes-home.png'

const HomeSlider = () => (
  <HeroSlider>
    <div style={{ backgroundImage: `url(${SliderTopsImage})` }}>
      <h4>Tops</h4>
      <p>Tops for your day to day or special occasions</p>
    </div>
    <div style={{ backgroundImage: `url(${SliderPantsImage})` }}>
      <h4>Jeans</h4>
      <p>Jeans for your day to day or special occasions</p>
    </div>
    <div style={{ backgroundImage: `url(${SliderShoesImage})` }}>
      <h4>Shoes</h4>
      <p>Shoes for your day to day or special occasions</p>
    </div>
  </HeroSlider>
)

export default HomeSlider
