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
<a class="card" style="color: inherit;">
<h2>Current workflow status</h2>
<span class="big"><img src="https://github.com/bradfordjohnson/battlebit-dashboard/actions/workflows/logServerData.yaml/badge.svg" alt="Description of the image"></span>
</a>
</div>

```js
view(jsonData);
```