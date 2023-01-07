import pydantic
from typing import List

class LightState(pydantic.BaseModel):
    color: str
    brightness: float

class LightStateList(pydantic.BaseModel):
    __root__: List[LightState]
