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
const Chart = (props) => {
  let data = [];
  if (props.data !== undefined) {
    data = props.data.reduce((filtered, obj) => {
      if (obj.currency !== "usd") {
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
        <CardTitle tag="h5">Year 2016 Visualised</CardTitle>
        <CardText>2016 Average prices in LKR</CardText>

        <LineChart width={600} height={400} data={data}>
          <Line type="monotone" dataKey="price" stroke="#8884d8" />

          <CartesianGrid stroke="#ccc" />
          <XAxis dataKey="month" />
          <YAxis type="number" domain={[200, "dataMax"]} />
          <Tooltip />
        </LineChart>
      </CardBody>
    </Card>
  );
};

export default Chart;
