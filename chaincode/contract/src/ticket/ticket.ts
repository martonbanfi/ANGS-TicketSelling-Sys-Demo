import { AngusModel } from 'angus-chaincode';
import { ENFTTicket } from '../model/ENFTTicket';
import _ from 'lodash';
import { EEvent } from '../model/eEvent';

const CLASSNAME="tickeSellingSystem.ticket";

export class Ticket extends AngusModel {

  private data: ENFTTicket;

  constructor(payload: any, key: string[]) {
    super(Ticket.getClass(), key);
    Object.assign(this, payload);
  }

  public static getClass(): string {
    return CLASSNAME;
}
  public getData(): ENFTTicket {
    return this.data;
  }
  /*
  public fromBuffer(data, key) {
    let json = JSON.parse(data.toString());
    let object = new Ticket(json, key);
    return object;
  }
  */
  static fromBuffer(buffer: any) {
    return Ticket.deserialize(buffer);
  }
  
  toBuffer() {
    return Buffer.from(JSON.stringify(this));
  }
  
  static deserialize(data) {
    return AngusModel.deserializeClass(data, Ticket);
  }

  public setData(data: ENFTTicket) {
    if (!_.isNil(data.ticketHash)) {this.data.ticketHash=data.ticketHash}
    if (!_.isNil(data.currentOwnerOfTicket)) {this.data.currentOwnerOfTicket=data.currentOwnerOfTicket}
    if (!_.isNil(data.currentPriceOfTicket)) {this.data.currentPriceOfTicket=data.currentPriceOfTicket}
    if (!_.isNil(data.previousOwnerOfTicket)) {this.data.previousOwnerOfTicket=data.previousOwnerOfTicket}
    if (!_.isNil(data.previousPriceOfTicket)) {this.data.previousPriceOfTicket=data.previousPriceOfTicket}
    if (!_.isNil(data.lastTradedAt)) {this.data.lastTradedAt=data.lastTradedAt}
    if (!_.isNil(data.eventId)) {this.data.eventId=data.eventId}
    if (!_.isNil(data.eventName)) {this.data.eventName=data.eventName}
    if (!_.isNil(data.sellerFeeToPublisher)) {this.data.sellerFeeToPublisher=data.sellerFeeToPublisher}
    if (!_.isNil(data.publisherOfTicket)) {this.data.publisherOfTicket=data.publisherOfTicket}
    if (!_.isNil(data.maximumTicketSellable)) {this.data.maximumTicketSellable=data.maximumTicketSellable}
    if (!_.isNil(data.feeForNetworkMaintainer)) {this.data.feeForNetworkMaintainer=data.feeForNetworkMaintainer}
    if (!_.isNil(data.ticketImage)) {this.data.ticketImage=data.ticketImage}
    if (!_.isNil(data.eventImage)) {this.data.eventImage=data.eventImage}
    if (!_.isNil(data.startDateOfEvent)) {this.data.startDateOfEvent=data.startDateOfEvent}
    if (!_.isNil(data.endDateOfEvent)) {this.data.endDateOfEvent=data.endDateOfEvent}
    if (!_.isNil(data.locationOfEvent)) {this.data.locationOfEvent=data.locationOfEvent}
    if (!_.isNil(data.isOnSecondaryMarket)) {this.data.isOnSecondaryMarket=data.isOnSecondaryMarket}
    
    
  }

  public setEventData(data: EEvent) {
    if (!_.isNil(data.eventId)) {this.data.eventId=data.eventId}
    if (!_.isNil(data.eventName)) {this.data.eventName=data.eventName}
    if (!_.isNil(data.sellerFeeToPublisher)) {this.data.sellerFeeToPublisher=data.sellerFeeToPublisher}
    if (!_.isNil(data.publisherOfTicket)) {this.data.publisherOfTicket=data.publisherOfTicket}
    if (!_.isNil(data.maximumTicketSellable)) {this.data.maximumTicketSellable=data.maximumTicketSellable}
    if (!_.isNil(data.feeForNetworkMaintainer)) {this.data.feeForNetworkMaintainer=data.feeForNetworkMaintainer}
    if (!_.isNil(data.eventImage)) {this.data.eventImage=data.eventImage}
    if (!_.isNil(data.startDateOfEvent)) {this.data.startDateOfEvent=data.startDateOfEvent}
    if (!_.isNil(data.endDateOfEvent)) {this.data.endDateOfEvent=data.endDateOfEvent}
    if (!_.isNil(data.locationOfEvent)) {this.data.locationOfEvent=data.locationOfEvent}
  }
}
