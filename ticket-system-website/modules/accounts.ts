import { compare, genSalt, hash } from 'https://deno.land/x/bcrypt@v0.2.4/mod.ts'
import TicketSystemBlockchainConnectionConstants from "../TicketSystemConstants/TicketSystemBlockchainConnectionConstants.ts"
import TicketSystemWebsiteDBConstants from "../TicketSystemConstants/TicketSystemWebsiteDBConstants.ts"

import { db } from './db.ts'
import {getCorrespondingPWForBlockchainRole} from './util.ts'
import {enrollRegistrarToBlockchainRole, enrollUserToBlockchainRole} from './blockchainEnrollLoginCalls.ts'

const saltRounds = 10
const salt = await genSalt(saltRounds)

export interface loginConfig {
	username: string
	password: string
	registrar:string
}

export interface registerConfig {
	username: string
	password: string
	password2?: string
	roleToBeEnrolledIn: string
}

/**
 * Login in the the user to website's database to access its pages and blockchain services 
 * @param credentials 
 * @returns 
 */
export async function login(credentials: loginConfig) {
	let sql = `SELECT count(id) AS count FROM website_accounts WHERE user="${credentials.username}";`
	let records = await db.query(sql)

	if(!records[0].count) throw new Error(`username "${credentials.username}" not found`)
	sql = `SELECT pass,role FROM website_accounts WHERE user = "${credentials.username}";`
	records = await db.query(sql)
	const valid = await compare(credentials.password, records[0].pass)

	if(valid === false) throw new Error(`invalid password for account "${credentials.username}"`)
	const usernameRegistrar={username:credentials.username,registrar:records[0].role};

	return usernameRegistrar
}

/**
 * Registeres the account to website's database
 * @param credentials 
 * @returns 
 */
export async function register(credentials: registerConfig) {
	credentials.password = await hash(credentials.password, salt)
	const sql = `INSERT INTO website_accounts(user, pass, role, balance) VALUES("${credentials.username}", "${credentials.password}", "${credentials.roleToBeEnrolledIn}", ${TicketSystemWebsiteDBConstants.DEFAULT_BALANCE_WHEN_REGISTERING})`

	// check whether role has already been enrolled or not
	let sqlForEnrollRoles = `SELECT count(id) AS count FROM website_accounts WHERE role="${credentials.roleToBeEnrolledIn}";`
	let existingEntitiesWithSameRole = await db.query(sqlForEnrollRoles)

	//enrolls role if its not yet in the system 
	if(existingEntitiesWithSameRole[0].count==0)await enrollRegistrarToBlockchainRole(credentials.roleToBeEnrolledIn,getCorrespondingPWForBlockchainRole(credentials.roleToBeEnrolledIn),credentials.roleToBeEnrolledIn);	

	await db.query(sql)
	return true
}

/**
 * Sends the given amount from userA to userB and changes corresponding balances on website's database
 * @param userA 
 * @param userB 
 * @param amount 
 * @returns 
 */
export async function sendAmountFromAToB(userA:string, userB:string, amount) {
	let sqlbalanceOfUserA = `SELECT balance FROM website_accounts WHERE user="${userA}";`
	let balanceOfUserA = await db.query(sqlbalanceOfUserA)
	let sqlbalanceOfUserB = `SELECT balance FROM website_accounts WHERE user="${userB}";`
	let balanceOfUserB = await db.query(sqlbalanceOfUserB)

	// userA has enough balance on his/her account
	if(balanceOfUserA[0].balance>=amount){
		const newBalanceForA= parseInt(balanceOfUserA[0].balance)-(amount);
		const newBalanceForB = parseInt(balanceOfUserB[0].balance)+(amount);

		let sqlAlterAmountForA = `UPDATE website_accounts SET balance = ${newBalanceForA} WHERE user="${userA}";`
		let sqlAlterAmountForB = `UPDATE website_accounts SET balance = ${newBalanceForB} WHERE user="${userB}";`

		await db.query(sqlAlterAmountForA)
		await db.query(sqlAlterAmountForB)

		let sqlbalanceOfUserA = `SELECT balance FROM website_accounts WHERE user="${userA}";`
		await db.query(sqlbalanceOfUserA)
		let sqlbalanceOfUserB = `SELECT balance FROM website_accounts WHERE user="${userB}";`
		await db.query(sqlbalanceOfUserB)
	}
	else{
		return false
	}
}

/**
 * 
 * @param userA 
 * @param amountSend Sends given amount to userA and changes corresponding balance on website's database
 * @returns 
 */
export async function sendAmountTo(userA:string, amount:number) {
	let sqlbalanceOfUserA = `SELECT balance FROM website_accounts WHERE user="${userA}";`
	let balanceOfUserA = await db.query(sqlbalanceOfUserA)

	// userA has enough balance on his/her account
	if(balanceOfUserA[0].balance>=amount){
		const newBalanceForA= parseInt(balanceOfUserA[0].balance)+(amount);
		let sqlAlterAmountForA = `UPDATE website_accounts SET balance = ${newBalanceForA} WHERE user="${userA}";`
		await db.query(sqlAlterAmountForA)

		let sqlbalanceOfUserAw = `SELECT balance FROM website_accounts WHERE user="${userA}";`
		await db.query(sqlbalanceOfUserAw)
	}
	else{
		return false
	}
}

/**
 * Returns balance of userA
 * @param userA 
 * @returns 
 */
export async function getAmountOfUser(userA:string) {
	let sqlbalanceOfUserA = `SELECT balance FROM website_accounts WHERE user="${userA}";`
	let balanceOfUserA = await db.query(sqlbalanceOfUserA)

	return balanceOfUserA[0].balance;
	
}
