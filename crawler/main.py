from typing import Optional

from fastapi import FastAPI

app = FastAPI()


@app.get('/')
def root():
    return {'status': 'waiting for tasks'}
