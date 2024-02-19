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
function regionBar(data) {
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

function gamemodeBar(data) {
  const gamemodeMap = new Map();
  for (let i = 0; i < data.length; i++) {
    const gamemode = data[i].Gamemode;
    if (gamemodeMap.has(gamemode)) {
      gamemodeMap.set(gamemode, gamemodeMap.get(gamemode) + data[i].Players);
    } else {
      gamemodeMap.set(gamemode, data[i].Players);
    }
  }
  const chartData = Array.from(gamemodeMap, ([gamemode, players]) => ({Gamemode: gamemode, Players: players}));
  return Plot.barY(chartData, {x: "Gamemode", y: "Players", sort: {x: "-y"}}).plot()
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

function hasPasswordBar(data) {
  const haspasswordMap = new Map();
  for (let i = 0; i < data.length; i++) {
    const haspassword = data[i].HasPassword;
    if (haspasswordMap.has(haspassword)) {
      haspasswordMap.set(haspassword, haspasswordMap.get(haspassword) + data[i].Players);
    } else {
      haspasswordMap.set(haspassword, data[i].Players);
    }
  }
  const chartData = Array.from(haspasswordMap, ([haspassword, players]) => ({HasPassword: haspassword, Players: players}));
  return Plot.barY(chartData, {x: "HasPassword", y: "Players", sort: {x: "-y"}}).plot()
}
```
<div class="grid grid-cols-2">
  <a class="card" style="color: inherit;">
    <h2>Players by region</h2>
    <span class="big">${regionBar(jsonData)}</span>
  </a>
  <a class="card" style="color: inherit;">
    <h2>Players by Gamemode</h2>
    <span class="big">${gamemodeBar(jsonData)}</span>
  </a>
  <a class="card" style="color: inherit;">
    <h2>Players by Map Size</h2>
    <span class="big">${mapSizeBar(jsonData)}</span>
  </a>
  <a class="card" style="color: inherit;">
    <h2>Players by Server Security</h2>
    <span class="big">${hasPasswordBar(jsonData)}</span>
  </a>
</div>

```js
view(jsonData);

Inputs.table(jsonData);
```