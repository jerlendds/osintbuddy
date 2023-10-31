from typing import TYPE_CHECKING

from fastapi import Request

# https://github.com/tiangolo/fastapi/issues/632#issuecomment-545574191
APIRequest = Request
if TYPE_CHECKING:
    from fastapi import FastAPI
    from casdoor import CasdoorSDK
    class APIServerState:
        CASDOOR_SDK: CasdoorSDK
        REDIRECT_URI: str
        SECRET_TYPE: str
        SECRET_KEY: str
    def __init__(self) -> None:
        self.CASDOOR_SDK: CasdoorSDK
        self.REDIRECT_URI: str
        self.SECRET_TYPE: str
        self.SECRET_KEY: str

    class APIServer(FastAPI):
        state: APIServerState

    def setup_state(self) -> None:
        self.state = APIServerState()

    class APIRequest(Request):
        app: APIServer
