import { Client, ClientConfig } from 'https://deno.land/x/mysql/mod.ts'

const home = String(Deno.env.get('HOME'))
console.log(`HOME: ${home}`)

const conn: ClientConfig = {
	hostname: '127.0.0.1',
	username: 'websiteuser',
	password: 'websitepassword',
	db: 'ticket_system_user_login'
}
console.log(conn)

const db: Client = await new Client().connect(conn)

export { db }
