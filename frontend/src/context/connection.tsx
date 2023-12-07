import { createContext, useEffect, useState } from "react";
import { getReadOnlyProvider, isSupportedChain } from "../utils";
import { ethers } from "ethers";
import { Contract } from "ethers";

interface EthWindow extends Window {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  ethereum?: any;
}

type TConnect = {
  account: `0x${string}` | undefined;
  chainId: number | undefined;
  isActive: boolean;
  provider: ethers.BrowserProvider | ethers.JsonRpcProvider | undefined;
  connect: () => Promise<void>;
  setReadOnlyOrg?: (contract: Contract) => void;
  [key: string]: unknown;
};

export const ConnectionContext = createContext<TConnect>({
  account: undefined,
  chainId: undefined,
  isActive: false,
  provider: undefined,
  connect: async () => {},
});

const ConnectionProvider = ({ children }: { children: React.ReactNode }) => {
  const [account, setAccount] = useState<`0x${string}`>();
  const [chainId, setChainId] = useState<number>();
  const [isActive, setIsActive] = useState(false);
  const [provider, setProvider] = useState<
    ethers.BrowserProvider | ethers.JsonRpcProvider
  >(getReadOnlyProvider());
  const wind = window as unknown as EthWindow;
  const [readOnlyOrg, setReadOnlyOrg] = useState<Contract>();

  const connect = async () => {
    if (wind.ethereum === undefined)
      return alert("not an ethereum-enabled browser");
    try {
      return wind.ethereum.request({
        method: "eth_requestAccounts",
      });
      console.log("account: ", account);
    } catch (error) {
      console.log("error: ", error);
    }
  };

  const handleAccountChanged = async (accounts: `0x${string}`[]) => {
    if (!accounts.length) {
      setAccount(undefined);
      setChainId(undefined);
      setIsActive(false);
      return setProvider(getReadOnlyProvider());
    }
    const chain = await wind.ethereum.request({
      method: "eth_chainId",
    });

    setAccount(accounts[0]);
    setChainId(Number(chain));
    if (isSupportedChain(chain)) {
      setIsActive(true);
      setProvider(new ethers.BrowserProvider(wind.ethereum));
    } else {
      setIsActive(false);
      setProvider(getReadOnlyProvider());
    }
  };

  const handleChainChanged = (chain: string) => {
    setChainId(Number(chain));
    if (isSupportedChain(chain)) {
      setIsActive(true);
      setProvider(new ethers.BrowserProvider(wind.ethereum));
    } else {
      setIsActive(false);
      setProvider(getReadOnlyProvider());
    }
  };

  const eagerlyConnect = async () => {
    if (wind.ethereum === undefined) return;
    const accounts = await wind?.ethereum?.request({
      method: "eth_accounts",
    });

    if (!accounts.length) return;

    handleAccountChanged(accounts);
  };

  useEffect(() => {
    if (wind.ethereum === undefined) return;
    eagerlyConnect();
    wind.ethereum.on("chainChanged", handleChainChanged);

    wind.ethereum.on("accountsChanged", handleAccountChanged);

    return () => {
      wind.ethereum.removeListener("accountsChanged", handleAccountChanged);

      wind.ethereum.removeListener("chainChanged", handleChainChanged);
    };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const value = {
    account,
    chainId,
    isActive,
    provider,
    connect,
    readOnlyOrg,
    setReadOnlyOrg,
  };

  return (
    <ConnectionContext.Provider value={value}>
      {children}
    </ConnectionContext.Provider>
  );
};

export default ConnectionProvider;
