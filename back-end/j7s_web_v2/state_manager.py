from j7s_api.LightState_pb2 import LightState, LightStateList
from google.protobuf.json_format import MessageToJson
import json
import asyncio


class StateManager():
    def __init__(self):
        default_state = LightState(color='off', brightness=1.0)
        self._light_states = [default_state, default_state, default_state,
                              default_state, default_state, default_state]
        # TODO: Can this be a set?
        self._subs = {}
        self._update_tasks = set()

    def get_num_lights(self):
        return 6

    def update_state(self, index, light_state):
        if index >= len(self._light_states) or index < 0:
            raise 'Invalid index.'
        self._light_states[index] = light_state

        self.update_subs()

    def get_state(self, index):
        if index >= len(self._light_states) or index < 0:
            raise 'Invalid index.'
        return self._light_states[index]

    def get_global_state(self):
        light_state_list = LightStateList()
        for state in self._light_states:
            light_state_list.data.add(brightness=state.brightness, color=state.color)
        return light_state_list

    def add_sub(self, name, ws):
        print('Add sub')
        self._subs[name] = ws

    def rm_sub(self, name):
        self._subs.pop(name, None)

    def update_subs(self):
        task = asyncio.create_task(self._update_subs_coroutine())
        self._update_tasks.add(task)
        task.add_done_callback(self._update_tasks.discard)

    async def _update_subs_coroutine(self):
        message = self.get_global_state()
        for (name, ws) in self._subs.items():
            print('Sending')
            await ws.send_str(MessageToJson(message))
