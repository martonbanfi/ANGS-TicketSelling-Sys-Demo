import {db} from './db.ts'
import TicketSystemBlockchainConnectionConstants from "../TicketSystemConstants/TicketSystemBlockchainConnectionConstants.ts"
import MResEvent from '../model/mResEvent.ts'

import TicketClass from '../modelConstructors/eNFTTicketConstructor.ts'
import EventClass from '../modelConstructors/eEventConstructor.ts'
import MReqMintNFTTicketClass from '../modelConstructors/mReqMintNFTTicketConstructor.ts';
import MReqModifyNFTTicketClass from '../modelConstructors/mReqModifyNFTTicketConstructor.ts';
import MReqCreateEventClass from '../modelConstructors/mReqCreateEventConstructor.ts'

import { qrcode } from "https://deno.land/x/qrcode/mod.ts";
import { v4,v5 } from "https://deno.land/std/uuid/mod.ts"
import { time, timezone } from "https://deno.land/x/time.ts/mod.ts";

import {getSpecificEventFromBlockchain} from './blockchainQueriesEventCalls.ts'
import {sendAmountFromAToB, sendAmountTo} from './accounts.ts'
import TicketSystemTransactionalFeeConstants from '../TicketSystemConstants/TicketSystemTransactionalFeeConstants.ts'

/**
 * Returns a specific NFTTicket from the blockchain's ledger
 * @param ticketToBeQuired 
 * @param userRole 
 * @returns 
 */
export async function getSpecificNFTTicketFromBlockchain(ticketToBeQuired, userRole) {
	let ticket =await fetch(TicketSystemBlockchainConnectionConstants.TICKET_SYSTEM_GET_NFTTICKET_URL_NEEDPAR+ticketToBeQuired, {
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
		  let specificTicket = new TicketClass(data.document)
		  return specificTicket	  
		  })
	  .catch((err)=>console.log(err))

	  return ticket
}

/**
 * This function gets all available NFTTickets that are listed on the Secondary Market
 * @returns {allOwnedNFTs} the owned NFTs 
 */
export async function getAllNFTTicketsSecondaryMarketFromBlockchain(userRole, authorisedName) {
	try{
		let allOwnedNFTs =await fetch(TicketSystemBlockchainConnectionConstants.TICKET_SYSTEM_LIST_NFTTICKETS_URL, {
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
			  let test =await getNFTTicketData(data)
			  return test})
		  .catch((err)=>console.log(err))

		  return allOwnedNFTs
	}
	catch(err) {
		console.error(err)
	}
}

/**
 * Returns all owned NFTTickets from the blockchain's ledger
 * @param userRole 
 * @param authorisedName 
 * @returns 
 */
export async function getAllOwnedNFTTicketsFromBlockchain(userRole, authorisedName) {
	try{
		let allOwnedNFTs =await fetch(TicketSystemBlockchainConnectionConstants.TICKET_SYSTEM_LIST__OWNED_NFTTICKETS_URL_NEEDPAR+authorisedName, {
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
			  let nftTicketsData =await getNFTTicketData(data)
			  return nftTicketsData})
		  .catch((err)=>console.log(err))

		  return allOwnedNFTs
	}
	catch(err) {
		console.error(err)
	}
}

/**
 * Mints an NFTTicket for a given event
 * @param data 
 * @param userRole 
 * @param authorisedName 
 * @returns 
 */
export async function mintNFTTicketBlockchainCall(data, userRole, authorisedName) {
	let localEventId = data.fields.eventId;
	let localticketType= data.fields.ticketType;
	let localticketNumber = data.fields.ticketNumber;
	let correspondingEventData: EventClass = await getSpecificEventFromBlockchain(localEventId, userRole);

	// first assign all event data
	let nftTicketToBeSent = new TicketClass(correspondingEventData);

	//-------setting variables of the NFTTicket----------
	nftTicketToBeSent.ticketHash = v4.generate();

	nftTicketToBeSent.currentOwnerOfTicket = authorisedName;
	nftTicketToBeSent.currentPriceOfTicket = correspondingEventData.correspondingEventData;
	nftTicketToBeSent.mintedAt = time().toString();
	nftTicketToBeSent.lastTradedAt = time().toString();

	nftTicketToBeSent.ticketNumber = Number(localticketNumber);
	nftTicketToBeSent.ticketType = localticketType;
	nftTicketToBeSent.currentPriceOfTicket = correspondingEventData.currentPriceOfTicket;
	nftTicketToBeSent.previousPriceOfTicket = correspondingEventData.currentPriceOfTicket
	nftTicketToBeSent.previousOwnerOfTicket = authorisedName;
	nftTicketToBeSent.ticketImage = await qrcode(nftTicketToBeSent.ticketHash, { size: 100 });
	
	//newly minted, could not be on the secondary market
	nftTicketToBeSent.isOnSecondaryMarket=false;

	let mReqMintNFTTicket:MReqMintNFTTicketClass = new MReqMintNFTTicketClass();
	mReqMintNFTTicket.document=nftTicketToBeSent;
	mReqMintNFTTicket.header=Date.now();	

	// deduct cost of ticket from user 
	await sendAmountFromAToB(authorisedName,nftTicketToBeSent.publisherOfTicket, Number(correspondingEventData.currentPriceOfTicket))
	await sendAmountTo(TicketSystemBlockchainConnectionConstants.TICKET_SYSTEM_ENROLL_ADMIN_ROLE, Math.round(Number(correspondingEventData.currentPriceOfTicket)*(TicketSystemTransactionalFeeConstants.FEEFORNETWORKMAINTAINER/100)))

	let mintNFTTicket =await fetch(TicketSystemBlockchainConnectionConstants.TICKET_SYSTEM_MINT_NFTTICKET_URL, {
		method: 'PUT', 
		cache: 'no-cache', 
		headers: {
		  'Accept': 'application/json',
		  'X-angus-Userid': userRole,
		  'Content-Type': 'application/json'
		},
		
		body: JSON.stringify(mReqMintNFTTicket)
	  })
	  .then((response)=>{return true})
	  .catch((err)=>{
		  console.log(err)
		  return false})
	  
	  return mintNFTTicket;

}

