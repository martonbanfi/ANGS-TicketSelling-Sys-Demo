import { AngusModel } from 'angus-chaincode';
import { EEvent } from '../model/eEvent';
import _ from 'lodash';

const CLASSNAME="tickeSellingSystem.event";

export class Event extends AngusModel {

  private data: EEvent;

  constructor(payload: any, key: string[]) {
    super(Event.getClass(), key);
    Object.assign(this, payload);
  }

  public static getClass(): string {
    return CLASSNAME;
}
  public getData(): EEvent {
    return this.data;
  }
  
  static fromBuffer(buffer: any) {
    return Event.deserialize(buffer);
  }
  
  toBuffer() {
    return Buffer.from(JSON.stringify(this));
  }
  
  static deserialize(data) {
    return AngusModel.deserializeClass(data, Event);
  }

  public setData(data: EEvent) {
    if (!_.isNil(data.eventId)) {this.data.eventId=data.eventId}
    if (!_.isNil(data.eventName)) {this.data.eventName=data.eventName}
    if (!_.isNil(data.sellerFeeToPublisher)) {this.data.sellerFeeToPublisher=data.sellerFeeToPublisher}
    if (!_.isNil(data.publisherOfTicket)) {this.data.publisherOfTicket=data.publisherOfTicket}
    if (!_.isNil(data.maximumTicketSellable)) {this.data.maximumTicketSellable=data.maximumTicketSellable}
    if (!_.isNil(data.currentPriceOfTicket)) {this.data.currentPriceOfTicket=data.currentPriceOfTicket}
    if (!_.isNil(data.feeForNetworkMaintainer)) {this.data.feeForNetworkMaintainer=data.feeForNetworkMaintainer}
    if (!_.isNil(data.eventImage)) {this.data.eventImage=data.eventImage}
    if (!_.isNil(data.startDateOfEvent)) {this.data.startDateOfEvent=data.startDateOfEvent}
    if (!_.isNil(data.endDateOfEvent)) {this.data.endDateOfEvent=data.endDateOfEvent}
    if (!_.isNil(data.locationOfEvent)) {this.data.locationOfEvent=data.locationOfEvent}
  }
}
