import { getNameByAccountNumber, sendMoney } from "../utils/api";

export async function sendButtonClicked(accountNumber:number, amount:number){
    if (amount<0.01){
        return "Please Specify an amount.";
    }

    const res = await sendMoney(accountNumber, amount);
    if(res.status !== 200){
        return (await res.json());
    }
    return "success";
}

export async function getName(accountNumber:number){
    const res = await getNameByAccountNumber(accountNumber);
    const resJson = await res.json();
    if (res.status!==200){
        throw new Error();
    }
    return resJson.name;
}