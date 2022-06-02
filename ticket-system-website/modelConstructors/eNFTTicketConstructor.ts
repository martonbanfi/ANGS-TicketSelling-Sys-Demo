import { ENFTTicket } from '../model/eNFTTicket.ts';
import { EEvent } from '../model/eEvent.ts';
import { ld } from 'https://deno.land/x/deno_lodash/mod.ts';

/**
 * This Class is responsible for holding ENFTTicket blockchain type on the client side (website)
 */
class TicketClass implements ENFTTicket{

  constructor(data: ENFTTicket) {
    Object.assign(this, data);
  }

  public getData(): ENFTTicket {
    return this;
  }
}
export default TicketClass;
