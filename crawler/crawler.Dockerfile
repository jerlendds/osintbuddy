FROM python:3.9.6-buster


WORKDIR /


COPY /requirements.txt /spiderman/


RUN pip install -r /spiderman/requirements.txt


COPY . /spiderman


ENV PYTHONPATH=/app
