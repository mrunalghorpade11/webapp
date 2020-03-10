#!/bin/bash
cd /home/ubuntu
cd ..
cd ..
cd /etc/profile.d
cp custom.sh /home/ubuntu
cd /home/ubuntu
rm custom.sh .env
npm install