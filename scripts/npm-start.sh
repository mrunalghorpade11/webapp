#!/bin/bash
cd /home/ubuntu
printenv
pm2 start app.js server.js