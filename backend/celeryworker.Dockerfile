FROM python:3.9.6-buster

WORKDIR /app/


COPY ./app/requirements.txt /app/

RUN pip install -r /app/requirements.txt


ENV C_FORCE_ROOT=1

COPY ./app /app
WORKDIR /app

ENV PYTHONPATH=/app

COPY ./app/worker-start.sh /worker-start.sh

RUN chmod +x /worker-start.sh

CMD ["bash", "/worker-start.sh"]
