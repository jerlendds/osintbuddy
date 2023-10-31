from pydantic import BaseModel

class ErrorDetail:
    detail: str

class HTTPError(BaseModel):
    detail: str

    class Config:
        json_schema_extra = {
            "example": {"detail": "HTTPException raised."},
        }
