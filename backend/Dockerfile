FROM ubuntu:20.04

RUN apt-get update && apt-get install -y python3-pip python3-psycopg2 && apt-get clean

WORKDIR /dearname
ADD ./requirements.txt /dearname/
RUN pip3 install -r requirements.txt
ADD . /dearname/

ENV PYTHONUNBUFFERED=1

# EXPOSE 80

ENTRYPOINT ["bash", "./entrypoint.sh"]
# CMD ["gunicorn", "backend.wsgi:application", "--bind", "0.0.0.0:80"]