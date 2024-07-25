#! /bin/sh

set -e
echo 'Stopping service...'
sudo systemctl stop skydiving.service
echo 'Pulling latest changes'
git pull
echo 'Building...'
npm i
npm run build
echo 'Starting service...'
sudo systemctl start skydiving.service
