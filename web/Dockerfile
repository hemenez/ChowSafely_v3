FROM ubuntu:14.04
WORKDIR '/app'

RUN apt-get update -y && \
    apt-get install -y python3-pip python3-dev

# We copy just the requirements.txt first to leverage Docker cache
COPY ./requirements.txt ./requirements.txt

RUN pip3 install -r requirements.txt

COPY . .

#ENTRYPOINT [ "python3" ]

CMD ["python3", "myproject.py" ]