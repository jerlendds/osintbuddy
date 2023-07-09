# Copyright 2023 JanusGraph Authors, simplified by jerlendds
#
# Licensed under the Apache License, Version 2.0 (the "License");
# you may not use this file except in compliance with the License.
# You may obtain a copy of the License at
#
#      http://www.apache.org/licenses/LICENSE-2.0
#
# Unless required by applicable law or agreed to in writing, software
# distributed under the License is distributed on an "AS IS" BASIS,
# WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
# See the License for the specific language governing permissions and

FROM debian:buster-slim as builder

ARG TARGETARCH
ARG JANUS_VERSION=1.0.0-rc2

ENV JANUS_VERSION=${JANUS_VERSION} \
    JANUS_HOME=/opt/janusgraph

WORKDIR /opt

RUN apt update -y && apt install -y gpg unzip curl && \
    curl -fSL https://github.com/JanusGraph/janusgraph/releases/download/v${JANUS_VERSION}/janusgraph-${JANUS_VERSION}.zip -o janusgraph.zip && \
    curl -fSL https://github.com/JanusGraph/janusgraph/releases/download/v${JANUS_VERSION}/janusgraph-${JANUS_VERSION}.zip.asc -o janusgraph.zip.asc && \
    curl -fSL https://github.com/JanusGraph/janusgraph/releases/download/v${JANUS_VERSION}/KEYS -o KEYS && \
    gpg --import KEYS && \
    gpg --batch --verify janusgraph.zip.asc janusgraph.zip && \
    unzip janusgraph.zip && \
    mv janusgraph-${JANUS_VERSION} /opt/janusgraph && \
    rm -rf ${JANUS_HOME}/elasticsearch && \
    rm -rf ${JANUS_HOME}/javadocs && \
    rm -rf ${JANUS_HOME}/log && \
    rm -rf ${JANUS_HOME}/examples && \
    rm -rf ${JANUS_HOME}/conf/janusgraph-*.properties && \
    rm -rf ${JANUS_HOME}/conf/gremlin-server

FROM eclipse-temurin:11-jre

ARG CREATED=test
ARG REVISION=test
ARG JANUS_VERSION=1.0.0-rc2

ENV JANUS_VERSION=${JANUS_VERSION} \
    JANUS_HOME=/opt/janusgraph \
    JANUS_CONFIG_DIR=/etc/opt/janusgraph \
    JANUS_DATA_DIR=/var/lib/janusgraph \
    JANUS_SERVER_TIMEOUT=30 \
    JANUS_STORAGE_TIMEOUT=60 

RUN groupadd -r janusgraph --gid=999 && \
    useradd -r -g janusgraph --uid=999 -d ${JANUS_DATA_DIR} janusgraph && \
    apt-get update -y && \
    DEBIAN_FRONTEND=noninteractive apt-get install -y --no-install-recommends krb5-user && \
    rm -rf /var/lib/apt/lists/*

COPY --from=builder /opt/janusgraph/ /opt/janusgraph/
COPY docker-entrypoint.sh /usr/local/bin/

RUN chmod 755 /usr/local/bin/docker-entrypoint.sh && \
    mkdir -p ${JANUS_INITDB_DIR} ${JANUS_CONFIG_DIR} ${JANUS_DATA_DIR} && \
    chown -R janusgraph:janusgraph ${JANUS_HOME} ${JANUS_INITDB_DIR} ${JANUS_CONFIG_DIR} ${JANUS_DATA_DIR}

EXPOSE 8182

WORKDIR ${JANUS_HOME}
USER janusgraph

ENTRYPOINT [ "docker-entrypoint.sh" ]
CMD [ "janusgraph" ]
