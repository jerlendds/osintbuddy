#!/bin/bash
#
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
# limitations under the License.

JANUS_PROPS="${JANUS_HOME}/janusgraph-dynamic.properties"
JANUSGRAPH_SERVER_YAML="${JANUS_CONFIG_DIR}/janusgraph-server.yaml"

# running as root; step down to run as janusgraph user
if [ "$1" == 'janusgraph' ] && [ "$(id -u)" == "0" ]; then
  exec chroot --skip-chdir --userspec janusgraph:janusgraph / "${BASH_SOURCE}" "$@"
fi

# running as non root user
if [ "$1" == 'janusgraph' ]; then
  if [ "$2" == 'show-config' ]; then
    echo "# contents of ${JANUS_PROPS}"
    cat "$JANUS_PROPS"
    echo "---------------------------------------"
    echo "# contents of ${JANUSGRAPH_SERVER_YAML}"
    cat "$JANUSGRAPH_SERVER_YAML"
    exit 0
  else
    # wait for storage
    if ! [ -z "${JANUS_STORAGE_TIMEOUT:-}" ]; then
      F="$(mktemp --suffix .groovy)"
      timeout "${JANUS_STORAGE_TIMEOUT}s" bash -c \
        "until bin/gremlin.sh -e $F > /dev/null 2>&1; do echo \"waiting for storage...\"; sleep 5; done"
      rm -f "$F"
    fi

    if ! [ "$(ls -A ${JANUS_INITDB_DIR})" ]; then
      exit 0
    fi

    # wait for JanusGraph server
    if ! [ -z "${JANUS_SERVER_TIMEOUT:-}" ]; then
      timeout "${JANUS_SERVER_TIMEOUT}s" bash -c \
      "until true &>/dev/null </dev/tcp/127.0.0.1/8182; do echo \"waiting for server...\"; sleep 5; done"
    fi

    exec ${JANUS_HOME}/bin/janusgraph-server.sh ${JANUSGRAPH_SERVER_YAML}
  fi
fi

# override hosts for remote connections with Gremlin Console
if ! [ -z "${GREMLIN_REMOTE_HOSTS:-}" ]; then
  sed -i "s/hosts\s*:.*/hosts: [$GREMLIN_REMOTE_HOSTS]/" ${JANUS_HOME}/conf/remote.yaml
  sed -i "s/hosts\s*:.*/hosts: [$GREMLIN_REMOTE_HOSTS]/" ${JANUS_HOME}/conf/remote-objects.yaml
fi

exec "$@"
