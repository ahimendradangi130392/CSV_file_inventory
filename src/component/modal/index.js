import React, { useState, useEffect } from "react";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
const UpdateInventoryModal = ({
  open,
  handleClose,
  handleSave,
  children,
  rows,
}) => {
  // const [inventoryUpdadate]
  const [updatedRow, setUpdatedRow] = useState([{}]);

  useEffect(() => {
    setUpdatedRow(rows);
  }, [rows]);

  const handleChange = (e, index) => {
    let row = [...updatedRow];
    row[index][e.target.name] = e.target.value;
    setUpdatedRow(row);
  };
  return (
    <div>
      {" "}
      <div>
        <Dialog
          open={open}
          onClose={handleClose}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <DialogTitle id="alert-dialog-title">
            {"Update Inventory"}
          </DialogTitle>
          <DialogContent>
            <DialogContentText id="alert-dialog-description">
              {/* {children} */}
              <div className="tableDataEdit">
                <ul className="flex custom-header">
                  <li>Part</li>
                  <li>Alt_Part</li>
                  <li>Model</li>
                  <li>LocA_Stock</li>
                  <li>LocB_stock</li>
                </ul>
                {updatedRow?.map((row, index) => (
                  <ul className="flex">
                    <li>
                      <span>{row?.["Part #"]}</span>
                    </li>
                    <li>
                      <span>{row?.["Alt.Part#"]}</span>
                    </li>
                    <li>
                      <span>{row?.["Model"]}</span>
                    </li>
                    <li>
                      <input
                        type="number"
                        onChange={(e) => handleChange(e, index)}
                        name="LOCATION A STOCK"
                        value={row?.["LOCATION A STOCK"]}
                      />
                    </li>
                    <li>
                      <input
                        type="number"
                        onChange={(e) => handleChange(e, index)}
                        name="LOC B STOCK "
                        value={row?.["LOC B STOCK "]}
                      />
                    </li>
                  </ul>
                ))}
              </div>
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button
              onClick={handleClose}
              variant="outlined"
              sx={{ mx: 2, width: "110px" }}
            >
              close
            </Button>
            <Button
              onClick={() => handleSave(updatedRow)}
              variant="contained"
              sx={{ mx: 2, width: "110px" }}
            >
              Save
            </Button>
          </DialogActions>
        </Dialog>
      </div>
    </div>
  );
};

export default UpdateInventoryModal;
