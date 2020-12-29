export default class YAxis {
  constructor(props) {
    this.props = props
  }

  draw() {
    const { yScale, svg } = this.props
    svg.append('g').call(d3.axisLeft(yScale))
  }
}
