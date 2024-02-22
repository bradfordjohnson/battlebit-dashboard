---
title: Historical
theme: dashboard
toc: false
---

# Historical server data

```js
async function json(url) {
  const response = await fetch(url);
  if (!response.ok) throw new Error(`fetch failed: ${response.status}`);
  return await response.json();
}
const jsonData = await json("https://raw.githubusercontent.com/bradfordjohnson/battlebit-dashboard/main/data/historicServerData.json");

const firstDate = jsonData[0].date;
const lastIndex = jsonData.length - 1;
const lastDate = jsonData[lastIndex].date;
```

```js
let dataSnapshotCount = jsonData.length;
```

<div class="grid grid-cols-4">
    <a class="card" style="color: inherit;">
        <h2>Data snapshot count</h2>
        <span class="big">${dataSnapshotCount}</span>
        <span class="muted">f</span>
    </a>
    <a class="card" style="color: inherit;">
        <h2>First snapshot at</h2>
        <span class="big">${firstDate}</span>
        <span class="muted">UTC</span>
    </a>
    <a class="card" style="color: inherit;">
        <h2>Latest snapshot at</h2>
        <span class="big">${lastDate}</span>
        <span class="muted">UTC</span>
    </a>
<div class="card">
    <a href="https://github.com/bradfordjohnson/battlebit-dashboard/actions/workflows/logServerData.yaml" target="_blank">
        <h2>Current workflow status</h2>
        <span class="big">
            <img src="https://github.com/bradfordjohnson/battlebit-dashboard/actions/workflows/logServerData.yaml/badge.svg" alt="Description of the image">
        </span>
    </a>
</div>
</div>

```js
view(jsonData);
```

```js
function sumPlayers(data) {
  let sums = {};
  
  // Iterate over the array of objects
  data.forEach(obj => {
    let datetime = obj.date; // Keep date and time as one field
    
    // Calculate sum for each date
    let sumPlayers = obj.data.reduce((acc, curr) => acc + curr.Players, 0);
    let sumQueuePlayers = obj.data.reduce((acc, curr) => acc + curr.QueuePlayers, 0);
    
    // Calculate count of unique names (total servers)
    let uniqueNames = new Set();
    obj.data.forEach(item => {
      uniqueNames.add(item.Name);
    });
    let totalServers = uniqueNames.size;
    
    // Store sums and count for each datetime
    sums[datetime] = { totalPlayers: sumPlayers, totalQueuePlayers: sumQueuePlayers, totalServers };
  });
  
  // Convert sums object to array of objects with datetime and sums
  let result = Object.keys(sums).map(datetime => ({ datetime, ...sums[datetime] }));
  
  return result;
}


let summedData = sumPlayers(jsonData);

view(summedData);
```

```js
function sumPlayersByRegionAndDate(data) {
  let sums = {};
  
  // Iterate over the array of objects
  data.forEach(obj => {
    let datetime = obj.date; // Keep date and time as one field
    
    // Group by Region
    obj.data.forEach(item => {
      let region = item.Region;
      let date = datetime.split(' ')[0]; // Extract date
      
      if (!sums[date]) {
        sums[date] = {};
      }
      
      if (!sums[date][region]) {
        sums[date][region] = { totalPlayers: 0, totalQueuePlayers: 0, totalServers: new Set() };
      }
      
      sums[date][region].totalPlayers += item.Players;
      sums[date][region].totalQueuePlayers += item.QueuePlayers;
      sums[date][region].totalServers.add(item.Name);
    });
  });
  
  // Convert sums object to array of objects with Date, Region, and sums
  let result = [];
  for (let date in sums) {
    for (let region in sums[date]) {
      result.push({
        date,
        region,
        totalPlayers: sums[date][region].totalPlayers,
        totalQueuePlayers: sums[date][region].totalQueuePlayers,
        totalServers: sums[date][region].totalServers.size
      });
    }
  }
  
  return result;
}

let summedDataByRegion = sumPlayersByRegionAndDate(jsonData);
view(summedDataByRegion);
```

```js
function regionLinePlot(data) {
  return Plot.plot({
    color: {legend: true},
    y: {
    grid: true
    },
    marks: [
      Plot.line(data, {x: "date", y: "totalPlayers", stroke: "region"})
    ]
  })
}
function linePlot(data) {
  return Plot.plot({
    y: {
    grid: true
    },
    
    marks: [
      Plot.line(data, {x: "datetime", y: "totalPlayers",  curve: "catmull-rom", stroke: "blue"}),
      Plot.line(data, {x: "datetime", y: "totalQueuePlayers",  curve: "catmull-rom", stroke: "orange"})
    ]
  })
}

function boxplot(data) {
    return Plot.plot({
  y: {
    grid: true,
    inset: 6
  },
  marks: [
    Plot.boxY(data, {x: "region", y: "totalPlayers"})
  ]
})
}
```
<div class="grid grid-cols-2">
    <a class="card" style="color: inherit;">
        <h2>Players by hour</h2>
        <span class="big">${linePlot(summedData)}</span>
    </a>
    <a class="card" style="color: inherit;">
        <h2>Observed daily players</h2>
        <span class="big">${boxplot(summedDataByRegion)}</span>
    <a class="card" style="color: inherit;">
        <h2>Players by date and region</h2>
        <span class="big">${regionLinePlot(summedDataByRegion)}</span>
    </a>
</div>