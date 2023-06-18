import sys
import uvicorn

print(sys.argv[0])

if __name__ == "__main__":
    uvicorn.run("app.main:app", host="0.0.0.0", port=80, loop='asyncio', reload=True, workers=4, headers=[('server', 'app')], log_level='info')

