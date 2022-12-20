FROM python:3.9.6-buster

WORKDIR /app/
ENV PYTHONPATH=/app/
COPY requirements.txt /app/requirements.txt
RUN apt-get -y update && apt-get -y install curl
RUN pip install --no-cache-dir --upgrade pip && \
    pip install --no-cache-dir -r /app/requirements.txt
COPY app/ /app/
CMD ["/bin/bash", "-c", "./start.sh"]
