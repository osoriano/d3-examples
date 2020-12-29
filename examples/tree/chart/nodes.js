export default class Nodes {
  constructor(props) {
    this.props = props
  }

  rootUpdate() {
    const { data, radius, duration, toggleChildren } = this.props

    const nodeUpdate = this.selection
      .selectAll('g')
      .data(data, (d) => d.data.id)

    const nodeEnter = nodeUpdate
      .enter()
      .append('g')
      .attr('class', 'node')
      .attr('transform', this.toExpandFrom)
      .on('click', toggleChildren)

    nodeEnter.transition().duration(duration).attr('transform', this.toPosition)

    nodeEnter.append('circle').style('fill', this.nodeFill).attr('r', radius)

    setTimeout(() => {
      nodeEnter
        .append('text')
        .attr('dy', '.35em')
        .attr('text-anchor', 'middle')
        .text((d) => d.data.name)
    }, duration)

    nodeUpdate
      .transition()
      .duration(duration)
      .attr('transform', this.toPosition)

    nodeUpdate.select('circle').style('fill', this.nodeFill)

    nodeUpdate
      .select('text')
      .attr('text-anchor', 'middle')
      .text((d) => d.data.name)

    const nodeExit = nodeUpdate.exit()

    nodeExit.select('text').remove()

    nodeExit
      .transition()
      .duration(duration)
      .attr('transform', this.toExpandFrom)
      .remove()
  }

  draw() {
    const { data, radius, duration, svg, toggleChildren } = this.props
    this.selection = svg.append('g').attr('class', 'nodes')

    const nodeEnter = this.selection
      .selectAll('g')
      .data(data, (d) => d.data.id)
      .enter()
      .append('g')
      .attr('class', 'node')
      .attr('transform', this.toPosition)
      .on('click', toggleChildren)

    nodeEnter
      .append('circle')
      .attr('r', 0)
      .style('fill', this.nodeFill)
      .transition()
      .duration(duration)
      .attr('r', radius)

    setTimeout(() => {
      nodeEnter
        .append('text')
        .attr('dy', '.35em')
        .attr('text-anchor', 'middle')
        .text((d) => d.data.name)
    }, duration)
  }

  nodeFill(d) {
    d = d.data
    return d._children ? 'lightsteelblue' : 'transparent'
  }

  toPosition(d) {
    return `translate(${d.y},${d.x})`
  }

  toExpandFrom = (d) => {
    const { data } = this.props
    d = data.find((node) => node.data.id === d.data.expandFrom.id)
    return `translate(${d.y},${d.x})`
  }
}
