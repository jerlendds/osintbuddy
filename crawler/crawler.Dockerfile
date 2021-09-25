FROM python:latest


WORKDIR /


COPY /requirements.txt /spiderman/


RUN pip install -r /spiderman/requirements.txt


COPY . /spiderman


ENV PYTHONPATH=/spiderman


# Apt update & apt install required packages
# whois: required for mkpasswd
RUN apt update && apt -y install openssh-server whois


# Remove no-needed packages
RUN apt purge -y whois && apt -y autoremove && apt -y autoclean && apt -y clean


# Copy the entrypoint
COPY start-crawler-ssh.sh /spiderman/start-crawler-ssh.sh
RUN chmod +x /spiderman/start-crawler-ssh.sh

# Create the ssh directory and authorized_keys file
RUN mkdir /.ssh && touch /.ssh/authorized_keys


