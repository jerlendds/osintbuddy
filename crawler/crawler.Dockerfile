FROM python:latest


WORKDIR /


COPY /requirements.txt /spiderman/


RUN pip install -r /spiderman/requirements.txt


COPY . /spiderman


ENV PYTHONPATH=/spiderman


# Apt update & apt install required packages
RUN apt-get update && apt -y install openssh-server ufw


COPY start-crawler-ssh.sh /start-crawler-ssh.sh


RUN chmod +x /start-crawler-ssh.sh
