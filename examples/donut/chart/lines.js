import { getLabelPosition } from './util.js'

export default class Lines {
  constructor(props) {
    this.props = props
    const { keyAccessor, pie, arc, outerArc, radius } = props
    this.keyAccessor = keyAccessor
    this.pie = pie
    this.arc = arc
    this.outerArc = outerArc
    this.radius = radius
  }

  draw() {
    const { svg } = this.props
    this.selection = svg.append('g').attr('class', 'lines')

    this.selection
      .selectAll('polyline')
      .data(this.pie, this.keyAccessor)
      .enter()
      .append('polyline')
      .attr('points', (d) => [
        this.arc.centroid(d),
        this.outerArc.centroid(d),
        getLabelPosition(d, this.outerArc, this.radius),
      ])
      .style('opacity', 0)
      .property('__oldData__', (d) => d)
      .transition()
      .delay(700)
      .duration(500)
      .style('opacity', 0.3)
  }

  dataUpdate() {
    const { data } = this.props
    const lineUpdate = this.selection
      .selectAll('polyline')
      .data(this.pie(data), this.keyAccessor)

    lineUpdate
      .enter()
      .append('polyline')
      .attr('points', (d) => [
        this.arc.centroid(d),
        this.outerArc.centroid(d),
        getLabelPosition(d, this.outerArc, this.radius),
      ])
      .style('opacity', 0)
      .property('__oldData__', (d) => d)
      .transition()
      .duration(500)
      .style('opacity', 0.3)

    lineUpdate.exit().transition().duration(300).style('opacity', 0).remove()

    const self = this
    lineUpdate
      .transition()
      .duration(500)
      .attrTween('points', function (d) {
        return self.updateLineTween(d, this)
      })
  }

  updateLineTween(d, ctx) {
    const { __oldData__ } = ctx
    ctx.__oldData__ = d
    const i = d3.interpolate(__oldData__, d)
    return (t) => {
      const curr = i(t)
      return [
        this.arc.centroid(curr),
        this.outerArc.centroid(curr),
        getLabelPosition(curr, this.outerArc, this.radius),
      ]
    }
  }
}
