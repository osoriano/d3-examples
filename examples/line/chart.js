/* Inspired by "Towards Reusable Charts" */
export default class LineChart {
  constructor() {
    /* Default props */
    this.props = {
      margin: { top: 50, right: 50, bottom: 50, left: 50 },
      width: 700,
      height: 500,
      duration: { line: 1000, dot: 500 },
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

  _dataUpdate(data) {
    console.log('Updating data not yet implemented')
  }

  setDerivedProps() {
    const { props } = this
    const { width, height, margin } = props
    props.totalWidth = width + margin.left + margin.right
    props.totalHeight = height + margin.top + margin.bottom
  }

  call = (selection) => {
    this.setDerivedProps()

    const {
      margin,
      width,
      height,
      totalWidth,
      totalHeight,
      duration,
      radius,
      data,
    } = this.props

    const svg = selection
      .datum(data)
      .append('svg')
      .attr('viewBox', `0 0 ${totalWidth} ${totalHeight}`)
      .attr('preserveAspectRatio', 'xMinYMin')
      .append('g')
      .attr('transform', `translate(${margin.left}, ${margin.top})`)

    /* X axis */
    const xScale = d3
      .scaleLinear()
      .domain([0, data.length - 1]) /* Input */
      .range([0, width]) /* Output */

    svg
      .append('g')
      .attr('transform', `translate(0, ${height})`)
      .call(d3.axisBottom(xScale))

    /* Y axis */
    const yScale = d3
      .scaleLinear()
      .domain([0, 1]) /* Input */
      .range([height, 0]) /* Output */

    svg.append('g').call(d3.axisLeft(yScale))

    /* Line */
    const line = d3
      .line()
      .x((_, i) => xScale(i))
      .y(yScale)
      .curve(d3.curveMonotoneX) /* Smoothen line */

    const linePath = svg
      .append('path')
      .datum(data)
      .attr('class', 'line')
      .attr('d', line)

    /* Animate line drawing
     * See:
     * https://medium.com/@louisemoxy/create-a-d3-line-chart-animation-336f1cb7dd61
     * https://jakearchibald.com/2013/animated-line-drawing-svg/ */
    const pathLength = linePath.node().getTotalLength()
    linePath
      .attr('stroke-dashoffset', pathLength)
      .attr('stroke-dasharray', pathLength)
      .transition()
      .ease(d3.easeSin)
      .duration(duration.line)
      .attr('stroke-dashoffset', 0)

    /* Dots */
    svg
      .selectAll('.dot')
      .data(data)
      .enter()
      .append('circle')
      .attr('class', 'dot')
      .attr('cx', (d, i) => xScale(i))
      .attr('cy', yScale)
      .attr('r', radius)
      .style('opacity', 0)
      .transition()
      .delay(duration.line)
      .duration(duration.dot)
      .style('opacity', 1)

    /* Allow updates after first call */
    this.dataUpdate = this._dataUpdate
  }
}
