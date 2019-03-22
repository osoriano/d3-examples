import { tooltip } from './util.js'

const initialInterpolateStart = {
  startAngle: 0,
  endAngle: 0
}

function getMidAngle(d) {
  return d.startAngle + (d.endAngle - d.startAngle) / 2
}

export default class Slices {
  constructor(selection, props) {
    this.selection = selection
    this.props = props
    const { pie, arc, keyAccessor, colorScheme } = props
    this.pie = pie
    this.arc = arc
    this.keyAccessor = keyAccessor
    this.colorScheme = colorScheme
  }

  draw() {
    const self = this
    this.selection
      .selectAll('path')
      .data(this.pie, this.keyAccessor)
      .enter()
      .append('path')
      .attr('fill', this.colorScheme)
      .attr('d', this.arc)
      .call(d => tooltip(d, this.props))
      .property('__oldData__', d => d)
      .transition()
      .duration(700)
      .attrTween('d', function(d) {
        return self.initialPathTween(d, this)
      })
  }

  update(data) {
    const self = this
    const pathUpdate = this.selection
      .selectAll('path')
      .data(this.pie(data), this.keyAccessor)

    pathUpdate
      .enter()
      .append('path')
      .attr('fill', this.colorScheme)
      .call(s => tooltip(s, this.props))
      .property('__oldData__', d => d)
      .transition()
      .duration(500)
      .attrTween('d', function(d) {
        return self.enterPathTween(d, this)
      })

    pathUpdate
      .exit()
      .transition()
      .duration(300)
      .attrTween('d', self.exitPathTween)
      .remove()

    pathUpdate
      .transition()
      .duration(500)
      .attrTween('d', function(d) {
        return self.updatePathTween(d, this)
      })
  }

  initialPathTween(d, ctx) {
    const interpolate = d3.interpolate(initialInterpolateStart, d)
    return t => this.arc(interpolate(t))
  }

  updatePathTween(d, ctx) {
    const { __oldData__ } = ctx
    ctx.__oldData__ = d
    const i = d3.interpolate(__oldData__, d)
    return t => this.arc(i(t))
  }

  enterPathTween(d, ctx) {
    const midAngle = getMidAngle(d)
    const start = {
      ...d,
      startAngle: midAngle,
      endAngle: midAngle
    }
    ctx.__oldData__ = d
    const i = d3.interpolate(start, d)
    return t => this.arc(i(t))
  }

  exitPathTween = d => {
    const midAngle = getMidAngle(d)
    const end = {
      ...d,
      startAngle: midAngle,
      endAngle: midAngle
    }
    const i = d3.interpolate(d, end)
    return t => this.arc(i(t))
  }
}
