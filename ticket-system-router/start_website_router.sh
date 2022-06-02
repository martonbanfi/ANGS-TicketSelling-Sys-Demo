#!/bin/bash
#
# SPDX-License-Identifier: Apache-2.0
# the following script is for starting Angus router alongside with the website


# Where am I?
DIR=${PWD}

echo "================================Starting Angus Router============================"
#download node packages if they are not there
if [ ! -d "dist/" ]; then
    npm install
fi
npm run build 
npm run start
