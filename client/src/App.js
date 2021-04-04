import "./App.css";
import {
  Col,
  Container,
  Row,
  Input,
  InputGroup,
  InputGroupAddon,
  InputGroupText,
  Button,
  Spinner,
} from "reactstrap";
import { useEffect, useState } from "react";
import MainTable from "./MainTable";
import YearlyTable from "./YearlyTable";
import MonthlyTable from "./MonthlyTable";
import Chart from "./YearlyChart";
import MonthlyChart from "./MonthlyChart";
const axios = require("axios");

const App = () => {
  const [url, setUrl] = useState("");
  const [isUrlValid, setUrlValidity] = useState(false);
  const [isUrlInValid, setUrlInValidity] = useState(false);
  const [data, setData] = useState([]);
  const [yearlyData, setYearlyData] = useState([]);
  const [monthlyData, setMonthlyData] = useState([]);
  const [tableColumns, setTableColumns] = useState([]);
  const [isSpinnerShown, setIsSpinnerShown] = useState(false);
  console.log(data);

  const validateUrl = (url) => {
    if (url === "teasrilanka.org/tea-prices") {
      setUrlValidity(true);
      setUrlInValidity(false);
    } else {
      setUrlValidity(false);
      setUrlInValidity(true);
    }
  };

  const resetValidations = () => {
    if (isUrlInValid === false && isUrlValid === false) return;
    setUrlValidity(false);
    setUrlInValidity(false);
  };

  useEffect(() => {
    if (isUrlValid) {
      setIsSpinnerShown(true);
      axios.get("http://localhost:3001/api/prices/tea").then((response) => {
        console.log(response);
        setData(formatResponseData(response.data));
        setYearlyData(getYearlyData(formatResponseData(response.data)));
        setMonthlyData(getMonthlyData(formatResponseData(response.data)));
        prepareColumns();
      });
    }
  }, [isUrlValid]);

  const handleClick = async () => {
    validateUrl(url);
    console.log(url);
    console.log(isUrlValid);
    console.log("clicked");
    if (isUrlValid) {
      // setIsSpinnerShown(true);
      // const response = await axios.get("http://localhost:3001/api/prices/tea");
      // console.log(response);
      // setData(formatResponseData(response.data));
      // prepareColumns();
    }
    // console.log();
  };

  const getMonthlyData = (_data) => {
    const _monthlyData = {};
    _data.forEach((obj) => {
      if (_monthlyData[obj.month] === undefined) {
        _monthlyData[obj.month] = [obj];
      } else {
        _monthlyData[obj.month].push(obj);
      }
    });
    console.log(_monthlyData);
    return _monthlyData;
  };

  const getYearlyData = (_data) => {
    const _yearlyData = {};
    _data.forEach((obj) => {
      if (_yearlyData[obj.year] === undefined) {
        _yearlyData[obj.year] = [obj];
      } else {
        _yearlyData[obj.year].push(obj);
      }
    });
    console.log(_yearlyData);
    return _yearlyData;
  };

  const getLKRDataByYear = (year) => {
    console.log(yearlyData);
    const _data = yearlyData[year];
    console.log(_data);
    return _data;
    // return _data.filter((obj) => obj.currency !== "usd");
  };

  const getLKRDataByMonth = (month) => {
    console.log(monthlyData);
    const _data = monthlyData[month];
    console.log(_data);
    return _data;
    // return _data.filter((obj) => obj.currency !== "usd");
  };

  const formatResponseData = (_data) => {
    const months = {
      Jan: "January",
      Feb: "February",
      Mar: "March",
      April: "April",
      May: "May",
      June: "June",
      July: "July",
      Aug: "August",
      Sep: "September",
      Oct: "October",
      Nov: "November",
      Dec: "December",
    };
    return _data.map((obj, i) => {
      return {
        id: i + 1,
        price: obj.price === "None" ? null : Number(obj.price).toFixed(2),
        currency: obj.currency,
        month: months[obj.month],
        year: obj.year,
      };
    });
  };

  const prepareColumns = () => {
    // const headers = ["Price", "Currency", "Month", "Year"];
    // const columns = headers.map((header) => ({
    //   Header: header,
    //   accessor: header.toLowerCase(),
    // }));
    const columns = [
      {
        Header: "Price",
        accessor: "price",
        Cell: ({ value }) => (value === null ? "N/A" : value),
      },
      { Header: "Currency", accessor: "currency" },
      { Header: "Month", accessor: "month" },
      { Header: "Year", accessor: "year" },
    ];
    setTableColumns(columns);
  };

  return (
    <Container>
      <Row>
        {/* <Col md="1"></Col> */}
        <Col md="12">
          <Row>
            <Col>
              <div className="h1 mt-3">Price Movements</div>
            </Col>
          </Row>
          <div style={{ margin: "10px 0px" }}></div>
          <div className="url-input">
            <Row>
              <Col md="10">
                <InputGroup size="sm">
                  <InputGroupAddon addonType="prepend">
                    <InputGroupText>http://www.</InputGroupText>
                  </InputGroupAddon>
                  <Input
                    spellCheck="false"
                    onChange={(event) => {
                      console.log(event.target.value);
                      setUrl(event.target.value);
                      resetValidations();
                    }}
                    id="url"
                    placeholder="google.com"
                    valid={isUrlValid}
                    invalid={isUrlInValid}
                  />
                  <div className={"invalid-feedback"}>
                    Site not supported yet. Please try entering a supported
                    site.
                  </div>
                </InputGroup>
              </Col>
              <div style={{ marginLeft: "-1.1rem" }}></div>
              <Col md="2">
                <Button onClick={handleClick} block color="primary" size="sm">
                  Get Data
                </Button>
              </Col>
            </Row>
          </div>
          <Row>
            <Col md>
              <hr />
            </Col>
          </Row>

          <Row>
            <Col md>
              <div style={{ visibility: "visible" }}>
                {data.length !== 0 ? (
                  <div>
                    <Row>
                      <Col md>
                        <MainTable columnData={tableColumns} tableData={data} />
                      </Col>
                    </Row>
                    <hr />
                    <Row>
                      <Col md="5">
                        <YearlyTable
                          columnData={tableColumns}
                          tableData={getLKRDataByYear(2016)}
                          year="2016"
                        />
                      </Col>

                      <Col md="7">
                        <Chart data={getLKRDataByYear(2016)} />
                      </Col>
                    </Row>

                    <hr />
                    <Row>
                      <Col md="5">
                        <MonthlyTable
                          columnData={tableColumns}
                          tableData={getLKRDataByMonth("May")}
                          month="May"
                        />
                      </Col>

                      <Col md="7">
                        <MonthlyChart data={getLKRDataByMonth("May")} />
                      </Col>
                    </Row>
                  </div>
                ) : (
                  <div
                    style={{
                      visibility: isSpinnerShown ? "visible" : "hidden",
                      maxWidth: "122px",
                    }}
                    className={"mx-auto"}
                  >
                    <Spinner
                      style={{ width: "3rem", height: "3rem" }}
                      type="grow"
                      color="primary"
                    />
                    <div style={{ paddingTop: "5px", marginLeft: "-21px" }}>
                      loading data...
                    </div>
                  </div>
                )}
              </div>
            </Col>
          </Row>
        </Col>
      </Row>
    </Container>
  );
};

export default App;
