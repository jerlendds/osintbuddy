FROM python:3.11.3-slim-bullseye

WORKDIR /app/
ENV PYTHONPATH=/app/


RUN apt-get -y update && apt-get -y install nmap wget gnupg curl
# @todo figure out how to include this...
# RUN curl -OL https://repo1.maven.org/maven2/org/apache/jena/jena-jdbc-driver-bundle/4.8.0/jena-jdbc-driver-bundle-4.8.0.jar 
RUN wget -q -O - https://dl.google.com/linux/linux_signing_key.pub | apt-key add - && \
    sh -c 'echo "deb [arch=amd64] http://dl.google.com/linux/chrome/deb/ stable main" >> /etc/apt/sources.list.d/google-chrome.list' && \
    apt-get update -y && apt-get -y install openjdk-11-jre-headless google-chrome-stable && \
    apt-get clean;

COPY requirements.txt /app/requirements.txt
RUN pip install --no-cache-dir --upgrade pip && \
    pip install --no-cache-dir -r /app/requirements.txt
COPY osintbuddy-plugins /osintbuddy-plugins/
RUN pip install /osintbuddy-plugins/
COPY app/ /app/
# COPY jena-jdbc-driver-bundle-4.8.0.jar /app/jena-jdbc-driver-bundle-4.8.0.jar
ENV CLASSPATH=/app/jena-jdbc-driver-bundle-4.8.0.jar
CMD ["/bin/bash", "-c", "./start.sh"]
