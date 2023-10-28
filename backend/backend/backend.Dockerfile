FROM python:3.11.4-slim-bullseye
LABEL maintainer="jerlendds <support@forum.osintbuddy.com>"

WORKDIR /app/
ENV PYTHONPATH=/app/

RUN apt-get -y update && apt-get -y install git wget gnupg curl && \
    apt-get clean && pip3 install --no-cache-dir --upgrade pip;
COPY requirements.txt /app/requirements.txt
RUN pip3 install --no-cache-dir -r /app/requirements.txt

COPY app/ /app/
COPY osintbuddy-plugins /app/osintbuddy-plugins/
RUN pip install /app/osintbuddy-plugins/

CMD ["/bin/bash", "-c", "./start.sh"]
