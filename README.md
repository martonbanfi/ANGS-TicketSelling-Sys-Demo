# Prerequisites of the Ticket Selling System 
To run the above discussed blockchain network, certain system requirements and Prerequisites must be done beforehand. Although the system was developed under the Macintosh operating system and been optimized for it, using non-Unix like system such as Windows could theoretically work, but not guaranteed or tested. Thus, the usage of Macintosh is recommended. Furthermore, bash has been chosen over zsh since it turned out to be better compatible with Hyperledger Fabric, although it seemed to work under zsh as well. 
 
# System Requirements:
- Operating System: Macintosh is recommended 
- Docker Desktop: Docker version 17.06.2-ce or greater is required
- NodeJS: v14.18.2 is required
- MySQL: 8.0.28
- Deno
- Typescript
- Python with python 3 alias 
- Shell environment: bash is recommended
- Step 0: satisfy all system requirements 
- Node

## To download the desired version of Node using nvm, run the following command in the terminal:
```
brew install nvm
mkdir ~/.nvm
echo 'export NVM_DIR=~/.nvm' >> ~/.zshrc
echo 'source $(brew --prefix nvm)/nvm.sh' >> ~/.zshrc
```
 
Restart the terminal windows or just run the following command in the current window:
 
```
source ~/.zshrc
```
 
Installing node 14.18.2:

```
nvm install 14
nvm use 14.18.2
nvm alias default 14.18.2
```
 
Now the desired node version should be installed and set and default on the computer. To check it, restart terminal window and run:

```
node -v
```
 
It should say that the current node version is v14.18.2
 
## Docker
Install Docker Desktop: https://www.docker.com/products/docker-desktop/

## MySQL
To download MySQL, run:
```
brew install mysql
```


 
## Python
To download python3 if not installed, run:

```
brew install python3
```
 
Then, an alias on python must be made which points to python3

```
ln -s "$(brew --prefix)/bin/python"{3,}
```
 
Now, when typing which python into the terminal, the output should indicate the correct python3 version.
 
```
which python
```
 
It should say that the current python version is 3.x
 
 
# Step 1: clone the Ticket Selling System’s repository to its desired location
To clone the Ticket Selling System, run the following command under the desired location:

```
git clone git@github.coventry.ac.uk:banfim/Dissertation-Ticket-Selling-System.git
```
 
# Step 2: start the Docker Desktop application
 
# Step 2.5: if this is the first time setting up the system, run ./infrastructureSetup.sh script
 
```
./infrastructureSetup.sh
```
 

# Step 3: run the ./ticket-network-starter.sh script for spinning up the blockchain network 
 
```
./ticket-network-starter.sh
```

__FYI__ If desired, the Hyperledger Fabric’s blockchain log could be monitored by running the following command in a terminal window:

```
./ticket-network/monitordocker.sh ticket_selling_system_network
```
 
# Step 4: under ticket-system-router/, run the ./start_website_router.sh script for starting the gateway server
Run the following commands in the terminal:
 
```
cd ticket-system-router
./ticket-system-router.sh
```
 
 
# Step 5: under ticket-system-website/, run the ./start_website.sh script for starting the website 
Run the following commands in the terminal:
 
```
cd ticket-system-website
./start_website.sh
```
 
The website would be now available at the following URL:
 
            [http://localhost:8080/login](http://localhost:8080/login)
 
__USEFULL TIP__: Since two (or even three if the Hyperledger’s log is running) servers are constantly running throughout the whole Ticket Selling System experience, it is advised to have then run in separated terminal windows to constantly have their logs visible. By pressing command+t, a new terminal tab could be opened, providing one OS windows for all these tabs.
 
To directly trigger chaincode services, Angus offers a web interface for direct API calls that are defined in the above mentioned openapi.yaml file. It is accessible under the following URL
 
[http://localhost:8888/api-docs/#/](http://localhost:8888/api-docs/#/)