const DOT_CLASS = "dot";
export default class Dot {
  constructor(props) {
    this.props = props;
  }

  dataUpdate() {
    const { data, duration, radius, xScale, yScale, svg } = this.props;
    const dotsUpdate = svg.selectAll(`.${DOT_CLASS}`).data(data);

    dotsUpdate.enter().call(this.enter);

    dotsUpdate
      .exit()
      .transition()
      .duration(duration.dot)
      .style("opacity", 0)
      .remove();

    dotsUpdate
      .filter(this.updateFilter)
      .property("__oldData__", (d) => d)
      .transition()
      .duration(duration.dot)
      .style("opacity", 0)
      .transition()
      .duration(0)
      .attr("cx", (d) => xScale(d.index))
      .attr("cy", (d) => yScale(d.value))
      .attr("r", radius)
      .transition()
      .delay(duration.line - duration.dot)
      .duration(duration.dot)
      .style("opacity", 1);
  }

  /* Filter update events for points with the same value, to
   * avoid unnecessary transition.
   *
   * Runs with the d3 element as the context */
  updateFilter(d) {
    const { __oldData__ } = this;
    return d.value !== __oldData__.value;
  }

  enter = (selection) => {
    const { radius, duration, xScale, yScale } = this.props;
    selection
      .append("circle")
      .attr("class", DOT_CLASS)
      .attr("cx", (d) => xScale(d.index))
      .attr("cy", (d) => yScale(d.value))
      .attr("r", radius)
      .property("__oldData__", (d) => d)
      .style("opacity", 0)
      .transition()
      .delay(duration.line)
      .duration(duration.dot)
      .style("opacity", 1);
  };

  draw() {
    const { data, svg } = this.props;
    svg.selectAll(`.${DOT_CLASS}`).data(data).enter().call(this.enter);
  }
}
