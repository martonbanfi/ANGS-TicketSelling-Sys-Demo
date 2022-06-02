import { ENFTTicket } from '../model/eNFTTicket.ts';
import { MReqModifyNFTTicket } from '../model/mReqModifyNFTTicket.ts';
import { EEvent } from '../model/eEvent.ts';
import { ld } from 'https://deno.land/x/deno_lodash/mod.ts';

/**
 * This Class is responsible for holding MReqModifyNFTTicket blockchain type on the client side (website)
 */
class MReqModifyNFTTicketClass implements MReqModifyNFTTicket{

  constructor(data: MReqModifyNFTTicket) {
    Object.assign(this, data);
  }

  public getData(): MReqModifyNFTTicket {
    return this;
  }
}
export default MReqModifyNFTTicketClass;
