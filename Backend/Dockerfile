FROM ubuntu:20.04

ENV DEBIAN_FRONTEND=noninteractive

RUN apt-get update && apt-get install -y \
    curl \
    build-essential \
    pkg-config \
    libssl-dev \
    git \
    unzip \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app

COPY setup_dev.sh .

RUN chmod +x setup_dev.sh

ENTRYPOINT ["/bin/bash"]
