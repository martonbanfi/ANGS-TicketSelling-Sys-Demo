/*
 * Copyright IBM Corp. All Rights Reserved.
 *
 * SPDX-License-Identifier: Apache-2.0
*/

import { AngusContract, AngusContext, AngusController, AngusChaincodeError, AngusErrorCodes }  from 'angus-chaincode';

// NFT ticket credentials import
import { ENFTTicket } from '../model/eNFTTicket';
import { MReqMintNFTTicket } from '../model/mReqMintNFTTicket';
import { MReqModifyNFTTicket } from '../model/mReqModifyNFTTicket';
import { MResStatus } from '../model/mResStatus';
import { MResTicket } from '../model/mResTicket';

import { Ticket } from './ticket';
import _ from 'lodash';


const balancePrefix = 'balance';
const nftPrefix = 'nft';
const approvalPrefix = 'approval';

// Define key names for options
const nameKey = 'name';
const symbolKey = 'symbol';

interface TCommonId { id: string }
interface TOwnerOfNFT {owner: string}

class TicketContext extends AngusContext {
    public ticketList: AngusController;
    public eventList: AngusController;

    constructor() {
        super();
        this.ticketList= new AngusController(this, Ticket.getClass());
        this.ticketList.use(Ticket);
        this.eventList= new AngusController(this, Event.getClass());
        this.eventList.use(Event);
    }
}


export class TicketContract extends AngusContract {

    /**
     * Define a custom context for nft tickets
    */
    public createContext() {
        return new TicketContext();
    }

    /**
     * Instantiate to perform any setup of the ledger that might be required.
     * @param {Context} ctx the transaction context
     */
    async instantiate(ctx) {
        // No implementation required with this example
        // It could be where data migration is performed, if necessary
        console.log('Instantiate the contract');
    }

    /**
     * Mints a NFTTicket based on provided parameters
     * @param ctx 
     * @param input 
     * @returns 
     */
    public async mintNFTTicket(ctx: TicketContext, input: string): Promise<MResTicket> {
        const _inputObj:MReqMintNFTTicket = JSON.parse(input);
  
        // _inputObj.document.ticketHash is a uuid
        const _ticket: Ticket = await ctx.ticketList.getModel(_inputObj.document.ticketHash);

        //check corresponding event in the ledger TODO
        const _ticketsEvent: Event = await ctx.eventList.getModel(_inputObj.document.eventId);

        //let correspondingEventData= _ticketsEvent.getData();
  
        if (!_.isNil(_ticket)) {
          ctx.getLogger("mintNFTTicket").error(`Ticket ${JSON.stringify(_inputObj.document.ticketHash)} already exists.`);
          throw new AngusChaincodeError(AngusErrorCodes.ENTITY_ALREADY_EXISTS);
        }
        if (_.isNil(_ticketsEvent)) {
            ctx.getLogger("mintNFTTicket").error(`Ticket ${_ticketsEvent} does not exists.`);
            throw new AngusChaincodeError(AngusErrorCodes.ENTITY_ALREADY_EXISTS);
        }
        // actually create the ticket based on input values
        // first parameter inputs values, second establishes the key, in that case the ticket hash
        
        const _nftTicket: Ticket = new Ticket (
             { data: _inputObj.document }, [_inputObj.document.ticketHash]);

        //added corresponding event data to NFT ticket
        _nftTicket.setEventData(_ticketsEvent.getData())

        await ctx.ticketList.addModel(_nftTicket);
  
        return {
          header: {trId: ctx.stub.getTxID()},
          document: _nftTicket.getData()
        }
      }

      public async testService(ctx: TicketContext, input: string): Promise<String> {
        
        return "HelloWorld"
      }

