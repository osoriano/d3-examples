export default class Edges {
  constructor(props) {
    this.props = props;
    this.diagonal = d3
      .linkHorizontal()
      .x((d) => d.y)
      .y((d) => d.x);

    /* Add stroke-width to radius */
    this.outerRadius = props.radius + 2;
  }

  rootUpdate() {
    const { data, duration } = this.props;

    const edge = this.selection
      .selectAll("path")
      .data(data.slice(1), (d) => d.data.id);

    edge
      .enter()
      .insert("path", "g")
      .attr("class", "link")
      .attr("d", this.toExpandFrom)
      .merge(edge)
      .transition()
      .duration(duration)
      .attr("d", this.parentToChild);

    edge
      .exit()
      .transition()
      .duration(duration)
      .attr("d", this.toExpandFrom)
      .remove();
  }

  toExpandFrom = (d) => {
    const { diagonal, outerRadius, props } = this;
    const { data } = props;
    d = data.find((node) => node.data.id === d.data.expandFrom.id);
    const source = { x: d.x, y: d.y + outerRadius };
    const target = source;
    return diagonal({ source, target });
  };

  parentToChild = (d) => {
    const { diagonal, outerRadius } = this;
    const source = { x: d.parent.x, y: d.parent.y + outerRadius };
    const target = { x: d.x, y: d.y - outerRadius };
    return diagonal({ source, target });
  };

  draw() {
    const { data, duration, svg } = this.props;
    this.selection = svg.append("g").attr("class", "edges");

    /* Fade in */
    this.selection
      .selectAll("path")
      .data(data.slice(1), (d) => d.data.id)
      .enter()
      .insert("path", "g")
      .attr("class", "link")
      .attr("d", this.parentToChild)
      .attr("opacity", 0)
      .transition()
      .duration(duration)
      .attr("opacity", 1);
  }
}
