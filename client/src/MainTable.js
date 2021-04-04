import React, { useMemo } from "react";
import { useTable, usePagination, useSortBy } from "react-table";
import {
  Pagination,
  PaginationItem,
  PaginationLink,
  Table,
  Row,
  Col,
  Card,
  CardBody,
  CardTitle,
  CardText,
} from "reactstrap";

const MainTable = (props) => {
  const columns = useMemo(() => props.columnData, [props.columnData]);
  const data = useMemo(() => props.tableData, [props.tableData]);

  const tableInstance = useTable({ columns, data }, useSortBy, usePagination);

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    page,
    nextPage,
    previousPage,
    canNextPage,
    canPreviousPage,
    pageOptions,
    state,
    prepareRow,
  } = tableInstance;

  const { pageIndex } = state;

  return (
    <Card>
      <CardBody>
        <CardTitle tag="h5">Monthly Tea Auction Average Price</CardTitle>
        <CardText>
          Monthly Tea Auction average prices for all three elevations in SL. Rs.
          & US $ per Kg
        </CardText>
        <Table bordered {...getTableProps}>
          <thead>
            {headerGroups.map((headerGroup) => (
              <tr {...headerGroup.getHeaderGroupProps()}>
                {headerGroup.headers.map((column) => (
                  <th {...column.getHeaderProps(column.getSortByToggleProps())}>
                    {column.render("Header")}
                    <span>
                      {column.isSorted ? (column.isSortedDesc ? "↓" : "↑") : ""}
                    </span>
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody {...getTableBodyProps}>
            {page.map((row) => {
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
        <Row>
          <Col md="8"></Col>
          <Col md="4" className={"mt-2"}>
            <Pagination className={"ml-auto"}>
              <PaginationItem disabled={!canPreviousPage}>
                <PaginationLink previous onClick={() => previousPage()}>
                  Previous
                </PaginationLink>
              </PaginationItem>
              <PaginationItem active>
                <PaginationLink href="#">
                  {pageIndex + 1} / {pageOptions.length}
                </PaginationLink>
              </PaginationItem>
              <PaginationItem disabled={!canNextPage}>
                <PaginationLink next onClick={() => nextPage()}>
                  Next
                </PaginationLink>
              </PaginationItem>
            </Pagination>
          </Col>
        </Row>
      </CardBody>
    </Card>
  );
};

export default MainTable;
