---
theme: dashboard
toc: false
---

```js
async function json(url) {
  const response = await fetch(url);
  if (!response.ok) throw new Error(`fetch failed: ${response.status}`);
  return await response.json();
}
const jsonData = await json("https://publicapi.battlebit.cloud/Servers/GetServerList");
```

```js
function sumPlayers(data) {
  let sum = 0;
  for (let i = 0; i < data.length; i++) {
    sum += data[i].Players;
  }
  return sum;
}

function sumQueuePlayers(data) {
  let sum = 0;
  for (let i = 0; i < data.length; i++) {
    sum += data[i].QueuePlayers;
  }
  return sum;
}

function uniqueMapCount(data) {
  const mapSet = new Set();
  for (let i = 0; i < data.length; i++) {
    mapSet.add(data[i].Map);
  }
  return mapSet.size;
}

let serverCount = jsonData.length;

let playerCount = sumPlayers(jsonData);

let queueCount = sumQueuePlayers(jsonData);

let mapCount = uniqueMapCount(jsonData);
```

# BattleBit Remastered current status

<div class="grid grid-cols-4">
<a class="card" style="color: inherit;">
    <h2>Players in game</h2>
    <span class="big">${playerCount}</span>
    <span class="muted">f</span>
  </a>
  <a class="card" style="color: inherit;">
    <h2>Players in queue</h2>
    <span class="big">${queueCount}</span>
    <span class="muted">f</span>
  </a>
  <a class="card" style="color: inherit;">
    <h2>Community servers</h2>
    <span class="big">${serverCount}</span>
    <span class="muted">f</span>
  </a>
  <a class="card" style="color: inherit;">
    <h2>Unique maps</h2>
    <span class="big">${mapCount}</span>
    <span class="muted">f</span>
  </a>
</div>

```js
function createDoughnutChart(data) {
    // Parse data and group by "Region"
    const groupedData = d3.group(data, d => d.Region);

    // Prepare data for doughnut chart
    const doughnutData = Array.from(groupedData, ([key, value]) => ({ Region: key, Count: value.length }));

    // Set up SVG dimensions and margins
    const width = 600;
    const height = 400;
    const margin = 40;

    // Set up radius
    const radius = Math.min(width, height) / 2 - margin;

    // Create SVG
    const svg = d3.create("svg")
        .attr("width", width)
        .attr("height", height)
        .append("g")
        .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");

    // Create color scale
    const color = d3.scaleOrdinal()
        .domain(doughnutData.map(d => d.Region))
        .range(d3.schemeCategory10);

    // Create arc generator
    const arc = d3.arc()
        .innerRadius(radius * 0.5)
        .outerRadius(radius * 0.8);

    // Create pie generator
    const pie = d3.pie()
        .value(d => d.Count);

    // Draw slices
    const arcs = svg.selectAll("arc")
        .data(pie(doughnutData))
        .enter()
        .append("g")
        .attr("class", "arc");

    // Append paths
    arcs.append("path")
        .attr("d", arc)
        .attr("fill", d => color(d.data.Region))
        .attr("stroke", "white")
        .style("stroke-width", "2px");

    // Add labels
    arcs.append("text")
        .attr("transform", d => "translate(" + arc.centroid(d) + ")")
        .attr("text-anchor", "middle")
        .text(d => `${d.data.Region}: ${d.data.Count}`);

    // Add color key
    const legend = svg.selectAll(".legend")
        .data(color.domain())
        .enter().append("g")
        .attr("class", "legend")
        .attr("transform", (d, i) => "translate(0," + i * 20 + ")");

    legend.append("rect")
        .attr("x", width / 2 - 18)
        .attr("width", 18)
        .attr("height", 18)
        .style("fill", color);

    legend.append("text")
        .attr("x", width / 2 - 24)
        .attr("y", 9)
        .attr("dy", ".35em")
        .style("text-anchor", "end")
        .text(d => d);

    return svg.node();
}
```

```js
view(jsonData);
```