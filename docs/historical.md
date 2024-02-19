---
title: Historical
theme: dashboard
toc: false
---

# Historical

```js
async function json(url) {
  const response = await fetch(url);
  if (!response.ok) throw new Error(`fetch failed: ${response.status}`);
  return await response.json();
}
const jsonData = await json("https://raw.githubusercontent.com/bradfordjohnson/battlebit-dashboard/main/data/historicServerData.json");

view(jsonData);
```