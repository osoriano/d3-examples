import Dots from './dots.js'
import Path from './path.js'
import XAxis from './xaxis.js'
import YAxis from './yaxis.js'

/* Inspired by "Towards Reusable Charts" */
export default class LineChart {
  constructor() {
    /* Default props */
    this.props = {
      margin: { top: 50, right: 50, bottom: 50, left: 50 },
      width: 700,
      height: 500,
      duration: { line: 1000, dot: 400 },
      radius: 5,
      data: [],
    }

    /* Getters/setters (with updates) for props */
    for (const prop in this.props) {
      this[prop] = (value) => {
        if (value === undefined) {
          return this.props[prop]
        }
        this.props[prop] = value
        if (typeof this[`${prop}Update`] === 'function') {
          this[`${prop}Update`](value)
        }
        return this
      }
    }
  }

  _dataUpdate() {
    const { data, xScale, oldXScale } = this.props
    const oldDomain = xScale.domain()
    const lastIndex = data[data.length - 1].index
    const newDomain = [0, lastIndex]

    oldXScale.domain(oldDomain)
    xScale.domain(newDomain)

    this.xaxis.dataUpdate()
    this.path.dataUpdate()
    this.dots.dataUpdate()
  }

  setDerivedProps(selection) {
    const { props } = this
    const { width, height, margin, data } = props
    const totalWidth = width + margin.left + margin.right
    const totalHeight = height + margin.top + margin.bottom
    props.totalWidth = totalWidth
    props.totalHeight = totalHeight

    /* Assumes some data is present */
    const lastIndex = data[data.length - 1].index
    props.xScale = d3
      .scaleLinear()
      .domain([0, lastIndex]) /* Input */
      .range([0, width]) /* Output */

    /* Keep old x scale for transitions that need it */
    props.oldXScale = d3
      .scaleLinear()
      .domain([0, lastIndex]) /* Input */
      .range([0, width]) /* Output */

    props.yScale = d3
      .scaleLinear()
      .domain([0, 1]) /* Input */
      .range([height, 0]) /* Output */
    props.svg = selection
      .datum(data)
      .append('svg')
      .attr('viewBox', `0 0 ${totalWidth} ${totalHeight}`)
      .attr('preserveAspectRatio', 'xMinYMin')
      .append('g')
      .attr('transform', `translate(${margin.left}, ${margin.top})`)
  }

  draw = (selection) => {
    this.setDerivedProps(selection)
    const { props } = this

    this.xaxis = new XAxis(props)
    this.xaxis.draw()

    this.yaxis = new YAxis(props)
    this.yaxis.draw()

    this.path = new Path(props)
    this.path.draw()

    this.dots = new Dots(props)
    this.dots.draw()

    /* Allow updates after first call */
    this.dataUpdate = this._dataUpdate
  }
}
