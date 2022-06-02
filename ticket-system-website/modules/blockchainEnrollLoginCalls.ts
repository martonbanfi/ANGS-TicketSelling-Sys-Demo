import {db} from './db.ts'
//TODO fiz it to be convenient
import TicketSystemBlockchainConnectionConstants from "../TicketSystemConstants/TicketSystemBlockchainConnectionConstants.ts"
import MResEvent from '../model/mResEvent.ts'

import TicketClass from '../modelConstructors/eNFTTicketConstructor.ts'
import EventClass from '../modelConstructors/eEventConstructor.ts'
import MReqMintNFTTicketClass from '../modelConstructors/mReqMintNFTTicketConstructor.ts';
import MReqCreateEventClass from '../modelConstructors/mReqCreateEventConstructor.ts'

import { qrcode } from "https://deno.land/x/qrcode/mod.ts";
import { v4,v5 } from "https://deno.land/std/uuid/mod.ts"
import { time, timezone } from "https://deno.land/x/time.ts/mod.ts";

import {getSpecificEventFromBlockchain} from './blockchainQueriesEventCalls.ts'

/**
 * This function registeres a given role into the blockchain network. These roles are either the followings: admin, partner, customer
 * @param usernameEnroll 
 * @param passwordEnroll 
 * @param registrar 
 * @returns 
 */
export async function enrollRegistrarToBlockchainRole(usernameEnroll:string, passwordEnroll:string, registrar:string) {
	try{
		console.log("enrollRegistrarToBlockchainRole is called")
		let roleToBeEnrolled = { username:usernameEnroll,password:passwordEnroll,registrar:registrar}
		console.log("roleToBeEnrolled: "+JSON.stringify(roleToBeEnrolled))

		let enroll =await fetch(TicketSystemBlockchainConnectionConstants.TICKET_SYSTEM_ENROLL_USER_URL, {
			method: 'POST',
			cache: 'no-cache',
			headers: {
			  'Accept': 'application/json',
			  'Content-Type': 'application/json'
			},
			redirect: 'follow',
			body: JSON.stringify(roleToBeEnrolled)
		  })
		  .then((response)=>{return response.json()})
		  .catch((err)=>console.log(err))

		  return enroll
	}
	catch(err) {
		console.error(err)
	}
}

/**
 * This function enrolls a given role into the blockchain network. These roles are either the followings: admin, partner, customer
 * @param usernameEnroll 
 * @param registrar 
 * @returns 
 */
export async function enrollUserToBlockchainRole(usernameEnroll:string, registrar:string) {
	try{
		let roleToBeEnrolled = { username:registrar,registrar:registrar}
		let enroll =await fetch(TicketSystemBlockchainConnectionConstants.TICKET_SYSTEM_ENROLL_USER_URL, {
			method: 'POST',
			cache: 'no-cache',
			headers: {
			  'Accept': 'application/json',
			  'Content-Type': 'application/json'
			},
			redirect: 'follow',
			body: JSON.stringify(roleToBeEnrolled)
		  })
		  .then((response)=>{return response.json()})
		  .catch((err)=>console.log(err))

		  return enroll
	}
	catch(err) {
		console.error(err)
	}
}