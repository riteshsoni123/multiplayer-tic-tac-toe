import React from "react";
import { Chart } from "react-google-charts";

function DataPieChart(props) {
  const { email, username, won, lost, drawn } = props;

  const data = [
    ["Data", "Statistics of user"],
    ["Won", won],
    ["Lost", lost],
    ["Drawn", drawn],
  ];

  return (
    <>
      <Chart chartType="PieChart" data={data} width={"100%"} height={"400px"} />
    </>
  );
}

export default DataPieChart;
