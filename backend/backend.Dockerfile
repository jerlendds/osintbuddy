FROM python:3.9.6-buster

WORKDIR /app/


COPY ./app/requirements.txt /app/


RUN pip install -r /app/requirements.txt


COPY ./app /app


ENV PYTHONPATH=/app
