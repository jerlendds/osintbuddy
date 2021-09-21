FROM python:3.9.6-buster


WORKDIR /


COPY /requirements.txt /app/


RUN pip install -r /app/requirements.txt


COPY . /app


ENV PYTHONPATH=/app
