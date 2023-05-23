import aiohttp
import asyncio

async def run():
    async with aiohttp.ClientSession() as session:
        async with session.ws_connect('http://localhost:9000/api/lights/ws') as ws:
            while True:
                print('In with')
                async for msg in ws:
                    print('New message.')
                    if msg.type == aiohttp.WSMsgType.TEXT:
                        print('Text:')
                        print(msg.data)
                    elif msg.type == aiohttp.WSMsgType.ERROR:
                        print('Error')
                        break
                    else:
                        print('Not sure what to do with this type.')

async def send():
    data = b'{"color": "red", "brightness": 0.8}'
    while True:
        async with aiohttp.ClientSession() as session:
            resp = await session.post('http://localhost:9000/api/lights/1', data=data)
        await asyncio.sleep(0.1)

async def gather():
    await asyncio.gather(send())

def main():
    asyncio.run(gather())

if __name__ == '__main__':
    main()
