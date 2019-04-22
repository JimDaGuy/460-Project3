import React, { Component } from "react";
import AboutStyles from "./About.module.scss";

class About extends Component {
  render() {
    return (
      <div className={AboutStyles.container}>
        <h1 className={AboutStyles.h1}>About This Site</h1>
        <hr />
        <h2 className={AboutStyles.h2}>What is this?</h2>
        <p className={AboutStyles.p}>
          This site displays multiple different types of data visualizations and
          some info about each of them. It was made by <b>James DiGrazia</b> as
          a project for the IGME Data Visualization class at RIT. Each
          visualization was made with <b>d3</b>. Click on the different images
          on the home page to view more information about them. You can view the
          code for this project on{" "}
          <b>
            <a href="https://github.com/JimDaGuy/460-Project2">Github</a>
          </b>
        </p>
        <h2 className={AboutStyles.h2}>Sources</h2>
        <p className={AboutStyles.p}>
          <ul className={AboutStyles.ul}>
            <li>
              Referenced for some visualization descriptions and generel info:{" "}
              <a href="https://datavizproject.com/">Data Vis Project</a>
            </li>
            <li>
              Referenced for some visualization descriptions and generel info:{" "}
              <a href="https://datavizcatalogue.com/">Data Vis Catalogue</a>
            </li>
            <li>
              Referenced for some visualization descriptions and generel info:{" "}
              <a href="https://www.r-graph-gallery.com/">R Graph gallery</a>
            </li>
            <li>
              Referenced code from class examples for the Force Directed Graph
            </li>
            <li>
              Referenced code for chord chart:{" "}
              <a href="https://blockbuilder.org/mbostock/4062006">Source</a>
            </li>
            <li>
              Referenced code for cluster chart:{" "}
              <a href="https://d3indepth.com/layouts/">Source</a>
            </li>
            <li>
              Referenced code for tree chart:{" "}
              <a href="https://codepen.io/netkuy/pen/qZGdoj?editors=1010">
                Source
              </a>
            </li>
            <li>
              Referenced code for treemap chart:{" "}
              <a href="https://bl.ocks.org/denjn5/bb835c4fb8923ee65a13008832d2efed">
                Source
              </a>
            </li>
            <li>
              Referenced code for map chart:{" "}
              <a href="https://github.com/veltman/d3-stateplane">Source</a>
            </li>
            <li>
              Referenced code for map chart:{" "}
              <a href="http://bl.ocks.org/phil-pedruco/7745589">Source</a>
            </li>
            <li>
              Referenced code for choropleth chart:{" "}
              <a href="http://bl.ocks.org/michellechandra/0b2ce4923dc9b5809922">
                Source
              </a>
            </li>
            <li>
              Referenced code for choropleth chart:{" "}
              <a href="https://github.com/JimDaGuy/460-Project1">Source</a>
            </li>
            <li>
              Geojson for New York used in map Chart:{" "}
              <a href="https://raw.githubusercontent.com/codeforamerica/click_that_hood/master/public/data/new-york-counties.geojson">
                Source
              </a>
            </li>
            <li>
              Geojson for states used in choropleth Chart:{" "}
              <a href="http://enjalot.github.io/wwsd/data/world/world-110m.geojson">
                Source
              </a>
            </li>
          </ul>
        </p>
      </div>
    );
  }
}

export default About;
