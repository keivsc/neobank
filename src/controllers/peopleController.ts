import { searchNameByAccountNumber } from "../utils/api";

export async function getPeople(accountNumber:number){
    const res = await searchNameByAccountNumber(accountNumber);
    const resJson = await res.json();
    if (res.status !== 200){
        return [];
    }
    return resJson.accounts;
}