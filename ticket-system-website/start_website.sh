# the following script is for starting Angus router alongside with the website

# Where am I?
DIR=${PWD}
# Locate the ticket-system-router
TICKET_SYS_ROUTER="${DIR}/../ticket-system-router/wallet"

echo "================================Starting Website================================"

if [ ! -d ${TICKET_SYS_ROUTER} ]; then
    echo "filling website with premade event"
    ./fillWebsiteWithPremadeData.sh
fi

deno run --allow-all --allow-read --no-check --unstable index.ts


