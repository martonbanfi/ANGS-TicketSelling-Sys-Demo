import {db} from './db.ts'
//TODO fiz it to be convenient
import TicketSystemBlockchainConnectionConstants from "../TicketSystemConstants/TicketSystemBlockchainConnectionConstants.ts"
import TicketSystemTransactionalFeeConstants from "../TicketSystemConstants/TicketSystemTransactionalFeeConstants.ts"
import MResEvent from '../model/mResEvent.ts'

import TicketClass from '../modelConstructors/eNFTTicketConstructor.ts'
import EventClass from '../modelConstructors/eEventConstructor.ts'
import MReqMintNFTTicketClass from '../modelConstructors/mReqMintNFTTicketConstructor.ts';
import MReqCreateEventClass from '../modelConstructors/mReqCreateEventConstructor.ts'

import { qrcode } from "https://deno.land/x/qrcode/mod.ts";
import { v4,v5 } from "https://deno.land/std/uuid/mod.ts"
import { time, timezone } from "https://deno.land/x/time.ts/mod.ts";


/**
 * This function returns a specific event based on its id from the blockchain ledger
 * @returns {allAvailableEvents} the available events
 */
 export async function getSpecificEventFromBlockchain(eventToBeQuired, userRole) {
		let event =await fetch(TicketSystemBlockchainConnectionConstants.TICKET_SYSTEM_GET_EVENT_URL_NEEDPAR+eventToBeQuired, {
			method: 'GET',
			cache: 'no-cache',
			headers: {
			  'Accept': 'application/json',
			  'X-angus-Userid': userRole,
			},
			redirect: 'follow', 
		  })
		  .then((response)=>{return response.json()})
		  .then(async (data)=>{
			  let specificEVent = new EventClass(data.document)
			  return specificEVent	  
			  })
		  .catch((err)=>console.log(err))

		  return event
}

/**
 * This function gets all available events from the blockchain ledger
 * @returns {allAvailableEvents} the available events
 */
 export async function getAvailableEventsFromBlockchain(authorisedName:string, userRole:string) {
		let availableEvents =await fetch(TicketSystemBlockchainConnectionConstants.TICKET_SYSTEM_LIST_EVENTS_URL, {
			method: 'GET',
			cache: 'no-cache',
			headers: {
			  'Accept': 'application/json',
			  'X-angus-Userid': userRole
			},
			redirect: 'follow',
		  })
		  .then((response)=>{return response.json()})
		  .then(async (data)=>{
				if(data.name !="FabricError"){
					let test =await getEventData(data)
					return test
				}
				else{		
				}
			  })

		  return availableEvents
}
/**
 * Calls create event blockchain service and forwards corresponding credentials of it.
 * @param data 
 * @param userRole 
 * @param authorisedName 
 * @returns 
 */
export async function createEventBlockchainCall(data, userRole, authorisedName){

	let test = data.eventDetails.fields;
	let eventCreatorRole = data.userRole;
	test.maximumTicketSellable=Number(data.eventDetails.fields.maximumTicketSellable);
	
	let eventToBeAdded:EventClass=test;

	//generates unique uuid for event 
	eventToBeAdded.eventId=v4.generate();
	eventToBeAdded.feeForNetworkMaintainer=TicketSystemTransactionalFeeConstants.FEEFORNETWORKMAINTAINER;
	eventToBeAdded.publisherOfTicket=authorisedName
	
	let testPutObj:MReqCreateEventClass = new MReqCreateEventClass();
	testPutObj.document=eventToBeAdded;
	testPutObj.header=Date.now();

	let createEvent =await fetch(TicketSystemBlockchainConnectionConstants.TICKET_SYSTEM_CREATE_EVENT_URL, {
		method: 'PUT',
		cache: 'no-cache',
		headers: {
		  'Accept': 'application/json',
		  'X-angus-Userid': eventCreatorRole,
		  'Content-Type': 'application/json'
		},
		body: JSON.stringify(testPutObj)
	  })
	  .then((response)=>{return true})
	  .catch((err)=>{
		  console.log(err)
		  return false})
	  
	  return createEvent;
}

/**
 * Returns a formated EventClass object that is translated from blockchain's response 
 * @param responseJson 
 * @returns 
 */
export async function getEventData(responseJson) {
	console.log("getEventtData is called with data:")
	let allEventsData:EventClass=[];
	responseJson.forEach(event => {
		const eventToBeAdded = new TicketClass(event.document);
		allEventsData.push(eventToBeAdded);
	});
	return allEventsData;
}