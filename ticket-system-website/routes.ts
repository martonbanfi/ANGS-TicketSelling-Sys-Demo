import { Router } from 'https://deno.land/x/oak@v6.5.0/mod.ts'
import { Handlebars, HandlebarsConfig } from 'https://deno.land/x/handlebars/mod.ts'
import { upload } from 'https://cdn.deno.land/oak_upload_middleware/versions/v2/raw/mod.ts'

import { login, loginConfig, getAmountOfUser,register, registerConfig } from './modules/accounts.ts'
import { handlebarsConfig } from './modules/util.ts'

import { getAllOwnedNFTTicketsFromBlockchain, getAllNFTTicketsSecondaryMarketFromBlockchain,getSpecificNFTTicketFromBlockchain, modifyNFTTicketBlockchainCall, alterNFTTicketAppOnSecondaryMarketBlockchainCall, mintNFTTicketBlockchainCall } from './modules/blockchainQueriesNFTTicketCalls.ts'
import {getAvailableEventsFromBlockchain, getSpecificEventFromBlockchain, createEventBlockchainCall} from './modules/blockchainQueriesEventCalls.ts'

import TicketClass from './modelConstructors/eNFTTicketConstructor.ts'
import EventClass from './modelConstructors/eEventConstructor.ts'
import TicketSystemBlockchainConnectionConstants from "./TicketSystemConstants/TicketSystemBlockchainConnectionConstants.ts"

const handle = new Handlebars(handlebarsConfig)

const router: Router = new Router()

router.get('/', async context => {
	console.log('GET - HOME PAGE IS CALLED')
	const authorisedName = context.cookies.get('authorised')
	if(!authorisedName || authorisedName=="undefined"){
		context.response.redirect('/login')
	}
	else{
		const userRole = context.cookies.get('userRole')
		let doesCustomer;
		if(userRole===TicketSystemBlockchainConnectionConstants.TICKET_SYSTEM_ENROLL_CUSTOMER_ROLE) doesCustomer="true";
		let availableEvents:EventClass=[];
			
		availableEvents=await getAvailableEventsFromBlockchain(authorisedName, userRole)
		let balanceOfUser = await getAmountOfUser(authorisedName);
			
		const data = { authorisedName, availableEvents,userRole,doesCustomer,balanceOfUser  }
			
		const body = await handle.renderView('home', data)
		context.response.body = body
	}
})

router.get('/secondaryMarket', async context => {
	console.log('GET - secondaryMarket IS CALLED')
	const authorisedName = context.cookies.get('authorised')
	if(!authorisedName || authorisedName=="undefined"){
		context.response.redirect('/login')
	}
	else{
		const userRole = context.cookies.get('userRole')
		let doesCustomer;
		if(userRole===TicketSystemBlockchainConnectionConstants.TICKET_SYSTEM_ENROLL_CUSTOMER_ROLE) doesCustomer="true";
		let allOwnedNFTTickets:TicketClass=[];

		allOwnedNFTTickets=await getAllNFTTicketsSecondaryMarketFromBlockchain(userRole, authorisedName)
		let balanceOfUser = await getAmountOfUser(authorisedName);

		const data = { authorisedName, allOwnedNFTTickets, doesCustomer,userRole,balanceOfUser }
		const body = await handle.renderView('secondaryMarket', data)
		context.response.body = body
	}
})

router.get('/myNFTTickets', async context => {
	console.log('GET - myNFTTickets IS CALLED')
	const authorisedName = context.cookies.get('authorised')
	if(!authorisedName || authorisedName=="undefined"){
		context.response.redirect('/login')
	}
	else{
		const userRole = context.cookies.get('userRole')
		let doesCustomer;
		if(userRole===TicketSystemBlockchainConnectionConstants.TICKET_SYSTEM_ENROLL_CUSTOMER_ROLE) doesCustomer="true";
		let allOwnedNFTTickets:TicketClass=[];

		allOwnedNFTTickets=await getAllOwnedNFTTicketsFromBlockchain(userRole, authorisedName)
		let balanceOfUser = await getAmountOfUser(authorisedName);

		const data = { authorisedName, allOwnedNFTTickets, doesCustomer,userRole, balanceOfUser }
		const body = await handle.renderView('myNFTTickets', data)
		context.response.body = body
	}
})


