import React, { useEffect, useState } from "react";
import useAuth from "../hook/useAuth";

const Leaderboard = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const { token } = useAuth();

  const fetchData = async () => {
    try {
      setLoading(true);
      const response = await fetch("http://localhost:5002/user/all", {
        method: "GET",
        headers: {
          Authorization: `${token}`,
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      const data = await response.json();
      setData(data);
      setLoading(false);
      // Process the fetched data here
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };
  return <div>Leaderboard</div>;
};

export default Leaderboard;
