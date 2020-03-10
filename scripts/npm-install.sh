#!/bin/bash
cd /home/ubuntu
cd ..
cd ..
cd /etc/profile.d
cp custom.sh /home/ubuntu/webapp/.env
cd /home/ubuntu/webapp
npm install