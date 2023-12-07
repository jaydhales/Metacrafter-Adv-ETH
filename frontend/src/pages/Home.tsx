import { Link } from "react-router-dom";

const Home = () => {
  return (
    <div className="w-full min-h-[500px] grid place-content-center gap-4">
      <p className="text-3xl md:text-5xl font-bold min-w-[250px] w-[70vw] text-center">
        Hello, Vest your organization's asset for efficient distribution
      </p>

      <div className="flex justify-center gap-4">
        <Link to="/organizations">
          {" "}
          <button className="btn">My Organizations</button>
        </Link>

        <Link to="/vests">
          {" "}
          <button className="btn">Claimables</button>
        </Link>
      </div>
    </div>
  );
};

export default Home;
