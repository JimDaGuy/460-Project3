import React, { Component } from "react";
import ReactDOM from "react-dom";
import homeStyles from "./Home.module.scss";
import * as d3 from "d3";

// import data from "../data/fullCrime.csv";
import data2011 from "../data/2011crime.csv";
import data2012 from "../data/2012crime.csv";
import data2013 from "../data/2013crime.csv";
import data2014 from "../data/2014crime.csv";
import data2015 from "../data/2015crime.csv";
import data2016 from "../data/2016crime.csv";

class Home extends Component {
  constructor(props) {
    super(props);

    this.state = {
      year: 2011
    };

    this.changeYear = this.changeYear.bind(this);
  }

  componentDidMount() {
    this.setupMap();
    this.showYear(2011);
  }

  setupMap() {
    const svgWidth = 500;
    const svgHeight = 500;

    let svg = d3
      .select(ReactDOM.findDOMNode(this.refs.d3Content))
      .append("svg")
      .attr("width", `${svgWidth}px`)
      .attr("height", `${svgHeight}px`)
      .attr("id", "svg")
      .style("margin", "10px auto");
    // .style("background-color", "lightgray");

    d3.json("oaklandBeats.json").then(data => {
      let centroid = d3.geoCentroid(data);

      let projection = d3
        .geoMercator()
        .scale([110000])
        .translate([svgWidth / 2, svgHeight / 2])
        .center(centroid);

      let path = d3.geoPath().projection(projection);

      // Draw counties
      svg
        .selectAll("path")
        .data(data.features)
        .enter()
        .append("path")
        .attr("d", path)
        .attr("id", d => d.properties.Name)
        .attr("fill", "white")
        .attr("stroke", "black");
    });

    // Setup legend
    // Gradient
    let legend = svg
      .append("defs")
      .append("svg:linearGradient")
      .attr("id", "gradient")
      .attr("x1", "0%")
      .attr("y1", "100%")
      .attr("x2", "100%")
      .attr("y2", "100%")
      .attr("spreadMethod", "pad");

    legend
      .append("stop")
      .attr("offset", "0%")
      .attr("stop-color", "#f2f0f7")
      .attr("stop-opacity", 1);

    legend
      .append("stop")
      .attr("offset", "20%")
      .attr("stop-color", "#dadaeb")
      .attr("stop-opacity", 1);

    legend
      .append("stop")
      .attr("offset", "40%")
      .attr("stop-color", "#bcbddc")
      .attr("stop-opacity", 1);

    legend
      .append("stop")
      .attr("offset", "60%")
      .attr("stop-color", "#9e9ac8")
      .attr("stop-opacity", 1);

    legend
      .append("stop")
      .attr("offset", "80%")
      .attr("stop-color", "#756bb1")
      .attr("stop-opacity", 1);

    legend
      .append("stop")
      .attr("offset", "100%")
      .attr("stop-color", "#54278f")
      .attr("stop-opacity", 1);

    const lWidth = 200;
    const lHeight = 20;
    // Legend Rect
    svg
      .append("rect")
      .attr("width", lWidth)
      .attr("height", lHeight)
      .style("fill", "url(#gradient)")
      .style("stroke", "black")
      .attr("transform", `translate( ${svgWidth - lWidth - 30}, ${45})`);

    // Legend title
    svg
      .append("text")
      .attr("x", 25)
      .attr("y", 37.5)
      .attr("dominant-baseline", "middle")
      .attr("fill", "black")
      .attr("id", "titleText")
      .style("font-size", "25px")
      .style("font-weight", "bold")
      .text("Year |");

    // Legend top text
    svg
      .append("text")
      .attr("x", svgWidth - lWidth - 25)
      .attr("y", 37.5)
      .attr("dominant-baseline", "middle")
      .attr("fill", "black")
      .attr("id", "topText")
      .style("font-size", "13px")
      .style("font-weight", "bold")
      .text(`All Crime Reports`);

    // Low text
    svg
      .append("text")
      .attr("x", svgWidth - lWidth - 25)
      .attr("y", 55)
      .attr("dominant-baseline", "middle")
      .attr("fill", "black")
      .attr("id", "lowText")
      .style("font-size", "11px")
      .style("font-weight", "bold")
      .text(`Loading..`);

    // High text
    svg
      .append("text")
      .attr("x", svgWidth - 35)
      .attr("y", 55)
      .attr("dominant-baseline", "middle")
      .attr("text-anchor", "end")
      .attr("fill", "black")
      .attr("id", "highText")
      .style("font-size", "11px")
      .style("font-weight", "bold")
      .text(`Loading..`);

    // Beat text
    svg
      .append("text")
      .attr("x", svgWidth - 155)
      .attr("y", 105)
      .attr("dominant-baseline", "middle")
      .attr("fill", "black")
      .attr("id", "beatText")
      .style("font-size", "13px")
      .style("font-weight", "bold")
      .text(`Beat: `);

    // Beat Reports text
    svg
      .append("text")
      .attr("x", svgWidth - 155)
      .attr("y", 125)
      .attr("dominant-baseline", "middle")
      .attr("fill", "black")
      .attr("id", "reportText")
      .style("font-size", "13px")
      .style("font-weight", "bold")
      .text(`Reports:`);
  }

