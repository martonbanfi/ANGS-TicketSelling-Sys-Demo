import { HandlebarsConfig } from 'https://deno.land/x/handlebars/mod.ts'
import TicketSystemBlockchainConnectionConstants from "../TicketSystemConstants/TicketSystemBlockchainConnectionConstants.ts"


export const handlebarsConfig: HandlebarsConfig = {
	baseDir: 'views',
	extname: '.hbs',
	layoutsDir: 'layouts/',
	partialsDir: 'partials/',
	defaultLayout: '',
	helpers: undefined,
	compilerOptions: undefined,
}

/**
 * Returns passwords for specific blockchain role
 * @param convertableValue 
 * @returns 
 */
export function getCorrespondingPWForBlockchainRole(convertableValue:string){
	if(convertableValue==TicketSystemBlockchainConnectionConstants.TICKET_SYSTEM_ENROLL_ADMIN_ROLE) return TicketSystemBlockchainConnectionConstants.TICKET_SYSTEM_ENROLL_ADMIN_PW
	else if(convertableValue==TicketSystemBlockchainConnectionConstants.TICKET_SYSTEM_ENROLL_PARTNER_ROLE) return TicketSystemBlockchainConnectionConstants.TICKET_SYSTEM_ENROLL_PARTNER_ROLE_PW
	else if(convertableValue==TicketSystemBlockchainConnectionConstants.TICKET_SYSTEM_ENROLL_CUSTOMER_ROLE) return TicketSystemBlockchainConnectionConstants.TICKET_SYSTEM_ENROLL_CUSTOMER_ROLE_PW
}
	 

    

