import { getMyBank, getRequest } from "../utils/api"

export async function getBankNumber(){
    const res = await getMyBank();
    return (await res.json());
}

export async function requestMoney(accountNumber:number, dollars:number){
    const res = await getRequest(accountNumber, dollars);
    return (await res.json());
}