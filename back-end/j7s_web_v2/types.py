import pydantic

class LightState(pydantic.BaseModel):
    color: str
    brightness: float
