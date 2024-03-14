import { Button } from "./ui/button";
import useAuth from "../hook/useAuth";
import { Link } from "react-router-dom";

const Landing = () => {
  const { isLogin } = useAuth();
  return (
    <div className="flex item-center" style={{ height: "90vh" }}>
      <div className="text flex h-full  items-center text-star " style={{ width: "50%" }}>
        <div className="w-full" style={{ padingRight: "7vw", paddingLeft: "7vw" }}>
          <p className="text-6xl text-teal-900 font-bold">Welcome to</p>
          <p className="text-4xl font-bold text-teal-800 mb-3">College Tournament</p>
          <p className="text-start text-gray-700 mb-7">
            Discover our streamlined scoring system for college tournaments. From sports to academics, our solution ensures fair and accurate results
            for individual and team competitions.
          </p>
          <Button size={"lg"} variant={"blue"} style={{ fontSize: "20px" }}>
            {isLogin ? <Link to={"/dashboard"}>Go to Dashboard</Link> : <Link to={"/register"}>Get Started</Link>}
          </Button>
        </div>
      </div>
      <div className="img flex items-center" style={{ width: "80%" }}>
        <img src="./src/assets/landing.png" className="w-full" alt="" />
      </div>
    </div>
  );
};

export default Landing;
