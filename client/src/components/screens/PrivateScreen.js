import { React, useState, useEffect } from "react";
import axios from "../../axios";
import { useNavigate } from "react-router-dom";
import DataPieChart from "../DataPieChart";

const PrivateScreen = () => {
  // const { setName } = props;
  const navigate = useNavigate();
  const [error, setError] = useState("");
  const [privateData, setPrivateData] = useState("");

  useEffect(() => {
    if (!localStorage.getItem("authToken")) {
      navigate("/game");
    }

    const fetchPrivateData = async () => {
      const config = {
        headers: {
          contentType: "application/json",
          Authorization: `Bearer ${localStorage.getItem("authToken")}`,
        },
      };

      try {
        const { data } = await axios.get("/api/private", config);
        // setName(data.email);
        setPrivateData(data);
      } catch (error) {
        localStorage.removeItem("authToken");
        setError("You are not authorized please login");
      }
    };
    fetchPrivateData();
  }, [navigate]);

  return error ? (
    <>
      {console.log(error)}
      <span>{error}</span>
    </>
  ) : (
    <>
      <DataPieChart
        email={privateData.email}
        username={privateData.username}
        won={privateData.won}
        lost={privateData.lost}
        drawn={privateData.drawn}
      />
    </>
  );
};

export default PrivateScreen;
