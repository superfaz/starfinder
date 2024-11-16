#!/bin/sh

count=$(ps -ax | grep vitest | wc -l)

if [ $count -gt 1 ]; then
    echo "Vitest is running, skipping cleanup"
    exit 0
fi

find /tmp -type f -delete
