import requests
from datetime import datetime
import json
import os

def main(file_path, url):
    response = requests.get(url)
    if response.status_code == 200:
        content = response.json()

        data_with_timestamp = {}
        data_with_timestamp['date'] = datetime.now().strftime('%Y-%m-%d %H:%M:%S')
        data_with_timestamp['data'] = content

        file_exists = os.path.exists(file_path)
      
        if file_exists:
            with open(file_path, 'r', encoding='utf-8') as file:
                existing_data = json.load(file)
        else:
            existing_data = []

        existing_data.append(data_with_timestamp)

        with open(file_path, 'w', encoding='utf-8') as file:
            json.dump(existing_data, file, ensure_ascii=False, indent=4)

        print(f'Data saved to {file_path}.')
    else:
        print(
            'Failed to retrieve data from the server. Status code:',
            response.status_code,
        )


main('data/historicServerData.json', 'https://publicapi.battlebit.cloud/Servers/GetServerList')
