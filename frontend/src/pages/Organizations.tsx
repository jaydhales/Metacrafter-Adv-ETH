import { useContext, useState } from "react";
import Modal from "../components/Modal";
import OrganizationsForm from "../components/OrganizationsForm";
import { getContractWithProvider, shortenAccount } from "../utils";
import { ConnectionContext } from "../context/connection";
import orgAbi from "../constants/abis/org.json";

const OrgCard = (org: any, provider: any) => {
  const orgContract = getContractWithProvider(org, orgAbi, provider!);
  const orgActive = orgContract.isVestActive().then((r) => r);

  return (
    <div className="border hover:border-blue-300 w-80 rounded-lg p-2 grid gap-1">
      <p>An unnamed org</p>
      <p>{shortenAccount(org)}</p>
      <p>{orgActive}</p>
    </div>
  );
};

const voidFn = () => {};
/* eslint-disable @typescript-eslint/no-explicit-any */
const Organizations = ({
  data,
  refetch,
}: {
  data: any[];
  refetch: () => void;
}) => {
  const [callBack, setCallBack] = useState<() => void>(voidFn);
  const { provider } = useContext(ConnectionContext);

  return (
    <div>
      <p className="text-xl md:text-2xl font-bold text-center mb-6">
        Organizations
      </p>
      {data.length === 0 ? (
        <>
          <p className="text-lg text-center mb-3">
            You don't have any organizations
          </p>
          <Modal
            modalButton={<button className="btn">Create Organization</button>}
            title="Create Organization"
            setCallBack={setCallBack}
            refetch={refetch}
          >
            <OrganizationsForm onClose={callBack} />
          </Modal>
        </>
      ) : (
        data.map((org: any) => (
          <OrgCard key={org} org={org} provider={provider} />
        ))
      )}
    </div>
  );
};

export default Organizations;
