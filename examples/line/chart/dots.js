export default class Dot {
  constructor(svg, props) {
    this.svg = svg
    this.props = props
  }

  update(data) {
    const { duration, radius, xScale, yScale, svg } = this.props
    const dotsUpdate = svg.selectAll('.dot').data(data)

    dotsUpdate.enter().call(this.enter)

    dotsUpdate
      .exit()
      .transition()
      .duration(duration.dot)
      .style('opacity', 0)
      .remove()

    dotsUpdate
      .transition()
      .duration(duration.dot)
      .style('opacity', 0)
      .transition()
      .duration(0)
      .attr('cx', (d) => xScale(d.index))
      .attr('cy', (d) => yScale(d.value))
      .attr('r', radius)
      .transition()
      .delay(duration.line - 2 * duration.dot)
      .duration(duration.dot)
      .style('opacity', 1)
  }

  enter = (selection) => {
    const { radius, duration, xScale, yScale } = this.props
    selection
      .append('circle')
      .attr('class', 'dot')
      .attr('cx', (d) => xScale(d.index))
      .attr('cy', (d) => yScale(d.value))
      .attr('r', radius)
      .style('opacity', 0)
      .transition()
      .delay(duration.line)
      .duration(duration.dot)
      .style('opacity', 1)
  }

  draw() {
    const { data, svg } = this.props
    svg.selectAll('.dot').data(data).enter().call(this.enter)
  }
}
