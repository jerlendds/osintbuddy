FROM python:3.9.6-buster
LABEL maintainer="jerlendds <jerlendds@openinfolabs.com>"

WORKDIR /app/
ENV PYTHONPATH=/app/
COPY ./requirements.txt /app/requirements.txt


RUN pip install --no-cache-dir --upgrade pip 
RUN  if test -e /app/requirements.txt; then pip install --no-cache-dir -r /app/requirements.txt; fi

COPY ./app/worker-start.sh /worker-start.sh
COPY ./app/ /app

CMD ["/bin/bash", "-c", "./worker-start.sh"]
