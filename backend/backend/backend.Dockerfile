FROM python:3.11.3-slim-bullseye

WORKDIR /app/
ENV PYTHONPATH=/app/


RUN apt-get -y update && apt-get -y install nmap wget gnupg
RUN wget -q -O - https://dl.google.com/linux/linux_signing_key.pub | apt-key add - && \
    sh -c 'echo "deb [arch=amd64] http://dl.google.com/linux/chrome/deb/ stable main" >> /etc/apt/sources.list.d/google-chrome.list' && \
    apt-get update -y && apt-get -y install google-chrome-stable
COPY requirements.txt /app/requirements.txt
RUN pip install --no-cache-dir --upgrade pip && \
    pip install --no-cache-dir -r /app/requirements.txt
COPY osintbuddy-plugins /osintbuddy-plugins/
RUN pip install /osintbuddy-plugins/
COPY app/ /app/

CMD ["/bin/bash", "-c", "./start.sh"]
