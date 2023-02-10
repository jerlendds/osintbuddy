FROM python:3.9.6-buster

WORKDIR /app/
ENV PYTHONPATH=/app/
COPY requirements.txt /app/requirements.txt
RUN apt-get -y update && apt-get -y install curl
RUN pip install --no-cache-dir --upgrade pip && \
    pip install --no-cache-dir -r /app/requirements.txt
RUN curl -OL https://github.com/OJ/gobuster/releases/download/v3.4.0/gobuster_3.4.0_Linux_x86_64.tar.gz
COPY app/ /app/
CMD ["/bin/bash", "-c", "./start.sh"]
