#!/usr/bin/env sh

# TODO: Figure out how to setup seaweedfs s3 in one dockerfile for dev purposes...

set -e

function do_for_sigint() {
    kill -9 `cat s3_pid.txt`
    kill -9 `cat filer_pid.txt`
    kill -9 `cat volume_pid.txt`
    kill -9 `cat master_pid.txt`
    
    rm s3_pid.txt
    rm filer_pid.txt
    rm volume_pid.txt
    rm master_pid.txt
}

/usr/bin/weed master -ip=127.0.0.1 -ip.bind=127.0.0.1 -metricsPort=9324 > /var/log/seaweedfs-master.log 2>&1 &
echo $! >> master_pid.txt

/usr/bin/weed volume -mserver='127.0.0.1:9333' -ip.bind=127.0.0.1 -port=8080  -metricsPort=9325 > /var/log/seaweedfs-volume.log 2>&1 &
echo $! >> volume_pid.txt

/usr/bin/weed filer -master='127.0.0.1:9333' -ip.bind=127.0.0.1 -metricsPort=9326 > /var/log/seaweedfs-filer.log 2>&1 &
echo $! >> filer_pid.txt

/usr/bin/weed s3 -filer='127.0.0.1:8888' -ip.bind=0.0.0.0 -metricsPort=9327  > /var/log/seaweedfs-s3.log 2>&1 &
echo $! >> s3_pid.txt


trap 'do_for_sigint' 2

tail -f /var/log/seaweedfs-s3.log & tail -f /var/log/seaweedfs-master.log & tail -f /var/log/seaweedfs-volume.log & tail -f /var/log/seaweedfs-filer.log
