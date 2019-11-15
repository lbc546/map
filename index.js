'use strict';

const width = 800;
const height = 800;

const svg = d3.select("body")
    .append("svg")
    .attr("width", width)
    .attr("height", height);

let albersProjection = d3.geoAlbers()
    .scale(190000)
    .rotate([71.057, 0])
    .center([0, 42.313])
    .translate([width/2, height/2]);

let geoPath = d3.geoPath()
    .projection(albersProjection)

d3.json('./data/neighborhoods.json', (map) => {
    svg.append("g").selectAll("path")
    .data(map.features)
    .enter()
    .append("path")
    .attr("fill", "#ccc")
    .attr("d", geoPath)

    d3.json('./data/points.json', (data) => {
        let points = svg.append("g")
            .selectAll("path")
            .data(data.features)
            .enter()
            .append("path")
            .attr("id", "points")
            .attr('fill', 'skyblue')
            .attr('stroke', 'black')
            .attr('d', geoPath);

            makeLine(data);
    })
});

function makeLine(data) {
    let linePoints = [];

    let d = data.features
    for (let i = 0; i < d.length; i++) {
        linePoints.push({
            x: albersProjection(d[i].geometry.coordinates)[0],
            y: albersProjection(d[i].geometry.coordinates)[1]
        })
    }

    let line = d3.line()
        .x(function (d) {return d.x;})
        .y(function (d) {return d.y;})

    let path = svg.append("path")
        .attr("d", line(linePoints))
        .attr("stroke", "Black")
        .attr("stroke-width", "3")
        .attr("fill", "none");

    let totalLength = path.node().getTotalLength();

    path
        .attr("stroke-dasharray", path.node().getTotalLength() + " " + path.node().getTotalLength())
        .attr("stroke-dashoffset", path.node().getTotalLength())
        .transition()
        .duration(6000)
        .ease(d3.easeLinear)
        .attr("stroke-dashoffset", 0);
};