// GET mintTicketForEvent PAGE
router.get('/mintTicketForEvent/:eventId', async context => {
	console.log('GET - mintTicketForEvent WITH PARAMETER PAGE IS CALLED')
	const eventToBeMintedTicketFor = context.params.eventId
	const authorisedName = context.cookies.get('authorised')
	if(!authorisedName || authorisedName=="undefined"){
		context.response.redirect('/login')
	}
	else{
		const userRole = context.cookies.get('userRole')
		let doesCustomer;
		if(userRole===TicketSystemBlockchainConnectionConstants.TICKET_SYSTEM_ENROLL_CUSTOMER_ROLE) doesCustomer="true";
		
		const correspondingEvent = await getSpecificEventFromBlockchain(eventToBeMintedTicketFor, userRole, authorisedName)
		let balanceOfUser = await getAmountOfUser(authorisedName);
		
		const data = { authorisedName, userRole,doesCustomer ,correspondingEvent, balanceOfUser }
		const body = await handle.renderView('mintNFTTicketPage', data)
		context.response.body = body
	}
})


// POST mintTicketForEvent
router.post('/mintTicketForEvent', async context => {
	console.log('POST - mintTicketForEvent IS CALLED')
	const body = await context.request.body({type: 'form-data'})
	const data= await body.value.read()
	const authorisedName = context.cookies.get('authorised')
	if(!authorisedName || authorisedName=="undefined"){
		context.response.redirect('/login')
	}
	else{
		const userRole = context.cookies.get('userRole')
		let wasItSusseccfull = await mintNFTTicketBlockchainCall(data,userRole,authorisedName);
		
		if(!wasItSusseccfull){context.response.redirect('/404')}
		else{context.response.redirect('/')}
	}
})

// GET buyTicketForEvent PAGE
router.get('/buyTicketForEvent/:ticketHash', async context => {
	console.log('GET - buyTicketForEvent WITH PARAMETER PAGE IS CALLED')
	const ticketToBePurchased = context.params.ticketHash
	const authorisedName = context.cookies.get('authorised')
	
	if(!authorisedName || authorisedName=="undefined"){
		context.response.redirect('/login')
	}
	else{
		const userRole = context.cookies.get('userRole')
		let doesCustomer;
		if(userRole===TicketSystemBlockchainConnectionConstants.TICKET_SYSTEM_ENROLL_CUSTOMER_ROLE) doesCustomer="true";

		const correspondingTicket = await getSpecificNFTTicketFromBlockchain(ticketToBePurchased, userRole, authorisedName)
		let balanceOfUser = await getAmountOfUser(authorisedName);

		let isOwner = correspondingTicket.currentOwnerOfTicket==authorisedName ? true : false;

		const data = { authorisedName, userRole,doesCustomer ,correspondingTicket, isOwner, balanceOfUser }
		const body = await handle.renderView('buyNFTTicketPage', data)
		context.response.body = body
	}
})

// POST buyTicketForEvent
router.post('/buyTicketForEvent', async context => {
	console.log('POST - buyTicketForEvent IS CALLED')
	const body = await context.request.body({type: 'form-data'})
	const data= await body.value.read()
	const authorisedName = context.cookies.get('authorised')
	if(!authorisedName || authorisedName=="undefined"){
		context.response.redirect('/login')
	}
	else{
		const userRole = context.cookies.get('userRole')
		let wasItSusseccfull = await modifyNFTTicketBlockchainCall(data,userRole,authorisedName);
		
		if(!wasItSusseccfull){context.response.redirect('/404')}
		else{context.response.redirect('/')}
	}
})

// POST alterNFTTicketAppOnSecondaryMarket
router.post('/alterNFTTicketAppOnSecondaryMarket', async context => {
	console.log('POST - alterNFTTicketAppOnSecondaryMarket IS CALLED')
	const body = await context.request.body({type: 'form-data'})
	const data= await body.value.read()
	const authorisedName = context.cookies.get('authorised')
	if(!authorisedName || authorisedName=="undefined"){
		context.response.redirect('/login')
	}
	else{
		const userRole = context.cookies.get('userRole')
		let desiredApperanceOnSecondaryMarket = data.fields.isOnSecondaryMarket==="on" ? true : false
		let ticketHash = data.fields.ticketHash;

		let wasItSusseccfull = await alterNFTTicketAppOnSecondaryMarketBlockchainCall(ticketHash,userRole, desiredApperanceOnSecondaryMarket);
		
		if(!wasItSusseccfull){context.response.redirect('/404')}
		else{context.response.redirect('/')}
	}
	
})

