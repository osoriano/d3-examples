export default class YAxis {
  constructor(svg, props) {
    this.svg = svg
    this.props = props
  }

  update(data) {}

  draw() {
    const { height, yScale, svg } = this.props
    svg.append('g').call(d3.axisLeft(yScale))
  }
}