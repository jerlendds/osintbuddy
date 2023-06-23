from pydantic import BaseModel

class CreateNode(BaseModel):
    label: str
    x: float
    y: float
