FROM python:3.11.4-slim-bullseye
WORKDIR /app/
ENV PYTHONPATH=/app/

RUN apt-get -y update && apt-get -y install apt-transport-https nmap wget gnupg curl && \
  apt-get update -y && \
  apt-get -y install chromium chromium-driver && \
  apt-get clean;
COPY requirements.txt /app/requirements.txt
RUN pip3 install --no-cache-dir --upgrade pip && \
  pip3 install --no-cache-dir -r /app/requirements.txt
COPY osintbuddy-plugins /osintbuddy-plugins/
# @todo change to PyPi package for release 0.0.5 and remove gitmodules
RUN pip3 install /osintbuddy-plugins/
COPY app/ /app/

CMD ["/bin/bash", "-c", "./start.sh"]
