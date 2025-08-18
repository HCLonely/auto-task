import { generateTransactionId } from './encode';
const url = 'https://raw.githubusercontent.com/fa0311/x-client-transaction-id-pair-dict/refs/heads/main/pair.json';

interface GetTID {
  (method: string, path: string): Promise<string>;
}
/**
 * 获取TID
 * @returns {Promise<Function>} 返回一个函数，用于生成TID
 */
const getTID = async (): Promise<GetTID> => {
  const res = await fetch(url);
  const json = await res.json();
  return async (method: string, path: string) => {
    const randomPair = json[Math.floor(Math.random() * json.length)];
    const { animationKey, verification } = randomPair;
    const tid = await generateTransactionId(method, path, verification, animationKey);
    return tid;
  };
};

export default getTID;
