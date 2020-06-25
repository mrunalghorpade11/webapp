# webapp
CSYE6225
## Requirements

For development, you will only need Node.js and a node global package, Yarn, installed in your environement.
 #### Node installation on Ubuntu

  You can install nodejs and npm easily with apt install, just run the following commands.

      $ sudo apt install nodejs
      $ sudo apt install npm
## Install

    $ git clone git@github.com:TheKhaleesi/webapp.git
    $ cd CSYE6225/webapp
    $ npm install

## execute server
    $ node server.js
## execute test cases
    $ npm test
## Application use cases
 * Application is used to manages Billing invoices for the customer
 * Each Bill can have one file, this file is stored on AWS S3 storage
 * Bill Details are store on MariaDB RDS Instance
 * User receives his due bills in email via AWS Simple email service
