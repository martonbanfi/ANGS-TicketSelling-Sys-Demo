/**
 * Ticket System components definiton
 * No description provided (generated by Swagger Codegen https://github.com/swagger-api/swagger-codegen)
 *
 * OpenAPI spec version: 0.1
 * 
 *
 * NOTE: This class is auto generated by the swagger code generator program.
 * https://github.com/swagger-api/swagger-codegen.git
 * Do not edit the class manually.
 */
import { EEvent } from './eEvent';
import { TRequestHeader } from './tRequestHeader';

/**
 * returns the given event based on its identifier
 */
export interface MReqGetEvent { 
    header?: TRequestHeader;
    document?: EEvent;
}