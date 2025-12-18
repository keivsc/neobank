import { sendMoneyByRequest } from "../utils/api";

export async function sendRequest(  requestId: string,
  payload: { toBankNumber: number; amount: number; expiry?: number },
  signature: string){
    const res = await sendMoneyByRequest(requestId, payload, signature);
    return await res.json();
}