import { IAddress } from "./address";

export interface IQuery{
    domain: string, 
    addresses: IAddress[],
    createdAt: string, 
    clientIp: string, 
    _id ?: string
}