      public async getNFTTicket(ctx: TicketContext, input: string): Promise<MResTicket> {
        const _inputObj:TCommonId = JSON.parse(input);
        const _nftTicket: Ticket = await ctx.ticketList.getModel(_inputObj.id);
  
        if (_.isNil(_nftTicket)) {
          ctx.getLogger("getNFTTicket").error(`NFTTicket ${_inputObj.id} doesn't exist.`);
          throw new AngusChaincodeError(AngusErrorCodes.ENTITY_NOT_EXIST);
        }    
  
        return {
          header: { trId: ctx.stub.getTxID()},
          document: _nftTicket.getData()
        }
      }

      public async listNFTTickets(ctx: TicketContext, input: string): Promise<MResTicket[]> {

        // list only items that are listed on the secondary market 
        const _nftTickets: ENFTTicket[] = await ctx.ticketList.getModelList({selector: {class: Ticket.getClass(),data: {isOnSecondaryMarket: true } } })
        const retval: MResTicket[]=[];
  
        _.forEach(_nftTickets, (_nftTicket)=>{
          if (!_.isNil(_nftTicket)) {
            retval.push({header: {trId: ctx.stub.getTxID() }, document: _nftTicket });
          }
        });
        return retval;
      }

      public async listOwnedNFTTickets(ctx: TicketContext, input: string): Promise<MResTicket[]> {
        const _inputObj:TOwnerOfNFT = JSON.parse(input);
        const ownerToQueryFor = _inputObj.owner;

        const _nftTickets: ENFTTicket[] = await ctx.ticketList.getModelList({selector: {class: Ticket.getClass(),data: {currentOwnerOfTicket: ownerToQueryFor }} })
        const retval: MResTicket[]=[];
  
        _.forEach(_nftTickets, (_nftTicket)=>{
          if (!_.isNil(_nftTicket)) {
            retval.push({header: {trId: ctx.stub.getTxID() }, document: _nftTicket });
          }
        });
        return retval;
      }

      public async modifyNFTTicket(ctx: TicketContext, input: string): Promise<MResTicket> {
        const _inputObj:MReqModifyNFTTicket = JSON.parse(input);
  
        const _nftTicket: Ticket = await ctx.ticketList.getModel(_inputObj.document.ticketHash);
  
        if (_.isNil(_nftTicket)) {
          ctx.getLogger("modifyNFTTicket").error(`NFTTicket ${_inputObj.document.ticketHash} doesn't exist.`);
          throw new AngusChaincodeError(AngusErrorCodes.ENTITY_NOT_EXIST);
        }
        
        _nftTicket.setData(_inputObj.document);
        await ctx.ticketList.updateModel(_nftTicket);
  
        return {
          header: { trId: ctx.stub.getTxID()},
          document: _nftTicket.getData()
        }
  
      }

      public async removeNFTTicket(ctx: TicketContext, input: string): Promise<MResStatus> {

        const _inputObj:TCommonId = JSON.parse(input);
        const _nftTicket: Ticket = await ctx.ticketList.getModel(_inputObj.id);
  
        if (_.isNil(_nftTicket)) {
          ctx.getLogger("removeNFTTicket").error(`NFTTicket ${_inputObj.id} doesn't exists.`);
          throw new AngusChaincodeError(AngusErrorCodes.ENTITY_NOT_EXIST);
        }
  
        ctx.ticketList.deleteModel(_nftTicket);
  
        return {
          header: {trId: ctx.stub.getTxID()},
          status: {code: "OK"} 
        }      
      }
}



// NFT ticket credentials import
import { EEvent } from '../model/eEvent';
import { MReqCreateEvent } from '../model/mReqCreateEvent';
import { MReqModifyEvent } from '../model/mReqModifyEvent';
import { MResEvent } from '../model/mResEvent';
import { Event } from './event';
import { debug } from 'console';


interface TCommonEventId { id: string }

class EventContext extends AngusContext {
    public eventList: AngusController;

    constructor() {
        super();
        this.eventList= new AngusController(this, Event.getClass());
        this.eventList.use(Event);
    }
}

export class EventContract extends AngusContract {

