#!/bin/bash
#
# SPDX-License-Identifier: Apache-2.0

#
#this script is used to start the Ticket Selling System Website
#

function _exit(){
    printf "Exiting:%s\n" "$1"
    exit -1
}

# Exit on first error, print all commands.
set -ev
set -o pipefail

# Where am I?
DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"

export FABRIC_CFG_PATH="${DIR}/config"

cd "${DIR}/ticket-network/"

docker kill cliDigiBank cliMagnetoCorp logspout || true
./network.sh down

./network.sh up createChannel -ca -s couchdb

# setting up the network database
mysql -u root -pticketsyspassword -h 127.0.0.1 -P 3306 --connect-timeout 60 -e "DROP DATABASE IF EXISTS ticket_system_user_login; DROP USER IF EXISTS websiteuser;";
mysql -u root -pticketsyspassword -h 127.0.0.1 -P 3306 --connect-timeout 60 -e "create database IF NOT EXISTS ticket_system_user_login;";
mysql -u root -pticketsyspassword -h 127.0.0.1 -P 3306 --connect-timeout 60 ticket_system_user_login < "${DIR}/setup.sql"



 # copy partner
cp "${DIR}/ticket-network/organizations/peerOrganizations/org1.example.com/users/partner@org1.example.com/msp/signcerts/"* "${DIR}/ticket-network/organizations/peerOrganizations/org1.example.com/users/partner@org1.example.com/msp/signcerts/partner@org1.example.com-cert.pem"
cp "${DIR}/ticket-network/organizations/peerOrganizations/org1.example.com/users/partner@org1.example.com/msp/keystore/"* "${DIR}/ticket-network/organizations/peerOrganizations/org1.example.com/users/partner@org1.example.com/msp/keystore/priv_sk"

cp "${DIR}/ticket-network/organizations/peerOrganizations/org2.example.com/users/partner@org2.example.com/msp/signcerts/"* "${DIR}/ticket-network/organizations/peerOrganizations/org2.example.com/users/partner@org2.example.com/msp/signcerts/partner@org2.example.com-cert.pem"
cp "${DIR}/ticket-network/organizations/peerOrganizations/org2.example.com/users/partner@org2.example.com/msp/keystore/"* "${DIR}/ticket-network/organizations/peerOrganizations/org2.example.com/users/partner@org2.example.com/msp/keystore/priv_sk"

# copy customer
cp "${DIR}/ticket-network/organizations/peerOrganizations/org1.example.com/users/customer@org1.example.com/msp/signcerts/"* "${DIR}/ticket-network/organizations/peerOrganizations/org1.example.com/users/customer@org1.example.com/msp/signcerts/customer@org1.example.com-cert.pem"
cp "${DIR}/ticket-network/organizations/peerOrganizations/org1.example.com/users/customer@org1.example.com/msp/keystore/"* "${DIR}/ticket-network/organizations/peerOrganizations/org1.example.com/users/customer@org1.example.com/msp/keystore/priv_sk"

cp "${DIR}/ticket-network/organizations/peerOrganizations/org2.example.com/users/customer@org2.example.com/msp/signcerts/"* "${DIR}/ticket-network/organizations/peerOrganizations/org2.example.com/users/customer@org2.example.com/msp/signcerts/customer@org2.example.com-cert.pem"
cp "${DIR}/ticket-network/organizations/peerOrganizations/org2.example.com/users/customer@org2.example.com/msp/keystore/"* "${DIR}/ticket-network/organizations/peerOrganizations/org2.example.com/users/customer@org2.example.com/msp/keystore/priv_sk"

echo Suggest that you monitor the docker containers by running
echo "./organization/magnetocorp/configuration/cli/monitordocker.sh ticket_selling_system_network"

#for easier demonstration purposes, the required chaincode that inclues the ticket selling system services is automatically installed during spinup
echo "########################################### "
echo "install chaincode for ticket selling system "
echo "########################################### "
./network.sh deployCC -cci xy -ccn contract -ccp ../chaincode/contract -ccl typescript