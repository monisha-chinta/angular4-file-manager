# Description

File Manager - an application used to upload and download files. Created using Angular4 for front-end; ExpressJS and MongoDB for back-end.
User can register and login to his account to view, upload or download files. Admin can view all users files.

Modules used:
* passport.js for user authentication
* GridFs for storing file in MongoDB
* Material Design for stylying

## Quick Start
Clone the repository

    git clone https://github.com/monisha-chinta/angular4-file-manager.git

Install local NPM packages
   
*front-end
 
    cd angular4-file-manager
    npm install
    
*server side

    cd angular4-file-manager/server
    npm install
    
Build

    Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory.
    
Run Express server

    node expressServer.js

    * This server runs on port: 3001
    * Open localhost:3001 to view the login page

*Note

    Register admin with email address as `admin@filemanager.com` to use admin functionality. 
