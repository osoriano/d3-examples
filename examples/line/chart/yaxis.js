export default class YAxis {
  constructor(props) {
    this.props = props
  }

  dataUpdate() {}

  draw() {
    const { height, yScale, svg } = this.props
    svg.append('g').call(d3.axisLeft(yScale))
  }
}
