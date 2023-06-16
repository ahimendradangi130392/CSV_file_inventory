import React from "react";
import { MaterialReactTable } from "material-react-table";

const TableComponent = ({ columnsData, rows, isEdit = false }) => {
  return (
    <div className="table-data">
      <MaterialReactTable
        columns={columnsData}
        data={rows}
        positionToolbarAlertBanner="bottom"
      />
    </div>
  );
};

export default TableComponent;
