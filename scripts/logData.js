const fs = require('fs');

async function json(url) {
    const response = await fetch(url);
    if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
    }
    return response.json();
}

const data = {
    observations: [],
    add: function (object) {
        const id = new Date().getTime();
        const existingObservation = this.observations.find(observation => observation.id === id);
        if (existingObservation) {
            existingObservation.data.push(object);
        } else {
            const newObservation = { id: id, data: [object] };
            this.observations.push(newObservation);
        }
    },
    readJsonFile: function (fileName) {
        try {
            const data = fs.readFileSync(fileName, 'utf8');
            const jsonData = JSON.parse(data);
            this.observations = jsonData.observations || [];
        } catch (err) {
            console.error(err);
        }
    },
    saveJsonFile: function (fileName) {
        try {
            const data = JSON.stringify({ observations: this.observations }, null, 2);
            fs.writeFileSync(fileName, data);
            console.log('Data has been saved to', fileName);
        } catch (err) {
            console.error(err);
        }
    },
    fetchDataAndUpdate: async function (fileName, url) {
        this.readJsonFile(fileName);
        try {
            const newData = await json(url);
            newData.forEach(item => { this.add(item) });
        } catch (err) {
            console.error(err);
        }
    }
};

data.fetchDataAndUpdate('historicServerData.json', 'https://publicapi.battlebit.cloud/Servers/GetServerList');