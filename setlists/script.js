import * as d3 from "https://cdn.jsdelivr.net/npm/d3@7/+esm";

const container = document.querySelector('#container');
const tourSelect = document.querySelector('#tourSelect');
const tourValidateButton = document.querySelector('#tourValidate');
const modal = document.querySelector('#modal');

// Read data
const data = await d3.json("simple_setlist_data.json");

// Populate tour select dropdown
data.forEach((tour, i) => {
    const option = document.createElement('option');

    option.value = i;
    option.text = tour.name;

    tourSelect.add(option);
});
tourValidateButton.disabled = false;

// Build graph
tourSelect.onchange = buildGraph;
tourValidateButton.onclick = buildGraph;

function buildGraph() {
    const width = 1920;
    const height = 900;
    const marginTop = 20;
    const marginRight = 20;
    const marginBottom = 30;
    const marginLeft = 30;

    const tourIndex = tourSelect.value;
    const tour = data[tourIndex];
    const tourName = tour.name;
    const byShow = tour.byshow;
    const bySong = tour.bysong;
    const points = [];
    const lines = [];

    const x = d3.scalePoint()
        .domain(byShow.map((show, i) => `${show.city} (${show.country}) ${i}`))
        .rangeRound([0, 1700])
        .align(0);

    const svg = d3.create("svg")
        .attr("width", width)
        .attr("height", height)
        .attr("viewBox", [0, 0, width, height])
        .attr("style", "max-width: 100%; height: auto; overflow: visible; font: 10px sans-serif;");

    // Add the horizontal axis.
    svg.append("g")
        .attr("transform", `translate(0, ${marginTop + 100})`)
        .call(d3.axisTop(x).ticks(width / 80).tickSizeOuter(0))
        .selectAll("text")  
        .style("text-anchor", "start")
        .attr("dx", "1em")
        .attr("dy", "0.4em")
        .attr("transform", "rotate(-45)");

    // Remove anti-duplicate labels
    svg.selectAll('.tick > text').text((name) => name.substr(0, name.lastIndexOf(" ")));

    for (const song in bySong) {
        const color = `hsl(${Math.random() * 360},100%,50%)`;
        const symbol = [d3.symbolCircle, d3.symbolCross, d3.symbolDiamond, d3.symbolSquare, 
            d3.symbolStar, d3.symbolTriangle, d3.symbolWye][Math.floor(Math.random() * 7)];

        const line = d3.line()
            .defined((pos) => pos != null)
            .x((pos, i) => x(`${byShow[i].city} (${byShow[i].country}) ${i}`))
            .y((pos) => 145 + 800/30*pos);

        lines.push({
            'song': song,
            'path': svg.append("path")
            .attr("fill", "none")
            .attr("stroke", color)
            .attr("stroke-width", 1.5)
            .attr("d", line(bySong[song]))
        });

        bySong[song].forEach((pos, i) => {
            if (pos == null) return;

            points.push({
                'x': x(`${byShow[i].city} (${byShow[i].country}) ${i}`),
                'y': 145 + 800/30*pos,
                'song': song,
                'show': `${byShow[i].city} (${byShow[i].country}) ${i}`,
                'point': svg.selectAll()
                    .data([[pos, i]])
                    .enter()
                    .append("path")
                    .attr("d", (t) => d3.symbol().type(symbol).size(64)())
                    .attr("transform", (t) => 
                        `translate(${x(`${byShow[t[1]].city} (${byShow[t[1]].country}) ${t[1]}`)}, 
                                ${145 + (800 / 30) * t[0]})`
                    )
                    .attr("fill", color)
            });
        });
        /*svg.selectAll()
            .data(bySong[song].map((pos, i) => [pos, i]).filter((t) => t[0] != null))
            .enter()
            .append("path")
            .attr("d", (t) => d3.symbol().type(symbol).size(64)())
            .attr("transform", (t) => 
                `translate(${x(`${byShow[t[1]].city} (${byShow[t[1]].country}) ${t[1]}`)}, 
                           ${145 + (800 / 30) * t[0]})`
            )
            .attr("fill", color);*/   
    }

    svg
      .on("pointermove", pointermoved)
      .on("pointerleave", pointerleft)
      .on("touchstart", event => event.preventDefault());

    function pointermoved(event) {
        const [xm, ym] = d3.pointer(event);
        const i = d3.leastIndex(points, (p) => Math.hypot(p.x - xm, p.y - ym));
        const dist = Math.hypot(points[i].x - xm, points[i].y - ym);

        if (dist < 30) {
            lines.forEach((line) => {
                if (line['song'] == points[i].song) {
                    line['path'].style("mix-blend-mode", "multiply").style("stroke", null).style("stroke-opacity", 1);
                } else {
                    line['path'].style("mix-blend-mode", null).style("stroke-opacity", 0.3);//style("stroke", "#ddd");
                }
            });
            points.forEach((point) => {
                if (point.song == points[i].song) {
                    point.point.style("mix-blend-mode", "multiply").style("stroke", null).style("stroke-opacity", 1);
                    point.point.style("mix-blend-mode", "multiply").style("fill", null).style("fill-opacity", 1);
                } else {
                    point.point.style("mix-blend-mode", null).style("stroke-opacity", 0.3);//style("stroke", "#ddd");
                    point.point.style("mix-blend-mode", null).style("fill-opacity", 0.3); //style("fill", "#ddd").
                }
            });

            modal.innerHTML = points[i].song;
            modal.style.display = "block";
            console.log(`${points[i].x} px`, `${points[i].y} px`);
            modal.style.left = `${event.pageX}px`;
            modal.style.top = `${event.pageY - 40}px`;
        } else {
            pointerleft();
        }
    }
    function pointerleft() {
        lines.forEach((line) => {
            line['path'].style("mix-blend-mode", "multiply").style("stroke", null).style("stroke-opacity", 1);
        });
        points.forEach((point) => {
            point.point.style("mix-blend-mode", "multiply").style("stroke", null).style("stroke-opacity", 1);
            point.point.style("mix-blend-mode", "multiply").style("fill", null).style("fill-opacity", 1);
        });
        modal.style.display = "none";
    }

    container.innerHTML = "";
    container.append(svg.node());
}