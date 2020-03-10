#!/bin/bash
cd /home/ubuntu
cd ..
cd ..
cd /etc/profile.d
sudo cp custom.sh /home/ubuntu
cd /home/ubuntu
sudo chmod 666 .env
sudo cat custom.sh >> .env
printenv
npm install