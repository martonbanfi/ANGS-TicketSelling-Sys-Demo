enum TicketSystemBlockchainConnectionConstants{
    // NFTTickets
    TICKET_SYSTEM_LIST_NFTTICKETS_URL="http://localhost:8888/document/list-nfttickets",
    TICKET_SYSTEM_GET_NFTTICKET_URL_NEEDPAR="http://localhost:8888/document/get-nftticket?id=",
    TICKET_SYSTEM_MINT_NFTTICKET_URL="http://localhost:8888/document/mint-nftticket",
    TICKET_SYSTEM_MODIFY_NFTTICKET_URL="http://localhost:8888/document/modify-nftticket",
    TICKET_SYSTEM_REMOVE_NFTTICKET_URL_NEEDPAR="http://localhost:8888/document/remove-nftticket?id=",
    TICKET_SYSTEM_LIST__OWNED_NFTTICKETS_URL_NEEDPAR="http://localhost:8888/document/list-owned-nfttickets?owner=",
    
    // system
    TICKET_SYSTEM_HEALTH_CHECK_URL="http://localhost:8888/maintenance/healthcheck",
    TICKET_SYSTEM_ENROLL_USER_URL="http://localhost:8888/admin/enroll-user",
    TICKET_SYSTEM_ENROLL_ADMIN_PW="adminpw",
    TICKET_SYSTEM_ENROLL_PARTNER_ROLE_PW="partnerpw",
    TICKET_SYSTEM_ENROLL_CUSTOMER_ROLE_PW="customerpw",
    TICKET_SYSTEM_ENROLL_ADMIN_ROLE="admin",
    TICKET_SYSTEM_ENROLL_PARTNER_ROLE="partner",
    TICKET_SYSTEM_ENROLL_CUSTOMER_ROLE="customer",

    // Events
    TICKET_SYSTEM_GET_EVENT_URL_NEEDPAR="http://localhost:8888/document/get-event?id=",
    TICKET_SYSTEM_LIST_EVENTS_URL="http://localhost:8888/document/list-available-events",
    TICKET_SYSTEM_CREATE_EVENT_URL="http://localhost:8888/document/create-event",
    TICKET_SYSTEM_MODIFY_EVENT_URL="http://localhost:8888/document/modify-event",
    TICKET_SYSTEM_REMOVE_EVENT_URL="http://localhost:8888/document/remove-event?id=7abcc34d-afc2-4f92-831e-d8abb7b4d145"
}
export default TicketSystemBlockchainConnectionConstants;