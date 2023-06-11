FROM python:3.11.3-slim-bullseye

WORKDIR /app/
ENV PYTHONPATH=/app/


RUN apt-get -y update && apt-get -y install apt-transport-https nmap wget gnupg curl
# @todo figure out how to include this...
# RUN curl -OL https://repo1.maven.org/maven2/org/apache/jena/jena-jdbc-driver-bundle/4.8.0/jena-jdbc-driver-bundle-4.8.0.jar 

RUN apt-get update -y;
RUN apt-get -y install openjdk-11-jre-headless chromium chromium-driver;
RUN apt-get clean;

COPY requirements.txt /app/requirements.txt
RUN pip install --no-cache-dir --upgrade pip && \
    pip install --no-cache-dir -r /app/requirements.txt
COPY osintbuddy-plugins /osintbuddy-plugins/
RUN pip install /osintbuddy-plugins/
COPY app/ /app/
# COPY jena-jdbc-driver-bundle-4.8.0.jar /app/jena-jdbc-driver-bundle-4.8.0.jar
ENV CLASSPATH=/app/jena-jdbc-driver-bundle-4.8.0.jar
CMD ["/bin/bash", "-c", "./start.sh"]