  showYear(year) {
    // Remove existing spinners
    d3.select("#loadingSVG").remove();

    let svg = d3.select("#svg");
    // Add loading spinner
    svg
      .append("rect")
      .attr("id", "loadingSVG")
      .attr("fill", "gray")
      .classed(homeStyles.loadingSVG, true);

    d3.select("#beatText")
      .text(`Beat: `);

    d3.select("#reportText")
      .text(`Reports: `);

    let data;
    switch (year) {
      case 2011:
        data = data2011;
        break;
      case 2012:
        data = data2012;
        break;
      case 2013:
        data = data2013;
        break;
      case 2014:
        data = data2014;
        break;
      case 2015:
        data = data2015;
        break;
      case 2016:
        data = data2016;
        break;
      default:
        data = data2011;
        break;
    }

    let crimeData = {};
    crimeData.year = year;
    crimeData.totalReports = {};

    d3.csv(data, d => {
      if (crimeData.totalReports[d.Beat] !== undefined) crimeData.totalReports[d.Beat]++;
      else crimeData.totalReports[d.Beat] = 1;

      return {
        agency: d.Agency,
        createdTime: new Date(d["Create Time"]),
        closedTime: new Date(d["Closed Time"]),
        location: d.Location,
        beat: d.Beat,
        priority: parseInt(d.Priority),
        incidentTypeId: d["Incident Type Id"],
        incidentTypeDescription: d["Incident Type Description"],
        eventNumber: d["Event Number"]
      };
    })
      .then(data => {
        this.visualizeData(crimeData);
      })
      .catch(error => {
        console.dir(error);
      });
  }

  visualizeData(crimeData) {
    // Round up to nearest 200
    let maxCrimes =
      (Math.floor(d3.max(Object.values(crimeData.totalReports)) / 200) + 1) * 200;

    /*
    console.dir(dataset);
    console.dir(totalReports);
    console.dir(maxCrimes);
    */

    let svg = d3.select("#svg");
    let beats = svg.selectAll("path");

    let colorScale = d3
      .scaleLinear()
      .domain([
        0,
        maxCrimes * 0.2,
        maxCrimes * 0.4,
        maxCrimes * 0.6,
        maxCrimes * 0.8,
        maxCrimes
      ])
      .range([
        "#f2f0f7",
        "#dadaeb",
        "#bcbddc",
        "#9e9ac8",
        "#756bb1",
        "#54278f"
      ]);

    // Remove existing spinners
    d3.select("#loadingSVG").remove();

    beats
      .on("mouseover", function(d, i) {
        let currentBeat = d3.select(this);
        let beatID = currentBeat.attr("id");

        d3.select("#beatText")
          .transition()
          .duration(500)
          .text(`Beat: ${beatID}`);

        let reportCount = crimeData.totalReports[beatID] || "N/A";

        d3.select("#reportText")
          .transition()
          .duration(500)
          .text(`Reports: ${reportCount}`);
      })
      .transition()
      .duration(500)
      .style("fill", function() {
        let currentBeat = d3.select(this);
        let beatID = currentBeat.attr("id");

        return colorScale(crimeData.totalReports[beatID] || 0);
      });

    d3.select("#titleText")
      .transition()
      .duration(500)
      .text(`Year | ${crimeData.year}`);

    d3.select("#lowText")
      .transition()
      .duration(500)
      .text("0");

    d3.select("#highText")
      .transition()
      .duration(500)
      .text(maxCrimes);
  }

  changeYear(event) {
    this.setState({
      year: event.target.value
    });

    let svg = d3.select("#svg");
    let beats = svg.selectAll("path");

    beats.style("fill", "white");

    d3.select("#titleText")
      .transition()
      .duration(500)
      .text(`Year | `);

    d3.select("#lowText")
      .transition()
      .duration(500)
      .text("Loading..");

    d3.select("#highText")
      .transition()
      .duration(500)
      .text("Loading..");

    this.showYear(parseInt(event.target.value));
  }

  render() {
    let { year } = this.state;

    return (
      <div className={homeStyles.container}>
        <div className={homeStyles.header} />
        <h1 className={homeStyles.h1}>Visualizing Crime in Oakland CA</h1>
        <p className={homeStyles.welcomeP}>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Morbi
          bibendum, arcu eu finibus rutrum, massa mi tristique orci, a tempus
          turpis nibh tincidunt eros. Sed lacinia tempus dignissim.
        </p>
        <div className={homeStyles.sliderContainer}>
          <input
            type="range"
            min="2011"
            max="2016"
            value={year}
            onChange={this.changeYear}
            className={homeStyles.slider}
            id="oaklandYear"
          />
          <div className={homeStyles.sliderValue}>{year}</div>
        </div>
        <div className={homeStyles.d3Content} ref="d3Content" />
      </div>
    );
  }
}

export default Home;
