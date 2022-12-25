from j7s_web_v2.types import LightState

NUM_LIGHTS = 6

class GlobalState():
    def __init__(self):
        default_state = LightState(color='off', brightness='1.0')
        self._light_states = [default_state, default_state, default_state,
                              default_state, default_state, default_state ]

    def set_state(self, index, light_state):
        if index >= len(self._light_states) or index < 0:
            raise 'Invalid index.'
        self._light_states[index] = light_state

    def get_state(self, index):
        if index >= len(self._light_states) or index < 0:
            raise 'Invalid index.'
        return self._light_states[index]




