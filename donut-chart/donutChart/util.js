export function getMidAngle(d) {
  const { startAngle: s, endAngle: e } = d
  return s + (e - s) / 2
}

export function getLabelPosition(d, outerArc, radius) {
  const pos = outerArc.centroid(d);
  const factor = getMidAngle(d) < Math.PI ? 1 : -1
  pos[0] = radius * 0.95 * factor
  return pos
}

export function getColor(d, { colorScheme, keyAccessor }) {
  return colorScheme(keyAccessor(d))
}

export function tooltip (selection, props) {
  const { tooltipHtml, radius, svg } = props
  selection.on('mouseenter', data => {
    svg.append('text')
      .attr('class', 'toolCircle')
      .attr('dy', -15)
      .html(tooltipHtml(data))
      .style('font-size', '.9em')
      .style('text-anchor', 'middle')

    svg.append('circle')
      .attr('class', 'toolCircle')
      .attr('r', radius * 0.55)
      .style('fill', getColor(data, props))
      .style('fill-opacity', 0.35);
  })

  selection.on('mouseout', function () {
    d3.selectAll('.toolCircle').remove();
  })
}
