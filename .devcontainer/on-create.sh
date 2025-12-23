#!/bin/sh

# Install cron
sudo apt update
sudo apt-get install cron
sudo service cron start

# Cleanup /tmp every 10 seconds
# Required for mongo-memory-server to work properly
chmod +x .devcontainer/cleanup-tmp.sh
crontab -l | {
    cat
    echo "* * * * * for i in {1..6}; do ${PWD}/.devcontainer/cleanup-tmp.sh & sleep 10; done"
} | crontab -
