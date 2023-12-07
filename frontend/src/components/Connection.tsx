import { shortenAccount } from "../utils/index";
import { networkInfo } from "../constants";
import { Menu } from "@headlessui/react";
import { useContext } from "react";
import { ConnectionContext } from "../context/connection";

const Connection = () => {
  const { account, isActive, connect } = useContext(ConnectionContext);

  if (!account)
    return (
      <button
        onClick={connect}
        className="inline-flex justify-center rounded-md bg-blue-400 px-4 py-2 text-sm font-medium text-white hover:bg-opacity-90 focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75"
      >
        Connect
      </button>
    );
  return (
    <div className="flex gap-2 items-center">
      <div className="flex gap-2 items-center font-bold">
        <span>{shortenAccount(account)}</span>
      </div>
      <div className="flex gap-2 items-center">
        <div className="relative text-right">
          <Menu as="div" className="relative inline-block text-left">
            <div>
              <Menu.Button className="inline-flex w-full justify-center rounded-md bg-blue-400 px-4 py-2 text-sm font-medium text-white hover:bg-opacity-90 focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75">
                {isActive ? networkInfo?.chainName : "Wrong network"}
              </Menu.Button>
            </div>
          </Menu>
        </div>
      </div>
    </div>
  );
};

export default Connection;
