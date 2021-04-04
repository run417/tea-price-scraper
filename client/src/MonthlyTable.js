import React, { useMemo } from "react";
import { useTable } from "react-table";
import { Table, Card, CardBody, CardTitle, CardText } from "reactstrap";

const YearlyTable = (props) => {
  const columns = useMemo(() => {
    if (props.columnData !== undefined) {
      return props.columnData.filter((d) => d.accessor !== "month");
    }
    return props.columnData;
  }, [props.columnData]);
  const data = useMemo(() => {
    if (props.tableData !== undefined) {
      return props.tableData.filter((d) => d.currency !== "usd");
    }
    return props.tableData;
  }, [props.tableData]);

  const tableInstance = useTable({ columns, data });

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    rows,
    prepareRow,
  } = tableInstance;

  return (
    <Card>
      <CardBody>
        <CardTitle tag="h5">{props.month} Month Average Price</CardTitle>
        <CardText>
          Monthly Tea Auction average prices for all three elevations in SL. Rs
          per Kg in all years for the month of {props.month}
        </CardText>
        <Table bordered {...getTableProps}>
          <thead>
            {headerGroups.map((headerGroup) => (
              <tr {...headerGroup.getHeaderGroupProps()}>
                {headerGroup.headers.map((column) => (
                  <th {...column.getHeaderProps()}>
                    {column.render("Header")}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody {...getTableBodyProps}>
            {rows.map((row) => {
              prepareRow(row);
              return (
                <tr {...row.getRowProps()}>
                  {row.cells.map((cell) => {
                    return (
                      <td {...cell.getCellProps()}>{cell.render("Cell")}</td>
                    );
                  })}
                </tr>
              );
            })}
          </tbody>
        </Table>
      </CardBody>
    </Card>
  );
};

export default YearlyTable;
