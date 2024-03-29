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
const sumPlayers = data => data.reduce((acc, d) => acc + d.Players, 0);

const sumQueuePlayers = data => data.reduce((acc, d) => acc + d.QueuePlayers, 0);

const uniqueMapCount = data => new Set(data.map(d => d.Map)).size;

let serverCount = jsonData.length;

let playerCount = sumPlayers(jsonData);

const historicalData = await json("https://raw.githubusercontent.com/bradfordjohnson/battlebit-dashboard/main/data/historicServerData.json");

const latestHistoricalObservation = historicalData.slice(-1)[0];

const latestHistoricalPlayers = latestHistoricalObservation.data.reduce((acc, d) => acc + d.Players, 0);

const latestHistoricalQueuePlayers = latestHistoricalObservation.data.reduce((acc, d) => acc + d.QueuePlayers, 0);

const formatDifference = (a, b) => {
  const diff = a - b;

  if(diff >= 0){
    return `+${diff}`;
  } else {
    return diff
  }
}

const diffInPlayers = formatDifference(playerCount,latestHistoricalPlayers);

const diffInQueuePlayers = formatDifference(sumQueuePlayers(jsonData),latestHistoricalQueuePlayers);

const diffInServers = formatDifference(serverCount,latestHistoricalObservation.data.length);

const diffInMaps = formatDifference(uniqueMapCount(jsonData),uniqueMapCount(latestHistoricalObservation.data));

let queueCount = sumQueuePlayers(jsonData);

let mapCount = uniqueMapCount(jsonData);

function selectKeys(originalObject, keysToSelect) {
    // Check if originalObject is not null, undefined, or an empty object
    if (!originalObject || typeof originalObject !== 'object' || Object.keys(originalObject).length === 0) {
        return {};
    }
    
    return Object.fromEntries(
        Object.entries(originalObject)
            .filter(([key, value]) => keysToSelect.includes(key))
    );
}

const keysToSelect = ['Name', 'Players', 'QueuePlayers', 'Region', 'Map', 'Gamemode'];

// Assuming jsonData is defined elsewhere in your code

const jsonTable = jsonData.map(obj => selectKeys(obj, keysToSelect));
```

# BattleBit current server data

<div class="grid grid-cols-4">
<a class="card" style="color: inherit;">
    <h2>Players in game</h2>
    <span class="big">${playerCount}</span>
    <span class="muted">${diffInPlayers}</span>
  </a>
  <a class="card" style="color: inherit;">
    <h2>Players in queue</h2>
    <span class="big">${queueCount}</span>
    <span class="muted">${diffInQueuePlayers}</span>
  </a>
  <a class="card" style="color: inherit;">
    <h2>Community servers</h2>
    <span class="big">${serverCount}</span>
    <span class="muted">${diffInServers}</span>
  </a>
  <a class="card" style="color: inherit;">
    <h2>Unique maps</h2>
    <span class="big">${mapCount}</span>
    <span class="muted">${diffInMaps}</span>
  </a>
</div>

<div class="grid grid-cols-1">
<a class="card" style="color: inherit;">
<h2>Current online servers</h2>
 <span class="big">${Inputs.table(jsonTable, {sort: "Players", reverse: true})}</span>
 </a>
</div>

```js

const regionBar = data => {
  const regionMap = new Map();
  for (let i = 0; i < data.length; i++) {
    const region = data[i].Region;
    if (regionMap.has(region)) {
      regionMap.set(region, regionMap.get(region) + data[i].Players);
    } else {
      regionMap.set(region, data[i].Players);
    }
  }
  const chartData = Array.from(regionMap, ([region, players]) => ({Region: region, Players: players}));
  return Plot.barY(chartData, {x: "Region", y: "Players", sort: {x: "-y"}}).plot()
}

function mapSizeBar(data) {
  const mapsizeMap = new Map();
  for (let i = 0; i < data.length; i++) {
    const mapsize = data[i].MapSize;
    if (mapsizeMap.has(mapsize)) {
      mapsizeMap.set(mapsize, mapsizeMap.get(mapsize) + data[i].Players);
    } else {
      mapsizeMap.set(mapsize, data[i].Players);
    }
  }
  const chartData = Array.from(mapsizeMap, ([mapsize, players]) => ({MapSize: mapsize, Players: players}));
  return Plot.barY(chartData, {x: "MapSize", y: "Players", sort: {x: "-y"}}).plot()
}
```
<div class="grid grid-cols-2">
  <a class="card" style="color: inherit;">
    <h2>Players by region</h2>
    <span class="big">${regionBar(jsonData)}</span>
  </a>
<!----  <a class="card" style="color: inherit;">
    <h2>Players by Gamemode</h2>
    <span class="big">${gamemodeBar(jsonData)}</span>
  </a>---->
  <a class="card" style="color: inherit;">
    <h2>Players by Map Size</h2>
    <span class="big">${mapSizeBar(jsonData)}</span>
  </a>
</div>

# Historical server data

```js
const firstDate = historicalData[0].date;
const lastIndex = historicalData.length - 1;
const lastDate = historicalData[lastIndex].date;

let dataSnapshotCount = historicalData.length;
```

<div class="grid grid-cols-4">
    <a class="card" style="color: inherit;">
        <h2>Data snapshot count</h2>
        <span class="big">${dataSnapshotCount}</span>
        <span class="muted"></span>
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
function sumPlayers(data) {
  let sums = {};
  
  // Iterate over the array of objects
  data.forEach(obj => {
    let datetime = new Date(obj.date).getTime(); // Convert string datetime to milliseconds since UNIX epoch
    
    // Initialize sums for this datetime
    let sumPlayers = 0;
    let sumQueuePlayers = 0;
    
    // Iterate over each item in the nested data array
    obj.data.forEach(item => {
      sumPlayers += item.Players;
      sumQueuePlayers += item.QueuePlayers;
    });

    // Store sums for each datetime
    sums[datetime] = { sumPlayers, sumQueuePlayers };
  });
  
  // Convert sums object to array of objects with datetime and sums
  let result = Object.keys(sums).map(datetime => ({
    datetime: parseInt(datetime), // Convert back to integer
    sumPlayers: sums[datetime].sumPlayers,
    sumQueuePlayers: sums[datetime].sumQueuePlayers
  }));
  
  return result;
}

let summedData = sumPlayers(historicalData);
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

let summedDataByRegion = sumPlayersByRegionAndDate(historicalData);
```

```js
function regionLinePlot(data) {
  return Plot.plot({
    color: {legend: true},
    x: { type: "utc", grid: true },
    y: {grid: true},
    marks: [
      Plot.line(data, {x: "date", y: "totalPlayers", curve: "natural", stroke: "region"}),
      Plot.crosshair(data, {x: "date", y: "totalPlayers", color: "region"})
    ]
  })
}

const linePlot = (data) => {
  const maxPlayers = Math.max(...data.map(d => d.sumPlayers));
  return Plot.plot({
    x: { type: "utc", grid: true },
    y: {grid: true},
    marks: [
      Plot.ruleY([0]),
      Plot.line(data, { x: "datetime", y: "sumPlayers", curve: "natural", stroke: "blue" }),
      Plot.crosshair(data, {x: "datetime", y: "sumPlayers", color: "blue"})
    ]
  });
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
        <h2>Players by date and region</h2>
        <span class="big">${regionLinePlot(summedDataByRegion)}</span>
    </a>
    <a class="card" style="color: inherit;">
        <h2>Observed daily players</h2>
        <span class="big">${boxplot(summedDataByRegion)}</span>
    </a>
</div>