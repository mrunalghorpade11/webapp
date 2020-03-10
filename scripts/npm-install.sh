#!/bin/bash
cd /home/ubuntu
cd ..
cd ..
cd /etc/profile.d
sudo cp custom.sh /home/ubuntu
cd /home/ubuntu
mv custom.sh .env
sudo chmod 666 .env
npm install