    /**
     * Define a custom context for nft tickets
    */
    public createContext() {
        return new EventContext();
    }

    /**
     * Instantiate to perform any setup of the ledger that might be required.
     * @param {Context} ctx the transaction context
     */
    async instantiate(ctx) {
        // No implementation required with this example
        // It could be where data migration is performed, if necessary
        console.log('Instantiate the contract');
    }

    /**
     * Creates an event based on provided parameters
     * @param ctx 
     * @param input 
     * @returns 
     */
    public async createEvent(ctx: TicketContext, input: string): Promise<MResEvent> {
        const _inputObj:MReqCreateEvent = JSON.parse(input);
  
        const _event: Event = await ctx.eventList.getModel(_inputObj.document.eventId);
  
        if (!_.isNil(_event)) {
          ctx.getLogger("createEvent").error(`Event with ${_inputObj.document.eventId} already exists.`);
          throw new AngusChaincodeError(AngusErrorCodes.ENTITY_ALREADY_EXISTS);
        }
        // actually create the ticket based on input values
        // first parameter inputs values, second establishes the key, in that case the ticket hash
        const _createdEvent: Event = new Event (
             { data: _inputObj.document }, [_inputObj.document.eventId]);
        await ctx.eventList.addModel(_createdEvent);
  
        return {
          header: {trId: ctx.stub.getTxID()},
          document: _createdEvent.getData()
        }
      }


      public async getEvent(ctx: TicketContext, input: string): Promise<MResEvent> {
        const _inputObj:TCommonEventId = JSON.parse(input);
        console.log("GET EVENT WITH ID:"+_inputObj.id)
        const _event: Event = await ctx.eventList.getModel(_inputObj.id);
  
        if (_.isNil(_event)) {
          ctx.getLogger("getEvent").error(`Event with ${_inputObj.id} doesn't exist.`);
          throw new AngusChaincodeError(AngusErrorCodes.ENTITY_NOT_EXIST);
        }    
  
        return {
          header: { trId: ctx.stub.getTxID()},
          document: _event.getData()
        }
      }

      public async listAvailableEvents(ctx: TicketContext, input: string): Promise<MResEvent[]> {

        const _availableEvents: EEvent[] = await ctx.eventList.getModelList({selector: {class: Event.getClass() } })
        const retval: MResEvent[]=[];
  
        _.forEach(_availableEvents, (_event)=>{
          if (!_.isNil(_event)) {
            retval.push({header: {trId: ctx.stub.getTxID() }, document: _event });
          }
        });
        return retval;
      }

      public async modifyEvent(ctx: TicketContext, input: string): Promise<MResEvent> {
        const _inputObj:MReqModifyEvent = JSON.parse(input);
  
        const _event: Event = await ctx.eventList.getModel(_inputObj.document.eventId);
  
        if (_.isNil(_event)) {
          ctx.getLogger("modifyNFTTicket").error(`NFTTicket ${_inputObj.document.eventId} doesn't exist.`);
          throw new AngusChaincodeError(AngusErrorCodes.ENTITY_NOT_EXIST);
        }
        
        _event.setData(_inputObj.document);
        await ctx.eventList.updateModel(_event);
  
        return {
          header: { trId: ctx.stub.getTxID()},
          document: _event.getData()
        }
  
      }

      public async removeEvent(ctx: TicketContext, input: string): Promise<MResStatus> {

        const _inputObj:TCommonEventId = JSON.parse(input);
        const _event: Ticket = await ctx.eventList.getModel(_inputObj.id);
  
        if (_.isNil(_event)) {
          ctx.getLogger("removeEvent").error(`Event with ${_inputObj.id} doesn't exists.`);
          throw new AngusChaincodeError(AngusErrorCodes.ENTITY_NOT_EXIST);
        }
  
        ctx.eventList.deleteModel(_event);
  
        return {
          header: {trId: ctx.stub.getTxID()},
          status: {code: "OK"} 
        }      
      }
}
