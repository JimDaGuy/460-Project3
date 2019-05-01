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
      year: 2011,
      svg2YAxis: null,
      svg2YAxisGroup: null,
      svg3YAxis: null,
      svg3YAxisGroup: null
    };

    this.changeYear = this.changeYear.bind(this);
    this.setupMap = this.setupMap.bind(this);
    this.showBeat = this.showBeat.bind(this);
    this.visualizeData = this.visualizeData.bind(this);
  }

  componentDidMount() {
    d3.selection.prototype.moveToFront = function() {
      return this.each(function() {
        this.parentNode.appendChild(this);
      });
    };
    d3.selection.prototype.moveToBack = function() {
      return this.each(function() {
        var firstChild = this.parentNode.firstChild;
        if (firstChild) {
          this.parentNode.insertBefore(this, firstChild);
        }
      });
    };

    this.setupMap();
    this.showYear(2011);
  }

  setupMap() {
    const svgWidth = 400;
    const svgHeight = 400;

    let svg = d3
      .select(ReactDOM.findDOMNode(this.refs.d3Content))
      .append("svg")
      .attr("width", `${svgWidth}px`)
      .attr("height", `${svgHeight}px`)
      .attr("id", "svg")
      .style("margin", "10px auto");

    let svg2 = d3
      .select(ReactDOM.findDOMNode(this.refs.d3Content2))
      .append("svg")
      .attr("width", `${svgWidth}px`)
      .attr("height", `${svgHeight}px`)
      .attr("id", "svg2")
      .style("margin", "10px auto");

    let svg2Indent = 55;

    svg2
      .append("text")
      .attr("id", "svg2-title")
      .attr("x", svgWidth / 2)
      .attr("y", svg2Indent / 2)
      .attr("text-anchor", "middle")
      .style("font-weight", "bold")
      .text(`Top Reported Beats`);

    svg2
      .append("text")
      .attr("id", "svg2-y-axis-label")
      .attr("transform", "rotate(-90)")
      .attr("text-anchor", "middle")
      .attr("x", -svgHeight / 2)
      .attr("y", svg2Indent / 2)
      .text("Beat Report Counts");

    let topBeatsYScale = d3
      .scaleLinear()
      .domain([0, 1])
      .range([svgHeight - svg2Indent, svg2Indent]);

    let yAxis = d3.axisLeft(topBeatsYScale).tickFormat(d => `${d / 1000}k`);

    let yAxisGroup = svg2
      .append("g")
      .classed("svg2Y axis", true)
      .attr("transform", `translate(${svg2Indent}, 0)`)
      .call(yAxis);

    this.setState({
      svg2YAxis: yAxis,
      svg2YAxisGroup: yAxisGroup
    });

    svg2
      .selectAll("rect")
      .data([], d => d)
      .enter()
      .append("rect")
      .attr("x", 0)
      .attr("y", 0)
      .attr("width", 0)
      .attr("height", 0)
      .classed("bar", true);

    d3.json("oaklandBeats.json").then(data => {
      let centroid = d3.geoCentroid(data);

      let projection = d3
        .geoMercator()
        .scale([87000])
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

    const lWidth = 150;
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
      .attr("x", 20)
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
      .attr("x", svgWidth - 145)
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
      .attr("x", svgWidth - 145)
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
    d3.select("#loadingSVG2").remove();

    let svg = d3.select("#svg");
    let svg2 = d3.select("#svg2");

    // Add loading spinner
    svg
      .append("rect")
      .attr("id", "loadingSVG")
      .attr("fill", "gray")
      .classed(homeStyles.loadingSVG, true);

    svg2
      .append("rect")
      .attr("id", "loadingSVG2")
      .attr("fill", "gray")
      .classed(homeStyles.loadingSVG, true);

    d3.select("#beatText").text(`Beat: `);

    d3.select("#reportText").text(`Reports: `);

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
    crimeData.totalReports = 0;
    crimeData.maxBeatReports = 0;
    crimeData.beatReportCount = {};

    d3.csv(data, d => {
      if (crimeData.beatReportCount[d.Beat] !== undefined) {
        // Increment count of all reports for the beat
        crimeData.beatReportCount[d.Beat].total++;
        //Check for max beat reports
        if (crimeData.beatReportCount[d.Beat].total > crimeData.maxBeatReports)
          crimeData.maxBeatReports = crimeData.beatReportCount[d.Beat].total;
        // Increment count of incident type descriptions for the beat
        let beatData = crimeData.beatReportCount[d.Beat];
        let incidentTypeDescription = d["Incident Type Description"];

        // Check if typeDescriptions object is defined
        if (beatData.typeDescriptions !== undefined) {
          // Check if Incident Type Description key has been set
          if (beatData.typeDescriptions[incidentTypeDescription] !== undefined)
            beatData.typeDescriptions[incidentTypeDescription]++;
          else {
            beatData.typeDescriptions[incidentTypeDescription] = 1;
          }
        } else {
          beatData.typeDescriptions = {};
          beatData.typeDescriptions[incidentTypeDescription] = 1;
        }
      } else {
        crimeData.beatReportCount[d.Beat] = {};
        crimeData.beatReportCount[d.Beat].typeDescriptions = {};
        crimeData.beatReportCount[d.Beat].typeDescriptions[
          d["Incident Type Description"]
        ] = 1;
        crimeData.beatReportCount[d.Beat].total = 1;
      }

      crimeData.totalReports++;

      return;
    })
      .then(data => {
        // Add list of beats with most crime
        let beatReportCount = crimeData.beatReportCount;
        let topReportedBeats = Object.keys(beatReportCount)
          .sort((a, b) => beatReportCount[b].total - beatReportCount[a].total)
          .slice(0, 10);
        let beatsWithCounts = {};
        beatsWithCounts.list = topReportedBeats;
        for (let i = 0; i < topReportedBeats.length; i++) {
          let beatName = topReportedBeats[i];
          beatsWithCounts[beatName] = beatReportCount[beatName];
        }
        crimeData.topReportedBeats = beatsWithCounts;

        // Add list of most common report descriptions for each beat
        //  Iterate through each beat
        for (let beatKey in beatReportCount) {
          let beat = beatReportCount[beatKey];
          let descriptions = beat.typeDescriptions;
          let topDescriptions = Object.keys(descriptions)
            .sort((a, b) => descriptions[b] - descriptions[a])
            .slice(0, 10);
          beat.topTypeDescriptions = topDescriptions;
        }

        this.visualizeData(crimeData);
      })
      .catch(error => {
        console.dir(error);
      });
  }

  showBeat(crimeData, beat) {
    let svgWidth = 400;
    let svgHeight = 400;
    let svg3Indent = 55;

    let d3Content3 = d3.select(ReactDOM.findDOMNode(this.refs.d3Content3));

    let currentFill = d3Content3.html();

    let beatReports = crimeData.beatReportCount;
    let typeDescriptions = beatReports[beat].typeDescriptions;
    let topTypeDescriptions = beatReports[beat].topTypeDescriptions;

    // If the third content section is empty
    if (currentFill === "") {
      let svg3 = d3Content3
        .append("svg")
        .attr("id", "svg3")
        .attr("width", `${svgWidth}px`)
        .attr("height", `${svgHeight}px`)
        .style("margin", "10px auto");

      svg3
        .append("text")
        .attr("id", "svg2-title")
        .attr("x", svgWidth / 2)
        .attr("y", svg3Indent / 2)
        .attr("text-anchor", "middle")
        .style("font-weight", "bold")
        .text(`Top Report Types`);

      svg3
        .append("text")
        .attr("id", "svg2-y-axis-label")
        .attr("transform", "rotate(-90)")
        .attr("text-anchor", "middle")
        .attr("x", -svgHeight / 2)
        .attr("y", svg3Indent / 2)
        .text("Report Type Counts");

      let topReportsXScale = d3
        .scaleBand()
        .domain(d3.range(topTypeDescriptions.length))
        .range([svg3Indent, svgWidth - svg3Indent])
        .paddingInner(0.1);

      let topReportsYScale = d3
        .scaleLinear()
        .domain([0, typeDescriptions[topTypeDescriptions[0]]])
        .range([svgHeight - svg3Indent, svg3Indent]);

      let yAxis = d3.axisLeft(topReportsYScale).tickFormat(d => d);

      let yAxisGroup = svg3
        .append("g")
        .classed("svg3Y axis", true)
        .attr("transform", `translate(${svg3Indent}, 0)`)
        .call(yAxis);

      this.setState({
        svg3YAxis: yAxis,
        svg3YAxisGroup: yAxisGroup
      });

      svg3
        .selectAll("rect")
        .data(topTypeDescriptions, d => d)
        .enter()
        .append("rect")
        .attr("x", (d, i) => topReportsXScale(i))
        .attr("y", d => topReportsYScale(typeDescriptions[d]))
        .attr(
          "height",
          d => svgHeight - svg3Indent - topReportsYScale(typeDescriptions[d])
        )
        .attr("width", topReportsXScale.bandwidth())
        .classed("bar", true);

      let barText = svg3
        .selectAll(".barText")
        .data(topTypeDescriptions, d => d);

      barText
        .enter()
        .append("text")
        .classed("barText", true)
        .attr("text-anchor", "start")
        .attr("alignment-baseline", "hanging")
        .attr("transform", (d, i) => `translate(${topReportsXScale(i)}, ${svgHeight - svg3Indent})rotate(-90)`)
        .attr("fill", "black")
        .text(d => d)
        .merge(barText)
        .transition()
        .duration(500)
        .attr("text-anchor", "start")
        .attr("alignment-baseline", "hanging")
        .attr("transform", (d, i) => `translate(${topReportsXScale(i)}, ${svgHeight - svg3Indent})rotate(-90)`)
        .attr("fill", "black")
        .text(d => d);

      barText
        .exit()
        .transition()
        .duration(250)
        .style("opacity", 0)
        .remove();
    } else {
      // Update existing bar chart
      let svg3 = d3.select("#svg3");
      let bars = svg3.selectAll("rect").data(topTypeDescriptions, d => d);
      let yAxis = this.state.svg3YAxis;
      let yAxisGroup = this.state.svg3YAxisGroup;

      let topReportsXScale = d3
        .scaleBand()
        .domain(d3.range(topTypeDescriptions.length))
        .range([svg3Indent, svgWidth - svg3Indent])
        .paddingInner(0.1);

      let topReportsYScale = d3
        .scaleLinear()
        .domain([0, typeDescriptions[topTypeDescriptions[0]]])
        .range([svgHeight - svg3Indent, svg3Indent]);

      yAxis.scale(topReportsYScale);
      yAxisGroup
        .transition()
        .duration(500)
        .call(yAxis);

      d3.select("#svg2-title")
        .transition()
        .duration(500)
        .text(`Top Reported Beats - ${crimeData.year}`);

      bars
        .enter()
        .append("rect")
        .classed("bar", true)
        .attr("x", svgWidth)
        .attr("y", d => topReportsYScale(typeDescriptions[d]))
        .attr(
          "height",
          d => svgHeight - svg3Indent - topReportsYScale(typeDescriptions[d])
        )
        .merge(bars)
        .transition()
        .duration(500)
        .attr("x", (d, i) => topReportsXScale(i))
        .attr("y", d => topReportsYScale(typeDescriptions[d]))
        .attr(
          "height",
          d => svgHeight - svg3Indent - topReportsYScale(typeDescriptions[d])
        )
        .attr("width", topReportsXScale.bandwidth());

      let barText = svg3
        .selectAll(".barText")
        .data(topTypeDescriptions, d => d);

      barText
        .enter()
        .append("text")
        .classed("barText", true)
        .attr("text-anchor", "start")
        .attr("alignment-baseline", "hanging")
        .attr("transform", (d, i) => `translate(${topReportsXScale(i)}, ${svgHeight - svg3Indent})rotate(-90)`)
        .attr("fill", "black")
        .text(d => d)
        .merge(barText)
        .transition()
        .duration(500)
        .attr("text-anchor", "start")
        .attr("alignment-baseline", "hanging")
        .attr("transform", (d, i) => `translate(${topReportsXScale(i)}, ${svgHeight - svg3Indent})rotate(-90)`)
        .attr("fill", "black")
        .text(d => d);

      barText
        .exit()
        .transition()
        .duration(250)
        .style("opacity", 0)
        .remove();

      bars
        .exit()
        .transition()
        .duration(250)
        .style("opacity", 0)
        .remove();
    }
  }

  clearBeat() {
    d3.select(ReactDOM.findDOMNode(this.refs.d3Content3)).html("");
  }

  visualizeData(crimeData) {
    console.dir(crimeData);

    // Round up to nearest 200
    let maxCrimes = (Math.floor(crimeData.maxBeatReports / 200) + 1) * 200;

    let svg = d3.select("#svg");
    let svg2 = d3.select("#svg2");
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
    d3.select("#loadingSVG2").remove();

    let dumbThisThing = this;

    beats
      .moveToBack()
      .on("click", function(d, i) {
        let currentBeat = d3.select(this);
        let beatID = currentBeat.attr("id");

        dumbThisThing.showBeat(crimeData, beatID);
      })
      .on("mouseover", function(d, i) {
        let currentBeat = d3.select(this);
        let beatID = currentBeat.attr("id");

        currentBeat.attr("stroke-width", "3");

        d3.select("#beatText").text(`Beat: ${beatID}`);

        if (crimeData.beatReportCount[beatID] !== undefined) {
          let reportCount = crimeData.beatReportCount[beatID].total || "N/A";

          d3.select("#reportText").text(`Reports: ${reportCount}`);
        }
      })
      .on("mouseout", function(d, i) {
        let currentBeat = d3.select(this);

        currentBeat.attr("stroke-width", "1");
      })
      .transition()
      .duration(500)
      .style("fill", function() {
        let currentBeat = d3.select(this);
        let beatID = currentBeat.attr("id");

        if (crimeData.beatReportCount[beatID] !== undefined)
          return colorScale(crimeData.beatReportCount[beatID].total || 0);
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

    let topBeatsList = crimeData.topReportedBeats.list;
    let svg2Width = svg2.node().width.baseVal.value;
    let svg2Height = svg2.node().height.baseVal.value;

    let svg2Indent = 55;

    let topBeatsXScale = d3
      .scaleBand()
      .domain(d3.range(topBeatsList.length))
      .range([svg2Indent, svg2Width - svg2Indent])
      .paddingInner(0.1);

    let topBeatsYScale = d3
      .scaleLinear()
      .domain([0, crimeData.topReportedBeats[topBeatsList[0]].total])
      .range([svg2Height - svg2Indent, svg2Indent]);

    // Update bars and axes for svg2
    let bars = svg2.selectAll("rect").data(topBeatsList, d => d);
    let yAxis = this.state.svg2YAxis;
    let yAxisGroup = this.state.svg2YAxisGroup;

    yAxis.scale(topBeatsYScale);
    yAxisGroup
      .transition()
      .duration(500)
      .call(yAxis);

    d3.select("#svg2-title")
      .transition()
      .duration(500)
      .text(`Top Reported Beats - ${crimeData.year}`);

    bars
      .enter()
      .append("rect")
      .classed("bar", true)
      .attr("x", svg2Width)
      .attr("y", d => topBeatsYScale(crimeData.topReportedBeats[d].total))
      .attr(
        "height",
        d =>
          svg2Height -
          svg2Indent -
          topBeatsYScale(crimeData.topReportedBeats[d].total)
      )
      .merge(bars)
      .transition()
      .duration(500)
      .attr("x", (d, i) => topBeatsXScale(i))
      .attr("y", d => topBeatsYScale(crimeData.topReportedBeats[d].total))
      .attr(
        "height",
        d =>
          svg2Height -
          svg2Indent -
          topBeatsYScale(crimeData.topReportedBeats[d].total)
      )
      .attr("width", topBeatsXScale.bandwidth());

    let barText = svg2.selectAll(".barText").data(topBeatsList, d => d);

    barText
      .enter()
      .append("text")
      .classed("barText", true)
      .attr("x", (d, i) => topBeatsXScale(i))
      .attr("y", d => topBeatsYScale(crimeData.topReportedBeats[d].total) + 15)
      .attr("fill", "white")
      .text(d => d)
      .merge(barText)
      .transition()
      .duration(500)
      .attr("x", (d, i) => topBeatsXScale(i))
      .attr("y", d => topBeatsYScale(crimeData.topReportedBeats[d].total) + 15)
      .attr("fill", "white")
      .text(d => d);

    barText
      .exit()
      .transition()
      .duration(250)
      .style("opacity", 0)
      .remove();

    bars
      .exit()
      .transition()
      .duration(250)
      .style("opacity", 0)
      .remove();
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

    this.clearBeat();
    this.showYear(parseInt(event.target.value));
  }

  render() {
    let { year } = this.state;

    return (
      <div className={homeStyles.container}>
        <h1 className={homeStyles.h1}>Visualizing Crime in Oakland CA</h1>
        <p className={homeStyles.welcomeP}>
          These charts visualize{" "}
          <a
            target="_blank"
            rel="noopener noreferrer"
            href="https://www.kaggle.com/cityofoakland/oakland-crime-statistics-2011-to-2016"
          >
            crime report data
          </a>{" "}
          in Oakland, CA from 2011 to 2016 using{" "}
          <a target="_blank" rel="noopener noreferrer" href="https://d3js.org/">
            D3.js
          </a>
          . Made by{" "}
          <a
            target="_blank"
            rel="noopener noreferrer"
            href="https://github.com/JimDaGuy"
          >
            James DiGrazia
          </a>
          . Github repository available{" "}
          <a
            target="_blank"
            rel="noopener noreferrer"
            href="https://github.com/JimDaGuy/460-Project3"
          >
            here
          </a>
          .
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
        <span className={homeStyles.span1}>
          Click on a beat to see more info about it
        </span>
        <div className={homeStyles.d3Content3} ref="d3Content3" />
        <div className={homeStyles.d3Content2} ref="d3Content2" />
      </div>
    );
  }
}

export default Home;
