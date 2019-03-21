const DONUT_DURATION = 700

import { getLabelPosition } from './util.js'

export default class Lines {
  constructor(selection, props) {
    this.selection = selection
    this.props = props
    const { keyAccessor, pie, arc, outerArc, radius } = props
    this.keyAccessor = keyAccessor
    this.pie = pie
    this.arc = arc
    this.outerArc = outerArc
    this.radius = radius
  }

  draw() {
    this.selection.selectAll('polyline')
      .data(this.pie, this.keyAccessor)
      .enter()
      .append('polyline')
      .attr('points', d => [this.arc.centroid(d), this.outerArc.centroid(d), getLabelPosition(d, this.outerArc, this.radius)])
      .style('opacity', 0)
      .property('__oldData__', d => d)
      .transition()
      .delay(DONUT_DURATION)
      .duration(500)
      .style('opacity', .3)
  }

  update(data) {
    const lineUpdate = this.selection.selectAll('polyline')
      .data(this.pie(data), this.keyAccessor)

    lineUpdate.enter()
      .append('polyline')
      .attr('points', d => [this.arc.centroid(d), this.outerArc.centroid(d), getLabelPosition(d, this.outerArc, this.radius)])
      .style('opacity', 0)
      .property('__oldData__', d => d)
      .transition()
      .duration(500)
      .style('opacity', .3)

    lineUpdate.exit()
        .transition()
        .duration(300)
        .style('opacity', 0)
        .remove()

    const self = this
    lineUpdate
      .transition()
      .duration(500)
      .attrTween('points', function(d) { return self.updateLineTween(d, this) })

  }

  updateLineTween(d, ctx) {
    const { __oldData__ } = ctx
    ctx.__oldData__ = d
    const i = d3.interpolate(__oldData__, d);
    return t => {
      const curr = i(t)
      return [this.arc.centroid(curr), this.outerArc.centroid(curr), getLabelPosition(curr, this.outerArc, this.radius)]
    }
  }

}
