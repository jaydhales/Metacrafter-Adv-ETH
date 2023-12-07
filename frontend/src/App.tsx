import "./App.css";
import { RouterProvider, createBrowserRouter } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import Header from "./components/Header";
import Organizations from "./pages/Organizations";
import Vests from "./pages/Vests";
import Home from "./pages/Home";
import { useCallback, useContext, useEffect, useState } from "react";
import { ConnectionContext } from "./context/connection";
import { getOrgFactoryContract } from "./utils";

function App() {
  const [adminOrgs, setAdminOrgs] = useState([]);
  const [userOrgs, setUserOrgs] = useState([]);

  const { account, provider, setReadOnlyOrg } = useContext(ConnectionContext);

  const getOrgs = useCallback(async () => {
    const orgFactory = await getOrgFactoryContract(provider!, false);

    setReadOnlyOrg?.(orgFactory);

    setUserOrgs(await orgFactory.getUserOrganizations(account!));
    setAdminOrgs(await orgFactory.getOwnerOrganizations(account!));
  }, [account, provider, setReadOnlyOrg]);

  useEffect(() => {
    if (!account) return;
    getOrgs().then((r) => r);
  }, [account, getOrgs]);
  const router = createBrowserRouter([
    {
      path: "/",
      element: <Home />,
    },
    {
      path: "/organizations",
      element: <Organizations data={adminOrgs} refetch={getOrgs} />,
    },
    {
      path: "/vests",
      element: <Vests data={userOrgs} />,
    },
  ]);
  return (
    <div className="App">
      <Toaster position="top-center" />
      <Header />
      <main className="mt-10">
        <RouterProvider router={router} />
      </main>
    </div>
  );
}

export default App;
