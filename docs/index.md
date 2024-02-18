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

# BattleBit Remastered Community Servers

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
view(jsonData);
```