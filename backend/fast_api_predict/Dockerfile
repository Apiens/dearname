FROM ubuntu:20.04

RUN apt-get update && apt-get install -y python3-pip && apt-get clean

WORKDIR /fast_api_predict
ADD ./pip.conf /etc/pip.conf
RUN export PIP_CONFIG_FILE=/etc/pip.conf && pip3 install --upgrade pip
ADD ./requirements.txt /fast_api_predict/

RUN pip3 install tensorflow==2.4.0
RUN pip3 install -r requirements.txt
ADD . /fast_api_predict/

ENV PYTHONUNBUFFERED=1

EXPOSE 8008
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8008"]