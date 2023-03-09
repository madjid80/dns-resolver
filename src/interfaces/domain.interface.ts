export interface IPAddress{
    ip: string
}
export interface IDomain{
    domain: string, 
    addresses: IPAddress[],
    createdAt: string, 
    _id ?: string
}