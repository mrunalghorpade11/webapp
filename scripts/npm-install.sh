#!/bin/bash
cd /home/ubuntu
cd ..
cd ..
sudo cp environment /home/ubuntu
cd /home/ubuntu
sudo chomd 777 environment
sudo chmod 777 .env
sudo cat environment >> .env
sudo /opt/aws/amazon-cloudwatch-agent/bin/amazon-cloudwatch-agent-ctl -a fetch-config -m ec2 -c file:cloudwatch-agent-config -s
npm install
