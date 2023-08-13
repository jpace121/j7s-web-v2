from j7s_api.LightState_pb2 import LightState, LightStateList
from google.protobuf.json_format import MessageToJson
import json
import asyncio


class StateManager():
    def __init__(self):
        self._num_lights = 6
        default_state = LightState(color='off', brightness=1.0)
        self._light_states = LightStateList()
        for index in range(0, self._num_lights):
            self._light_states.data.append(default_state)
        # TODO: Can this be a set?
        self._subs = {}
        self._update_tasks = set()

    def get_num_lights(self):
        return self._num_lights

    def get_state(self):
        return self._light_states

    def update_state(self, light_states, sender):
        if not sender in self._subs.keys():
            print("Don't know of sender {}".format(sender))
            return
        self._light_states = light_states
        self.update_subs(light_states, sender)

    def add_sub(self, name, ws):
        print('Add sub')
        self._subs[name] = ws

    def rm_sub(self, name):
        self._subs.pop(name, None)

    def update_subs(self, light_states, sender):
        task = asyncio.create_task(self._update_subs_coroutine(light_states, sender))
        self._update_tasks.add(task)
        task.add_done_callback(self._update_tasks.discard)

    async def _update_subs_coroutine(self, light_states, sender):
        for (name, ws) in self._subs.items():
            print('Sending to {} from {}'.format(name, sender))
            await ws.send_str(MessageToJson(light_states))
