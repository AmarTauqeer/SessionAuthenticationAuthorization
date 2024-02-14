FROM python:3.10
ENV PYTHONBUFFERED=1
WORKDIR /SessionAuthenticationAuthorization
COPY requirements.txt requirements.txt
RUN pip3 install -r requirements.txt