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

  componentDidMount() {
    this.setupMap();
    this.showYear(2011);
  }

  setupMap() {
    const svgWidth = 1000;
    const svgHeight = 1000;

    let svg = d3
      .select(ReactDOM.findDOMNode(this.refs.d3Content))
      .append("svg")
      .attr("width", `${svgWidth}px`)
      .attr("height", `${svgHeight}px`)
      .attr("id", "svg");

    d3.json("oaklandBeats.json").then(data => {
      let centroid = d3.geoCentroid(data);

      let projection = d3
        .geoMercator()
        .scale([ 210000 ])
        .translate([svgWidth / 2, svgHeight / 2])
        .center(centroid);

      let path = d3
        .geoPath()
        .projection(projection);

      // Draw counties
      svg
        .selectAll("path")
        .data(data.features)
        .enter()
        .append("path")
        .attr("d", path)
        .attr("fill", "lightblue")
        .attr("stroke", "black");
        });
    }

  showYear(year) {
    let data;
    switch(year) {
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

    d3.csv(data, d => {
      return {
        agency: d.Agency,
        createdTime: new Date(d['Create Time']),
        closedTime: new Date(d['Closed Time']),
        location: d.Location,
        beat: d.Beat,
        priority: parseInt(d.Priority),
        incidentTypeId: d['Incident Type Id'],
        incidentTypeDescription: d['Incident Type Description'],
        eventNumber: d['Event Number']
      };
    })
      .then(data => {
        this.visualizeData(data);
      })
      .catch(error => {
        console.dir(error);
      });
  }

  visualizeData(dataset) {
    console.dir(dataset);
  }

  render() {
    return (
      <div className={homeStyles.container}>
        <div className={homeStyles.header}></div>
        <div className={homeStyles.d3Content} ref="d3Content" />
      </div>
    );
  }
}

export default Home;
