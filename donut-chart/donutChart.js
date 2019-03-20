const DONUT_DURATION = 700

function midAngle(d) {
  return d.startAngle + (d.endAngle - d.startAngle) / 2
}

const interpolateStart = {
  startAngle: 0,
  endAngle: 0
}

export default function donutChart() {
  function chart(selection) {
    const {
      colorScheme,
      cornerRadius,
      height,
      labelHtml,
      padAngle,
      tooltipHtml,
      valueAccessor,
      width
    } = chart.props

    const radius = Math.min(width, height) / 2

    /* Maps raw data to d3.arc input */
    const pie = d3.pie()
      .value(valueAccessor)
      .sort(null) // Keep original order (don't sort)

    /* Given angle input, return svg path data */
    const arc = d3.arc()
      .outerRadius(radius * 0.8)
      .innerRadius(radius * 0.6)
      .cornerRadius(cornerRadius)
      .padAngle(padAngle)

    /* arc text label line bend */
    const outerArc = d3.arc()
      .outerRadius(radius * 0.9)
      .innerRadius(radius * 0.9)

    const halfWidth = width / 2
    const halfHeight = height / 2

    selection.each(data => {
      const svg = selection.append('svg')
        .attr('width', width)
        .attr('height', height)
        .append('g')
        .attr('transform', `translate(${halfWidth},${halfHeight})`)

      /* donut slices */
      const path = svg.append('g')
        .attr('class', 'slices')
        .selectAll('path')
        .data(pie)
        .enter()
        .append('path')
        .attr('fill', getColor)
        .attr('d', arc)
        .call(tooltip)
        .transition()
        .duration(DONUT_DURATION)
        .attrTween('d', d => {
          const interpolate = d3.interpolate(interpolateStart, d);
          /* As t ranges from 0 to 1, arc will
           * be interpolated throughout range */
          return t => arc(interpolate(t));
        })

      /* add text labels */
      const label = svg.append('g')
        .attr('class', 'labelName')
        .selectAll('text')
        .data(pie)
        .enter()
        .append('text')
        .attr('dy', '.35em')
        .html(labelHtml)
        .attr('transform', d => `translate(${getLabelPosition(d)})`)
        .style('text-anchor', d => midAngle(d) < Math.PI ? 'start' : 'end')
        .style('opacity', 0)
        .call(tooltip)
        .transition()
        .delay(DONUT_DURATION)
        .duration(500)
        .style('opacity', 1)

      /* Line from slice centroid, to outer arc, to label */
      const polyline = svg.append('g')
        .attr('class', 'lines')
        .selectAll('polyline')
        .data(pie)
        .enter()
        .append('polyline')
        .attr('points', d => [arc.centroid(d), outerArc.centroid(d), getLabelPosition(d)])
        .style('opacity', 0)
        .transition()
        .delay(DONUT_DURATION)
        .duration(500)
        .style('opacity', .3)

      function getLabelPosition(d) {
        const pos = outerArc.centroid(d);
        const factor = midAngle(d) < Math.PI ? 1 : -1
        pos[0] = radius * 0.95 * factor
        return pos
      }

      function getColor(d) {
        return colorScheme(valueAccessor(d.data))
      }

      function tooltip(selection) {
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
            .style('fill', getColor(data))
            .style('fill-opacity', 0.35);
        })

        selection.on('mouseout', function () {
          d3.selectAll('.toolCircle').remove();
        })
      }

    })
  }

  /* Getter and setters following "Towards Reusable Charts" */

  // Default props
  chart.props = {
    colorScheme: d3.scaleOrdinal(d3.schemeCategory10),
    cornerRadius: 3,
    height: 500,
    labelHtml: d => d.data,
    padAngle: 0.015,
    tooltipHtml: d => d.data,
    valueAccessor: d => d,
    width: 960
  }

  // Getters/setters for props
  for (const prop in chart.props) {
    chart[prop] = value => {
      if (value == null) {
        return chart.props[prop]
      }
      chart.props[prop] = value
      return chart
    }
  }

  return chart
}
