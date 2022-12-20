FROM python:3.9.6-buster

WORKDIR /app/
ENV PYTHONPATH=/app/
COPY ./requirements.txt /app/requirements.txt
COPY ./dev-requirements.txt /app/dev-requirements.txt


RUN pip install --no-cache-dir --upgrade pip 
RUN  if test -e /app/requirements.txt; then pip install --no-cache-dir -r /app/requirements.txt; fi
RUN  if test -e /app/dev-requirements.txt; then pip install --no-cache-dir -r /app/dev-requirements.txt; fi

COPY ./app/worker-start.sh /worker-start.sh
COPY ./app/ /app

