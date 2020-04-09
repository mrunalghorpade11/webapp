#!/bin/bash
cd /home/ubuntu
cd ..
sudo cp rds-ca-2019-root.pem /home/ubuntu
cd ..
sudo cp environment /home/ubuntu
cd /home/ubuntu
sudo chomd 777 environment
sudo chmod 777 .env
sudo cat environment >> .env
sudo /opt/aws/amazon-cloudwatch-agent/bin/amazon-cloudwatch-agent-ctl -a fetch-config -m ec2 -c file:cloudwatch-agent-config.json -s
npm install
