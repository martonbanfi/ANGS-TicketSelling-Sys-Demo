import { ENFTTicket } from '../model/eNFTTicket.ts';
import { EEvent } from '../model/eEvent.ts';
import { ld } from 'https://deno.land/x/deno_lodash/mod.ts';

/**
 * This Class is responsible for holding EEvent blockchain type on the client side (website)
 */
class EventClass implements EEvent{

  constructor(data: EEvent) {
    Object.assign(this, data);
  }

  public getData(): EEvent {
    return this;
  }
}
export default EventClass;
