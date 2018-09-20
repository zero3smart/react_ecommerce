import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { fetchProducts } from 'ducks/products'
import { syncFilter, toggleVisualFilter } from 'ducks/filters'
import { ProductList } from 'modules/products'
import './products-page.css'

class ProductsPage extends Component {
  static propTypes = {
    products: PropTypes.array,
    totalCount: PropTypes.number,
    isProductsFetched: PropTypes.bool,
    willBeEmptyList: PropTypes.bool,
    nextPage: PropTypes.number,
    visualFilterExpanded: PropTypes.bool,
    initialExpandVisualFilter: PropTypes.bool,
    productBasePath: PropTypes.string,
    className: PropTypes.string,
    renderExtraItem: PropTypes.func.isRequired,
    syncFilter: PropTypes.func.isRequired,
    fetchProducts: PropTypes.func.isRequired,
    toggleVisualFilter: PropTypes.func.isRequired
  }

  static defaultProps = {
    products: [],
    initialExpandVisualFilter: false,
    isProductsFetched: false,
    willBeEmptyList: false,
    renderExtraItem: (containerContext) => (null) // container context
  }

  constructor (props) {
    super(props)
    this.state = {
      extraVisible: true
    }
    this.lastScrollTop = 0
  }

  componentDidMount () {
    const { isProductsFetched, syncFilter, fetchProducts, toggleVisualFilter, initialExpandVisualFilter } = this.props

    // don't need to do initial fetch if products is fetched already
    if (!isProductsFetched) {
      // make sure the filter is synced with localStorage data
      syncFilter()
      fetchProducts(true)
    }

    // if enabled, visual filter will be expanded by default
    if (initialExpandVisualFilter) {
      toggleVisualFilter(true)
      // the hint should be hidden
      this.setState({ extraVisible: false })
    }
  }

  componentDidUpdate (prevProps) {
    const { visualFilterExpanded } = this.props

    // if visual filter is expanded, hide the extra
    if (prevProps.visualFilterExpanded.toString() !== visualFilterExpanded.toString()) {
      this.setState({
        extraVisible: !visualFilterExpanded
      })
    }
  }

  componentWillUnmount () {
    const { toggleVisualFilter } = this.props
    // visual filter should be closed on unmounting
    toggleVisualFilter(false)
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

  get handleTouchMove () {
    const { visualFilterExpanded, toggleVisualFilter } = this.props
    return () => {
      // if user touch scrolling productlist when visual filter visible, hide it.
      if (visualFilterExpanded) {
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
    const { products, isProductsFetched, nextPage, willBeEmptyList, renderExtraItem, productBasePath, className } = this.props
    const { extraVisible } = this.state

    const extra = !extraVisible ? null : renderExtraItem(this)

    return (
      <div className={`ProductsPage ${className}`}>
        <ProductList
          id='MainScroll'
          show={isProductsFetched}
          products={products}
          willBeEmptyList={willBeEmptyList}
          nextPage={nextPage}
          onFetch={this.handleFetch}
          className='ProductsPage-products'
          extraItem={extra}
          productBasePath={productBasePath}
          onTouchMove={this.handleTouchMove}
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

export default connect(mapStateToProps, { fetchProducts, syncFilter, toggleVisualFilter })(ProductsPage)
