import { ENFTTicket } from '../model/eNFTTicket.ts';
import { MReqMintNFTTicket } from '../model/mReqMintNFTTicket.ts';
import { EEvent } from '../model/eEvent.ts';
import { ld } from 'https://deno.land/x/deno_lodash/mod.ts';

/**
 * This Class is responsible for holding MReqMintNFTTicket blockchain type on the client side (website)
 */
class MReqMintNFTTicketClass implements MReqMintNFTTicket{

  constructor(data: MReqMintNFTTicket) {
    Object.assign(this, data);
  }

  public getData(): MReqMintNFTTicket {
    return this;
  }
}
export default MReqMintNFTTicketClass;
