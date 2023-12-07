import { useContext, useEffect, useState } from "react";
import { getContract, getOrgFactoryContract } from "../utils";
import { ConnectionContext } from "../context/connection";
import toast from "react-hot-toast";
import erc20Abi from "../constants/abis/ERC20.json";
import { testTokenAddress } from "../constants/addresses";

const OrganizationsForm = ({ onClose }: { onClose: () => void }) => {
  const { account, provider } = useContext(ConnectionContext);
  const [form, setForm] = useState({
    name: "",
    token: testTokenAddress,
    amount: "",
  });

  useEffect(() => {
    return () => {
      setForm({
        name: "",
        token: testTokenAddress,
        amount: "",
      });
      toast.remove();
    };
  }, []);

  const createOrg = async () => {
    const orgFactory = await getOrgFactoryContract(provider!, true);
    try {
      const tokenContract = await getContract(
        form.token as `0x${string}`,
        erc20Abi,
        provider!,
        true
      );

      toast.loading("Checking for approval");
      const allowance = Number(
        await tokenContract.allowance(account!, orgFactory.target)
      );

      console.log("allowance", allowance);

      if (allowance < Number(form.amount)) {
        const approvalTx = await tokenContract.approve(
          orgFactory.target,
          form.amount
        );
        await approvalTx.wait();
      }
      toast.remove();
      toast.loading("Creating organization");
      const tx = await orgFactory.createOrganization(
        form.name,
        form.token,
        form.amount
      );

      await tx.wait();
      if (tx) {
        toast.remove();
        toast.success("Organization created");
        onClose();
      }
    } catch (error) {
      console.log("error: ", error);
      toast.remove();
      toast.error("An error occurred");
    }
  };

  return (
    <div className="grid gap-4">
      <div className="form-item">
        <label htmlFor="name">Name</label>
        <input
          type="text"
          name="name"
          id="name"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
        />
      </div>

      <div className="form-item">
        <label htmlFor="token">Token Address</label>
        <input
          type="text"
          name="token"
          id="token"
          value={form.token}
          onChange={(e) => setForm({ ...form, token: e.target.value })}
        />
      </div>

      <div className="form-item">
        <label htmlFor="amount">amount</label>
        <input
          type="text"
          name="amount"
          id="amount"
          value={form.amount}
          onChange={(e) => setForm({ ...form, amount: e.target.value })}
        />
      </div>

      <button className="btn w-full" onClick={createOrg}>
        Create
      </button>
    </div>
  );
};

export default OrganizationsForm;
