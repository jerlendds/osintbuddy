FROM python:3.11.3-slim-bullseye

WORKDIR /app/
ENV PYTHONPATH=/app/
COPY requirements.txt /app/requirements.txt
RUN apt-get -y update && apt-get -y install nmap
RUN pip install --no-cache-dir --upgrade pip && \
    pip install --no-cache-dir -r /app/requirements.txt
COPY app/ /app/
CMD ["/bin/bash", "-c", "./start.sh"]