// GET createEventPage PAGE
router.get('/createEventPage', async context => {
	console.log('GET - createEventPage PAGE IS CALLED')
	const authorisedName = context.cookies.get('authorised')
	if(!authorisedName || authorisedName=="undefined"){
		context.response.redirect('/login')
	}
	else{
		const userRole = context.cookies.get('userRole')
		let balanceOfUser = await getAmountOfUser(authorisedName);
		
		const data = { authorisedName, userRole,balanceOfUser }
		const body = await handle.renderView('createEventPage', data)
		context.response.body = body
	}
})

// POST createEvent
router.post('/createEvent', async context => {
	console.log('POST - createEvent IS CALLED')
	const body = await context.request.body({type: 'form-data'})
	const authorisedName = context.cookies.get('authorised')
	if(!authorisedName || authorisedName=="undefined"){
		context.response.redirect('/login')
	}
	else{
		const userRole = context.cookies.get('userRole')
		const eventDetails= await body.value.read()
		const data = {authorisedName,userRole,eventDetails}

		let wasItSusseccfull = await createEventBlockchainCall(data, userRole, authorisedName);
		
		if(!wasItSusseccfull){context.response.redirect('/404')}
		else{context.response.redirect('/')}
	}	
})

// GET buyTicketForEvent PAGE
router.get('/detailsNFTTicket/:ticketHash', async context => {
	console.log('GET - detailsNFTTicket WITH PARAMETER PAGE IS CALLED')
	const ticketToBeOpened = context.params.ticketHash
	const authorisedName = context.cookies.get('authorised')
	if(!authorisedName || authorisedName=="undefined"){
		context.response.redirect('/login')
	}
	else{
		const userRole = context.cookies.get('userRole')
		let doesCustomer;
		if(userRole===TicketSystemBlockchainConnectionConstants.TICKET_SYSTEM_ENROLL_CUSTOMER_ROLE) doesCustomer="true";
		
		const correspondingTicket = await getSpecificNFTTicketFromBlockchain(ticketToBeOpened, userRole, authorisedName)

		let isOwner = correspondingTicket.currentOwnerOfTicket==authorisedName ? true : false;
		let wasCurrentPriceHigherThanPrevious = parseInt(correspondingTicket.currentPriceOfTicket)>=parseInt(correspondingTicket.previousPriceOfTicket) ? true : false;
		let balanceOfUser = await getAmountOfUser(authorisedName);

		const data = { authorisedName, userRole,doesCustomer ,correspondingTicket, isOwner,wasCurrentPriceHigherThanPrevious,balanceOfUser }
		const body = await handle.renderView('detailsNFTTicket', data)
		context.response.body = body
	}
})

router.get('/login', async context => {
	console.log('GET - LOGIN PAGE IS CALLED')
	context.cookies.delete('authorised')
	context.cookies.delete('userRole')
	const body = await handle.renderView('login')
	context.response.body = body
})


router.get('/register', async context => {
	const body = await handle.renderView('register')
	context.response.body = body
})

router.post('/register', async context => {
	console.log('POST - REGISTER PAGE IS CALLED')
	const body = context.request.body({ type: 'form' })
	const value = await body.value
	const obj = Object.fromEntries(value)
	try{
		await register(obj)
		context.response.redirect('/login')
	}
	catch(err){
		console.log(err)
		context.response.redirect('/register')
	}
})

router.get('/logout', context => {
	console.log('GET - LOGOUT PAGE IS CALLED')
	context.cookies.delete('authorised')
	context.cookies.delete('userRole')
	context.response.redirect('/')
})

router.post('/login', async context => {
	console.log('POST - LOGIN PAGE IS CALLED')
	const body = context.request.body({ type: 'form' })
	const value = await body.value
	const obj = Object.fromEntries(value)
	try {
		const usernameRegistrar = await login(obj)
		context.cookies.set('authorised', usernameRegistrar.username)
		
		//if the role is not customer, assign the 'customer' cookie
		context.cookies.set('userRole', usernameRegistrar.registrar)
		context.response.redirect('/')
	} catch(err) {
		console.log(err)
		context.response.redirect('/login')
	}
})

export default router
