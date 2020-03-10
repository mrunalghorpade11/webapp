#!/bin/bash
cd /home/ubuntu
cd ..
cd ..
sudo cp environment /home/ubuntu
cd /home/ubuntu
sudo chomd 777 environment
sudo chmod 777 .env
sudo cat environment >> .env
printenv
npm install