from pydantic import BaseModel

class XYPosition(BaseModel):
    x: float
    y: float

class CreateNode(BaseModel):
    label: str
    position: XYPosition
    project_uuid: str

