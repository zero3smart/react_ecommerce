import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { fetchProducts } from 'ducks/products'
import { syncFilter, toggleVisualFilter } from 'ducks/filters'
import { ProductList } from 'modules/products'
import { FloatButton } from 'modules/filters'
import { InfoBanner } from 'ui-kits/banners'
import ArrowRightSvg from 'assets/svg/arrow-right.svg'
import './tops.css'

class Tops extends Component {
  static propTypes = {
    products: PropTypes.array,
    filters: PropTypes.object,
    totalCount: PropTypes.number,
    isProductsFetched: PropTypes.bool,
    willBeEmptyList: PropTypes.bool,
    nextPage: PropTypes.number,
    visualFilterExpanded: PropTypes.bool,
    syncFilter: PropTypes.func.isRequired,
    fetchProducts: PropTypes.func.isRequired,
    toggleVisualFilter: PropTypes.func.isRequired
  }

  static defaultProps = {
    products: [],
    isProductsFetched: false,
    willBeEmptyList: false
  }

  constructor (props) {
    super(props)
    this.state = {
      hintVisible: true
    }
    this.allowHideOnScroll = true
  }

  componentDidMount () {
    const { isProductsFetched, syncFilter, fetchProducts, visualFilterExpanded } = this.props

    // don't need to do initial fetch if products is fetched already
    if (!isProductsFetched) {
      // make sure the filter is synced with localStorage data
      syncFilter()
      fetchProducts(true)
    }

    // if visual filter is expanded, hide the hint
    if (visualFilterExpanded) {
      this.setState({ hintVisible: false })
    }
  }

  componentDidUpdate (prevProps) {
    const { visualFilterExpanded } = this.props

    // if visual filter is expanded, hide the hint
    if (prevProps.visualFilterExpanded.toString() !== visualFilterExpanded.toString()) {
      // make sure "visual filter hide on scroll" is disabled when changeing hint visibility when props changed, to avoid double toggle
      this.allowHideOnScroll = false

      this.setState({
        hintVisible: !visualFilterExpanded
      })

      // enable "visual filter hide on scroll" again, after some moment
      setTimeout(() => {
        this.allowHideOnScroll = true
      }, 50)
    }
  }

  /**
   * only applicable on next fetch, if available
   */
  get handleFetch () {
    const { products, totalCount, fetchProducts } = this.props
    return (next) => {
      if (products.length < totalCount) {
        fetchProducts().then(() => {
          next()
        })
      } else {
        next()
      }
    }
  }

  get handleScrollChange () {
    const { visualFilterExpanded, toggleVisualFilter } = this.props
    return () => {
      // if user scroll the product list when visual filter is expanded, collapse the visual filter
      if (visualFilterExpanded && this.allowHideOnScroll) {
        toggleVisualFilter(false)
      }
    }
  }

  get showVisualFilter () {
    const { toggleVisualFilter } = this.props
    return () => {
      toggleVisualFilter(true)
    }
  }

  render () {
    const { products, filters, isProductsFetched, nextPage, willBeEmptyList } = this.props
    const { hintVisible } = this.state

    const hint = !hintVisible ? null : (
      <InfoBanner style={styles.infoBanner} className='animated fadeInDown'>
        <h5>Let’s find a style.</h5>
        <p style={{ display: 'inline-block' }}>
          ( Click our visual filter button. ) <img src={ArrowRightSvg} alt='Yesplz Visual Filter Indicator' />
        </p>
        <FloatButton
          id='VisualFilterPreview'
          filters={filters}
          onClick={this.showVisualFilter}
          style={styles.smallVisualFilterButton}
          noShadow
        />
      </InfoBanner>
    )

    return (
      <div className='Tops'>
        <ProductList
          id='MainScroll'
          show={isProductsFetched}
          products={products}
          willBeEmptyList={willBeEmptyList}
          nextPage={nextPage}
          onFetch={this.handleFetch}
          className='Tops-products'
          extraItem={hint}
          onScrollChange={this.handleScrollChange}
        />
      </div>
    )
  }
}

const mapStateToProps = (state, props) => ({
  filters: state.filters.data,
  products: state.products.list,
  totalCount: state.products.totalCount,
  willBeEmptyList: state.products.willBeEmptyList,
  isProductsFetched: state.products.fetched,
  nextPage: state.products.nextPage,
  visualFilterExpanded: state.filters.expanded
})

export default connect(mapStateToProps, { fetchProducts, syncFilter, toggleVisualFilter })(Tops)

const styles = {
  infoBanner: {
    marginTop: -10,
    marginLeft: -5,
    marginRight: -5,
    marginBottom: 8
  },
  smallVisualFilterButton: {
    display: 'inline-block',
    width: 40,
    height: 40,
    paddingTop: 5,
    marginLeft: 7,
    marginTop: -10,
    position: 'static',
    verticalAlign: 'top'
  }
}
