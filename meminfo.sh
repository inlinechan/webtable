#!/bin/sh

CUT=4

awk -F: '{print $1}' /proc/meminfo | head -n $CUT | paste -d" " -s
while true
do
    awk '{print int($2/1024.0)}' /proc/meminfo | head -n $CUT | paste -d" " -s
    sleep 1
done

