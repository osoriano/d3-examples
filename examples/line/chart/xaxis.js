export default class XAxis {
  constructor(props) {
    this.props = props;
  }

  dataUpdate() {
    const { duration, xScale } = this.props;
    this.axis.transition().duration(duration.line).call(d3.axisBottom(xScale));
  }

  draw() {
    const { height, xScale, svg } = this.props;
    this.axis = svg
      .append("g")
      .attr("transform", `translate(0, ${height})`)
      .call(d3.axisBottom(xScale));
  }
}
