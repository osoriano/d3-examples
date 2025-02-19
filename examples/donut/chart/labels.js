import { getMidAngle, getLabelPosition, tooltip } from "./util.js";

export default class Labels {
  constructor(props) {
    this.props = props;
    const { keyAccessor, pie, outerArc, labelHtml, radius } = props;
    this.keyAccessor = keyAccessor;
    this.pie = pie;
    this.outerArc = outerArc;
    this.labelHtml = labelHtml;
    this.radius = radius;
  }

  draw() {
    const { svg } = this.props;
    this.selection = svg.append("g").attr("class", "labelName");

    this.selection
      .selectAll("text")
      .data(this.pie, this.keyAccessor)
      .enter()
      .append("text")
      .attr("dy", ".35em")
      .html(this.labelHtml)
      .attr(
        "transform",
        (d) => `translate(${getLabelPosition(d, this.outerArc, this.radius)})`,
      )
      .style("text-anchor", (d) => (getMidAngle(d) < Math.PI ? "start" : "end"))
      .style("opacity", 0)
      .call((d) => tooltip(d, this.props))
      .property("__oldData__", (d) => d)
      .transition()
      .delay(700)
      .duration(500)
      .style("opacity", 1);
  }

  dataUpdate() {
    const { data } = this.props;
    const labelUpdate = this.selection
      .selectAll("text")
      .data(this.pie(data), this.keyAccessor);

    labelUpdate
      .enter()
      .append("text")
      .attr("dy", ".35em")
      .html(this.labelHtml)
      .attr(
        "transform",
        (d) => `translate(${getLabelPosition(d, this.outerArc, this.radius)})`,
      )
      .style("text-anchor", (d) => (getMidAngle(d) < Math.PI ? "start" : "end"))
      .style("opacity", 0)
      .call((d) => tooltip(d, this.props))
      .property("__oldData__", (d) => d)
      .transition()
      .duration(500)
      .style("opacity", 1);

    labelUpdate.exit().transition().duration(300).style("opacity", 0).remove();

    const self = this;
    labelUpdate
      .html(this.labelHtml)
      .transition()
      .duration(500)
      .attrTween("transform", function attrTween(d) {
        return self.updateLabelTween(d, this);
      })
      .styleTween("text-anchor", this.updateLabelStyleTween);
  }

  updateLabelTween(d, ctx) {
    const { __oldData__ } = ctx;
    ctx.__oldData__ = d;
    const i = d3.interpolate(__oldData__, d);
    return (t) =>
      `translate(${getLabelPosition(i(t), this.outerArc, this.radius)})`;
  }

  updateLabelStyleTween(d) {
    const { __oldData__ } = this;
    this.__oldData__ = d;
    const i = d3.interpolate(__oldData__, d);
    return (t) => (getMidAngle(i(t)) < Math.PI ? "start" : "end");
  }
}
