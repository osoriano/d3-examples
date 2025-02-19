import Slices from "./slices.js";
import Lines from "./lines.js";
import Labels from "./labels.js";

const defaultColorScheme = d3.scaleOrdinal(d3.schemeCategory10);

/* Inspired by "Towards Reusable Charts" */
export default class DonutChart {
  constructor() {
    /* Default props */
    this.props = {
      colorScheme: (d) => defaultColorScheme(this.props.keyAccessor(d)),
      cornerRadius: 3,
      height: 500,
      labelHtml: (d) => d.data,
      padAngle: 0.015,
      tooltipHtml: (d) => d.data,
      tooltipOffset: () => -15,
      valueAccessor: (d) => d,
      keyAccessor: (d) => d,
      width: 960,
      data: [],
    };

    /* Getters/setters (with updates) for props */
    for (const prop in this.props) {
      this[prop] = (value) => {
        if (value === undefined) {
          return this.props[prop];
        }
        this.props[prop] = value;
        if (typeof this[`${prop}Update`] === "function") {
          this[`${prop}Update`]();
        }
        return this;
      };
    }
  }

  _dataUpdate() {
    this.slices.dataUpdate();
    this.lines.dataUpdate();
    this.labels.dataUpdate();
  }

  setDerivedProps(selection) {
    const { props } = this;
    const { cornerRadius, data, height, padAngle, valueAccessor, width } =
      props;
    props.radius = Math.min(width, height) / 2;

    /* Maps raw data to d3.arc input */
    props.pie = d3.pie().value(valueAccessor).sort(null); // Keep original order (don't sort)

    /* Given angle input, return svg path data */
    props.arc = d3
      .arc()
      .outerRadius(props.radius * 0.8)
      .innerRadius(props.radius * 0.6)
      .cornerRadius(cornerRadius)
      .padAngle(padAngle);

    /* arc text label line bend */
    props.outerArc = d3
      .arc()
      .outerRadius(props.radius * 0.9)
      .innerRadius(props.radius * 0.9);

    const halfWidth = width / 2;
    const halfHeight = height / 2;

    props.svg = selection
      .datum(data)
      .append("svg")
      .attr("viewBox", `0 0 ${width} ${height}`)
      /* Display at top center */
      .attr("preserveAspectRatio", "xMidYMin")
      .append("g")
      .attr("transform", `translate(${halfWidth},${halfHeight})`);
  }

  draw = (selection) => {
    this.setDerivedProps(selection);

    /* donut slices */
    this.slices = new Slices(this.props);
    this.slices.draw();

    /* Text labels */
    this.labels = new Labels(this.props);
    this.labels.draw();

    /* Line from slice centroid, to outer arc, to label */
    this.lines = new Lines(this.props);
    this.lines.draw();

    /* Allow updates after first call */
    this.dataUpdate = this._dataUpdate;
  };
}
