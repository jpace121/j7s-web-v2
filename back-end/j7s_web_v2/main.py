from aiohttp import web
import uuid
import aiohttp
import asyncio
from j7s_api.LightState_pb2 import ChangeRequest, ConnectionAck
from google.protobuf.json_format import Parse, ParseError, MessageToJson
import j7s_web_v2.state_manager as state_manager

routes = web.RouteTableDef()
state_manager = state_manager.StateManager()

@routes.get('/api/')
async def index(request):
    return web.Response(text="j7s-web-v2 backend")

@routes.post("/api/lights")
async def post_lights(request):
    print('Post')
    change_request = None
    try:
        data = await request.text()
        print("Got request: {}".format(data))
        change_request = Parse(data, ChangeRequest())
    except (ParseError) as error:
        print(str(error))
        return web.Response(status=400, text='Bad request.')
    print('Updating state.')
    state_manager.update_state(change_request.data, change_request.uid)
    return web.Response(text='Ok')

@routes.get("/api/lights")
async def get_lights(request):
    light_state = state_manager.get_state()
    return web.Response(status=200, text=MessageToJson(light_state),
                        content_type='application/json')

@routes.get("/api/lights/ws")
async def lights_ws(request):
    ws = web.WebSocketResponse()
    await ws.prepare(request)

    name = str(uuid.uuid4())
    state_manager.add_sub(name, ws)

    # Send to ws it's name and the current state.
    ack = ConnectionAck(uid=name, data=state_manager.get_state())
    await ws.send_str(MessageToJson(ack))

    # Wait for msg from ws...
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


