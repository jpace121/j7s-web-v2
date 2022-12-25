from aiohttp import web
import aiohttp
import pydantic
from j7s_web_v2.types import LightState
import j7s_web_v2.global_state as global_state

routes = web.RouteTableDef()
app_state = global_state.GlobalState()

@routes.get('/')
async def index(request):
    return web.Response(text="j7s-web-v2 backend")

@routes.post("/lights/{index:\d+}")
async def post_lights(request):
    light_index = int(request.match_info['index'])
    if light_index >= global_state.NUM_LIGHTS:
        return web.Response(status=400, text='Light index too big.')
    light_state = None
    try:
        light_state = await request.json(loads=LightState.parse_raw)
    except pydantic.ValidationError:
        return web.Response(status=400, text='Bad request.')
    app_state.set_state(light_index, light_state)
    return web.Response(text='Ok')

@routes.get("/lights/{index:\d+}")
async def get_lights(request):
    light_index = int(request.match_info['index'])
    if light_index >= global_state.NUM_LIGHTS:
        return web.Response(status=400, text='Light index too big.')
    light_state = None
    try:
        light_state = app_state.get_state(light_index)
    except Exception:
        return web.Response(status=500, text='Could not get state')
    return web.Response(status=200, text=light_state.json(),
                        content_type='application/json')

def main():
    global routes

    app = web.Application()
    app.add_routes(routes)
    web.run_app(app)