/**
 * Modifys a given NFTTicket's attributes based on new data
 * @param data 
 * @param userRole 
 * @param authorisedName 
 * @returns 
 */
export async function modifyNFTTicketBlockchainCall(data,userRole,authorisedName) {
	let localTicketHash = data.fields.ticketHash;
	let localNewPriceOfTicket = data.fields.newPriceOfTicket;
	let localticketType= data.fields.ticketType;
	let localticketNumber = data.fields.ticketNumber;

	let correspondingTicketData: TicketClass = await getSpecificNFTTicketFromBlockchain(localTicketHash, userRole);	

	// first assign all event data
	let nftTicketToBeSent = new TicketClass(correspondingTicketData);

	// modify ownership
	nftTicketToBeSent.previousOwnerOfTicket = nftTicketToBeSent.currentOwnerOfTicket;
	nftTicketToBeSent.currentOwnerOfTicket = authorisedName;

	//modify price
	nftTicketToBeSent.previousPriceOfTicket = nftTicketToBeSent.currentPriceOfTicket
	nftTicketToBeSent.currentPriceOfTicket = localNewPriceOfTicket;

	nftTicketToBeSent.isOnSecondaryMarket=false;

	//increase seller balance
	let transactionBetweenParties = await sendAmountFromAToB(nftTicketToBeSent.currentOwnerOfTicket,nftTicketToBeSent.previousOwnerOfTicket, Number(localNewPriceOfTicket))
	let transationToOrganiser =await sendAmountTo(nftTicketToBeSent.publisherOfTicket, Math.round(localNewPriceOfTicket*(nftTicketToBeSent.sellerFeeToPublisher/100)))
	let transationToNetworkProvider =await sendAmountTo(TicketSystemBlockchainConnectionConstants.TICKET_SYSTEM_ENROLL_ADMIN_ROLE, Math.round(localNewPriceOfTicket*(TicketSystemTransactionalFeeConstants.FEEFORNETWORKMAINTAINER/100)))

	nftTicketToBeSent.lastTradedAt = time().toString();

	let modifiedNFTTicket:MReqModifyNFTTicketClass = new MReqModifyNFTTicketClass();
	modifiedNFTTicket.document=nftTicketToBeSent;
	modifiedNFTTicket.header=Date.now();
	
	let modifyNFTTicketBlockchainCall =await fetch(TicketSystemBlockchainConnectionConstants.TICKET_SYSTEM_MODIFY_NFTTICKET_URL, {
		method: 'POST',
		cache: 'no-cache',
		headers: {
		  'Accept': 'application/json',
		  'X-angus-Userid': userRole,
		  'Content-Type': 'application/json'
		},
		body: JSON.stringify(modifiedNFTTicket)
	  })
	  .then((response)=>{
		console.log(JSON.stringify(response))  
		return true})
	  .catch((err)=>{
		  console.log(err)
		  return false})
	  
	  return modifyNFTTicketBlockchainCall;
}

/**
 * Alters the appearance of a NFTTicket on the secondary market
 * @param localTicketHash 
 * @param userRole 
 * @param desiredApperanceOnSecondaryMarket 
 * @returns 
 */
export async function alterNFTTicketAppOnSecondaryMarketBlockchainCall(localTicketHash,userRole, desiredApperanceOnSecondaryMarket) {
	let correspondingTicketData: TicketClass = await getSpecificNFTTicketFromBlockchain(localTicketHash, userRole);

	// first assign all event data
	let nftTicketToBeSent = new TicketClass(correspondingTicketData);

	// modify ownership
	nftTicketToBeSent.isOnSecondaryMarket = desiredApperanceOnSecondaryMarket;

	let modifiedNFTTicket:MReqModifyNFTTicketClass = new MReqModifyNFTTicketClass();
	modifiedNFTTicket.document=nftTicketToBeSent;
	modifiedNFTTicket.header=Date.now();
	
	let modifyNFTTicketBlockchainCall =await fetch(TicketSystemBlockchainConnectionConstants.TICKET_SYSTEM_MODIFY_NFTTICKET_URL, {
		method: 'POST',
		cache: 'no-cache',
		headers: {
		  'Accept': 'application/json',
		  'X-angus-Userid': userRole,
		  'Content-Type': 'application/json'
		},
		body: JSON.stringify(modifiedNFTTicket)
	  })
	  .then((response)=>{
		return true})
	  .catch((err)=>{
		  console.log(err)
		  return false})
	  
	  return modifyNFTTicketBlockchainCall;
}

/**
 * Transforms NFTTicket data into TicketClass object from blockchain response
 * @param responseJson 
 * @returns 
 */
export async function getNFTTicketData(responseJson) {
	let allNFTTicketData:TicketClass=[];
	responseJson.forEach(NFTTicket => {
		const nftTicketToBeAdded = new TicketClass(NFTTicket.document);
		allNFTTicketData.push(nftTicketToBeAdded);
	});
	return allNFTTicketData;
}