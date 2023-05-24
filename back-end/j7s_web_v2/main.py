from aiohttp import web
import uuid
import aiohttp
import asyncio
import pydantic
from j7s_api.LightState_pb2 import LightState
from google.protobuf.json_format import Parse, MessageToJson
import j7s_web_v2.state_manager as state_manager

routes = web.RouteTableDef()
state_manager = state_manager.StateManager()

@routes.get('/api/')
async def index(request):
    return web.Response(text="j7s-web-v2 backend")

@routes.post("/api/lights/{index:\d+}")
async def post_lights(request):
    print('Post')
    light_index = int(request.match_info['index'])
    if light_index >= state_manager.get_num_lights():
        return web.Response(status=400, text='Light index too big.')
    light_state = None
    try:
        data = await request.json()
        print(data)
        light_state = await request.json(loads = lambda x: Parse(x, LightState))
    except pydantic.ValidationError:
        return web.Response(status=400, text='Bad request.')
    print('Updating state.')
    state_manager.update_state(light_index, light_state)
    return web.Response(text='Ok')

@routes.get("/api/lights/{index:\d+}")
async def get_lights(request):
    light_index = int(request.match_info['index'])
    if light_index >= state_manager.get_num_lights():
        return web.Response(status=400, text='Light index too big.')
    light_state = None
    try:
        light_state = state_manager.get_state(light_index)
    except Exception:
        return web.Response(status=500, text='Could not get state')
    return web.Response(status=200, text=MessageToJson(light_state),
                        content_type='application/json')

@routes.get("/api/lights/ws")
async def lights_ws(request):
    ws = web.WebSocketResponse()
    await ws.prepare(request)

    name = uuid.uuid4()
    state_manager.add_sub(name, ws)

    async for msg in ws:
        if msg.type == aiohttp.WSMsgType.CLOSE:
            await ws.close()

    # Closed at this point.
    print('ws closed')
    state_manager.rm_sub(name)
    return ws


async def webrunner():
    global routes

    app = web.Application()
    app.add_routes(routes)
    runner = web.AppRunner(app)
    await runner.setup()

    site = web.TCPSite(runner, 'localhost', 8080)
    await site.start()

    while True:
        await asyncio.sleep(3600)

async def loop():
    await asyncio.gather(webrunner())

def main():
    asyncio.run(loop())

if __name__ == '__main__':
    main()


