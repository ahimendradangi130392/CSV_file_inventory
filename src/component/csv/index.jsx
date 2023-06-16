import React, { useState, useEffect } from "react";
import * as XLSX from "xlsx";
import { MaterialReactTable } from "material-react-table";
import { Button } from "@mui/material";
import DeleteAction from "./deleteaction";
import { ExportToCsv } from "export-to-csv";
import UpdateInventoryModal from "../modal";
import TableComponent from "../table";

const csvOptions = {
  fieldSeparator: ",",
  quoteStrings: '"',
  decimalSeparator: ".",
  showLabels: true,
  useBom: true,
  useKeysAsHeaders: false,
};

const csvExporter = new ExportToCsv(csvOptions);

const CSVDataTable = () => {
  const [csvData, setcCsvData] = useState({});
  const [columnsData, setColumnsData] = useState([]);
  const [rowsData, setRowsData] = useState([]);
  const [globalCsvData, setGlobalCsvData] = useState([]);
  const [open, setOpen] = React.useState(false);
  const [openDelete, setOpenDelete] = React.useState(false);
  const [isNewFile, setIsNewFile] = useState(false);
  console.log("render");
  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleExportData = () => {
    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.json_to_sheet(rowsData);

    XLSX.utils.book_append_sheet(wb, ws, "MySheet");
    XLSX.writeFile(wb, "Inventory.xlsx");
  };

  const filterData = (e) => {
    let filterValue = e.target.value;
    if (filterValue.length > 3) {
      console.log("filterValue.length", filterValue.length);
      const filterRow = globalCsvData.filter(
        (val, index) =>
          val["Part #"].includes(filterValue) ||
          val["Alt.Part#"].includes(filterValue)
      );
      setRowsData(filterRow);
    } else {
      console.log("else", filterValue.length);

      setRowsData(globalCsvData);
    }
  };

  const importCsv = async () => {
    const file = csvData?.target?.files[0];
    if (file) {
      const data = await file?.arrayBuffer();
      const workbook = await XLSX.read(data);
      const worksheet = await workbook.Sheets[workbook.SheetNames[0]];
      const jsonData = await XLSX.utils.sheet_to_json(worksheet, {
        defval: "",
      });

      setRowsData(jsonData);
      setGlobalCsvData(jsonData);
      setIsNewFile(false);
    }
  };

  const deleteRow = (row) => {
    const updatedGlobalRows = globalCsvData.filter(
      (ele) => ele?.["Part #"] != row?.["Part #"]
    );
    setRowsData(updatedGlobalRows);
    setGlobalCsvData(updatedGlobalRows);
  };

  useEffect(() => {
    if (rowsData.length > 0) {
      const row = rowsData.map((ele, index) => {
        return {
          ...rowsData[index],
          Action: "",
        };
      });
      let rowdata = rowsData;
      let globalcsvdata = rowsData;
      const col = Object.keys(row[0]).map((val, index) => {
        return {
          accessorKey: val,
          header: val,
          size: 20,
          Cell: ({ cell, row }) => {
            if (cell.column.id == "Action") {
              return <DeleteAction row={row.original} deleteRow={deleteRow} />;
            } else {
              return <div>{row.original[`${cell.column.id}`]}</div>;
            }
          },
        };
      });
      setColumnsData(col);
    }
    setRowsData((prevState) => {
      console.log("rowsData###### inside", prevState, rowsData);

      if (prevState != rowsData && rowsData?.length > 0) {
        return rowsData;
      } else return rowsData;
    });
  }, [rowsData]);

  const handleUpdateRow = (row) => {
    setRowsData(row);
    const globalData = globalCsvData.map(
      (obj) => row.find((o) => o["Part #"] === obj["Part #"]) || obj
    );
    setGlobalCsvData(globalData);
    setOpen(false);
  };

  return (
    <>
      <div>
        <h1 className="text-left title">CSV Data Table</h1>
        <div className=" all-btn-box">
          <div className="flex place-center import-file">
            <div>
              <div className=" text-left select-file ">
                <input
                  onChange={(e) => {
                    setcCsvData(e);
                    setIsNewFile(true);
                  }}
                  type="file"
                />
                <svg
                  width="25"
                  xmlns="http:www.w3.org/2000/svg"
                  data-name="Layer 1"
                  viewBox="0 0 24 24"
                  id="upload-to-cloud"
                >
                  <path d="M18.42,8.22A7,7,0,0,0,5.06,10.11,4,4,0,0,0,6,18a1,1,0,0,0,0-2,2,2,0,0,1,0-4,1,1,0,0,0,1-1,5,5,0,0,1,9.73-1.61,1,1,0,0,0,.78.67,3,3,0,0,1,.24,5.84,1,1,0,0,0,.5,1.94,5,5,0,0,0,.17-9.62Zm-5.71,2.07a1,1,0,0,0-.33-.21,1,1,0,0,0-.76,0,1,1,0,0,0-.33.21l-3,3a1,1,0,0,0,1.42,1.42L11,13.41V19a1,1,0,0,0,2,0V13.41l1.29,1.3a1,1,0,0,0,1.42,0,1,1,0,0,0,0-1.42Z"></path>
                </svg>
              </div>
            </div>
            <div>
              <Button
                onClick={() => importCsv()}
                variant="contained"
                sx={{ mx: 2, width: "110px" }}
                disabled={!isNewFile}
              >
                Submit
              </Button>
            </div>
            <div>
              <Button
                variant="contained"
                sx={{ mx: 2, width: "130px" }}
                onClick={handleExportData}
                disabled={rowsData.length == 0}
              >
                Export CSV
              </Button>
            </div>
          </div>

          <div className="p-20 text-left filter-input">
            <div className="flex ">
              <div>
                <span className="input-feild">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="18"
                    height="18"
                    viewBox="0 0 100 100"
                    id="search"
                  >
                    <path d="M87.4 77.7L68.5 58.8c3.2-5 4.7-10.8 4.7-16.5C73.2 25.4 59.7 12 42.8 12 25.2 12 11.9 25.9 12 42.6c.1 16.7 13.6 30.6 30.8 30.6 5.8 0 11.3-1.6 16.1-4.6l18.9 18.8c.8.8 2 .8 2.8 0l6.9-6.9c.7-.8.7-2-.1-2.8zm-44.6-8.5c-15 0-26.7-12.1-26.8-26.7-.1-14.4 11.4-26.6 26.8-26.6 15 0 26.3 11.7 26.4 26.3.1 15.6-12.2 27-26.4 27zm36.3 14l-17-17c.6-.5 3.4-3.3 4.1-4.1l17 17-4.1 4.1z"></path>
                    <path
                      fill="#00F"
                      d="M244-370v1684h-1784V-370H244m8-8h-1800v1700H252V-378z"
                    ></path>
                  </svg>
                  <input
                    type="text"
                    placeholder="Filter data"
                    onChange={(e) => filterData(e)}
                  />
                </span>
                <Button
                  variant="contained"
                  sx={{ mx: 2, width: "110px" }}
                  disabled={rowsData.length == 0}
                >
                  <svg
                    xmlns="http:www.w3.org/2000/svg"
                    width="22"
                    height="20"
                    viewBox="0 0 22 20"
                    id="filter"
                  >
                    <path
                      fill="none"
                      fill-rule="evenodd"
                      stroke="#fff"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M20 0H0l8 9.46V16l4 2V9.46z"
                      transform="translate(1 1)"
                    ></path>
                  </svg>
                  filter
                </Button>
              </div>
              <Button
                variant="contained"
                onClick={handleClickOpen}
                sx={{ mx: 2, width: "200px" }}
                disabled={rowsData.length == 0}
              >
                Update Inventory
              </Button>
              <UpdateInventoryModal
                open={open}
                handleClose={() => setOpen(false)}
                rows={rowsData}
                handleSave={handleUpdateRow}
              >
                <TableComponent
                  columnsData={columnsData}
                  rows={rowsData}
                  isEdit={true}
                />
              </UpdateInventoryModal>
            </div>
          </div>
        </div>

        {columnsData.length > 0 && rowsData.length > 0 ? (
          <div className="table-data">
            <TableComponent columnsData={columnsData} rows={rowsData} />
          </div>
        ) : (
          <div className="blank-table-box">
            <p>Import CSV file</p>
          </div>
        )}
      </div>
    </>
  );
};

export default CSVDataTable;
