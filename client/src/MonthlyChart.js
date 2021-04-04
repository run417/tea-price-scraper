import React from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from "recharts";
import { Card, CardBody, CardText, CardTitle } from "reactstrap";
const MonthlyChart = (props) => {
  let data = [];
  if (props.data !== undefined) {
    data = props.data.reduce((filtered, obj) => {
      if (
        obj.currency !== "usd" ||
        (obj.year !== 2021 && obj.currency !== "usd")
      ) {
        filtered.push({
          ...obj,
          month: obj.month.length > 3 ? obj.month.substring(0, 3) : obj.month,
        });
      }
      return filtered;
    }, []);
  }
  console.log("data", data);

  return (
    <Card>
      <CardBody>
        <CardTitle tag="h5">May Month Visualised</CardTitle>
        <CardText>May Month Average prices in LKR</CardText>

        <LineChart width={600} height={400} data={data}>
          <Line type="monotone" dataKey="price" stroke="#8884d8" />

          <CartesianGrid stroke="#ccc" />
          <XAxis dataKey="year" />
          <YAxis type="number" domain={[200, "dataMax"]} />
          <Tooltip />
        </LineChart>
      </CardBody>
    </Card>
  );
};

export default MonthlyChart;
