#!/bin/sh

# Install cron
sudo apt-get update
sudo apt-get install cron
sudo service cron start

# Cleanup /tmp every 10 seconds
# Required for mongo-memory-server to work properly
chmod +x .devcontainer/cleanup-tmp.sh
crontab -l | {
    cat
    echo "* * * * * for i in {1..6}; do ${PWD}/.devcontainer/cleanup-tmp.sh & sleep 10; done"
} | crontab -

# Set up environment variables for github codespaces
if [ "$CODESPACES" = "true" ]; then
    echo "KINDE_SITE_URL=https://${CODESPACE_NAME}-3000.app.github.dev" >>/etc/environment
    echo "KINDE_POST_LOGOUT_REDIRECT_URL=https://${CODESPACE_NAME}-3000.app.github.dev" >>/etc/environment
    echo "KINDE_POST_LOGIN_REDIRECT_URL=https://${CODESPACE_NAME}-3000.app.github.dev" >>/etc/environment
fi
