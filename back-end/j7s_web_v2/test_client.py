import aiohttp
import asyncio
import json

# Connect to websocket and wait for my name.
# Send a new state.
# Listen for other states.
# I should not see my new state.
# I you start another client, I should see their new state.

async def handle_ws(session, ws):
    connection_ack = await ws.receive_json()
    print("Act: {}".format(connection_ack))
    name = connection_ack["uid"]
    print("Init state: {}".format(connection_ack["data"]))

    change_request = {"uid": name, "data": my_state()}
    data = json.dumps(change_request).encode('ascii')
    print("Posting: {}".format(data))

    resp = await session.post('http://localhost:8080/api/lights', data=data)
    print(resp)

    async for msg in ws:
        if msg.type == aiohttp.WSMsgType.TEXT:
            print('Text:')
            print(msg.data)
        else:
            return

def my_state():
    default_state = {"color": "pink", "brightness": 1.0}
    state_list = {"data": []}
    for i in range(0, 6):
        state_list["data"].append(default_state)
    return state_list

async def run():
    async with aiohttp.ClientSession() as session:
        async with session.ws_connect('http://localhost:8080/api/lights/ws') as ws:
            await handle_ws(session, ws)
def main():
    asyncio.run(run())

if __name__ == '__main__':
    main()
