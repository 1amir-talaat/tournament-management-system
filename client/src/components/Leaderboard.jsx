import { useEffect, useState } from "react";
import useAuth from "../hook/useAuth";
import { Spinner } from "@chakra-ui/react";
import Top3Participants from "./Top3Participants";

const Leaderboard = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const { token, user } = useAuth();

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await fetch("http://localhost:5002/users/top", {
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

    fetchData();
  }, [token]);

  console.log(data);

  return (
    <>
      {loading ? (
        <div style={{ height: "86vh" }} className="w-full flex justify-center items-center">
          <Spinner size="lg" />
        </div>
      ) : (
        <>
          <div className="w-full max-w-3xl m-auto p-4 rounded-lg  border-gray-200 dark:border-gray-800">
            <div className="space-y-4">
              <div className="flex items-center space-x-4"></div>
              <Top3Participants data={data} />
              <div className="overflow-auto">
                <table className="min-w-full mt-4 w-full border rounded-lg border-gray-200 dark:border-gray-800">
                  <thead className="text-sm font-medium tracking-wide text-left bg-gray-50 dark:bg-gray-950">
                    <tr className="peer">
                      <th className="px-4 py-3" style={{ width: "20%" }}>
                        Rank
                      </th>
                      <th className="px-4 py-3">Name</th>
                      <th className="px-4 py-3">Score</th>
                    </tr>
                  </thead>
                  <tbody>
                    {data.slice(3).map((student, index) => (
                      <tr key={student.id} className={`bg-white dark:bg-gray-900 ${student.id == user.id && "bg-green-500 bg-opacity-40"}`}>
                        <td
                          className="px-4 py-3"
                          style={{
                            minWidth: "100px",
                          }}
                        >
                          {index + 4}
                        </td>
                        <td className="px-4 py-3">{student.name}</td>
                        <td className="px-4 py-3">{student.points}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
};

export default Leaderboard;
