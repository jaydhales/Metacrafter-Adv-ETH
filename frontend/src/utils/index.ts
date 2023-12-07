import {ethers, toBigInt} from "ethers";
import {rpcUrl, supportedChain} from "../constants";
import {orgFactoryContractAddress} from "../constants/addresses";
import orgFactoryAbi from "../constants/abis/orgFactory.json";

export const isSupportedChain = (chainId: string) =>
   supportedChain === (Number(chainId));

export const shortenAccount = (account: `0x${string}`) =>
   `${account.substring(0, 6)}...${account.substring(38)}`;

export const getReadOnlyProvider = () => {
   return new ethers.JsonRpcProvider(rpcUrl);
};

export const getContract = async (address: `0x${string}`, abi: ethers.InterfaceAbi, provider: ethers.BrowserProvider | ethers.JsonRpcProvider, withWrite: boolean) => {
   let signer;
   if (withWrite) signer = await provider.getSigner();

   return new ethers.Contract(address, abi, withWrite ? signer : provider);
};



export const getContractWithProvider = (address: `0x${string}`, abi: ethers.InterfaceAbi, provider: ethers.BrowserProvider | ethers.JsonRpcProvider) => {
   return new ethers.Contract(address, abi, provider);
};

export const getOrgFactoryContract = async (provider: ethers.JsonRpcProvider | ethers.BrowserProvider, withWrite: boolean) => {
   return await getContract(
      orgFactoryContractAddress,
      orgFactoryAbi,
      provider,
      withWrite
   );
};

export const getOrgFactoryWithProvider = (provider: ethers.BrowserProvider | ethers.JsonRpcProvider) => {
   return getContractWithProvider(
      orgFactoryContractAddress,
      orgFactoryAbi,
      provider
   );
};


export const calculateGasMargin = (value: ethers.BigNumberish | Uint8Array) =>
   (toBigInt(value) * toBigInt(120)) / toBigInt(100);

