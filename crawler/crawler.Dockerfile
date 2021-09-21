FROM python:3.9.6

WORKDIR /

COPY ./app/requirements.txt /app/


RUN pip install -r /app/requirements.txt


# For development, Jupyter remote kernel, Hydrogen
# Using inside the container:
# jupyter lab --ip=0.0.0.0 --allow-root --NotebookApp.custom_display_url=http://127.0.0.1:8888
ARG INSTALL_JUPYTER=false
RUN bash -c "if [ $INSTALL_JUPYTER == 'true' ] ; then pip install jupyterlab ; fi"


COPY ./app /app


ENV PYTHONPATH=/app
