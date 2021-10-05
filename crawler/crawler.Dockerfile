FROM python:3.8.12-buster


WORKDIR /


COPY /requirements.txt /spiderman/


RUN pip install -r /spiderman/requirements.txt


COPY . /spiderman





COPY start-crawler-service.sh /start-crawler-service.sh



RUN chmod +x /start-crawler-service.sh


ENV PYTHONPATH=/spiderman

EXPOSE 7242