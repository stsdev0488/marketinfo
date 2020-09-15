import React, { useCallback, useEffect, useRef, useState } from 'react';
import { AgGridReact } from 'ag-grid-react';
import { AllCommunityModules } from '@ag-grid-community/all-modules';
import data from '../../mockup/marketinfo.json';
import './styles.scss';

const marketInfo = data.map((item, index) => ({
  no: index + 1,
  ...item,
}));

const columns = [
  { headerName: "No", field: "no" },
  { headerName: "From", field: "from" },
  { headerName: "To", field: "to" },
  { headerName: "Rate", field: "rate" },
  { headerName: "Order Expire", field: "orderExpiresIn" },
  { headerName: "Status", field: "status" },
  { headerName: "Max", field: "max" },
  { headerName: "Min", field: "min" },
  { headerName: "Min Configuration", field: "minConf" },
];

const MarketInfo = () => {
  const [rowData, setRowData] = useState([]);
  const [updateStep, setUpdateStep] = useState(5);
  let updateTimer = useRef();

  const onGridReady = (params) => {
    setRowData(marketInfo);
    autoSizeAll(params.columnApi);
  };

  const autoSizeAll = (api) => {
    var allColumnIds = [];
    api.getAllColumns().forEach(function (column) {
      allColumnIds.push(column.colId);
    });
    api.autoSizeColumns(allColumnIds, false);
  };

  const handleStepSelect = useCallback((event) => {
    setUpdateStep(event.target.value);
    clearInterval(updateTimer);
    updateTimer = setInterval(updateData, event.target.value * 1000);
  }, []);

  const updateData = () => {
    console.log('updateData ', rowData)
    if (rowData.length) {
      const updatedData = rowData.map((data) => ({
        ...data,
        rate: data.rate + 1,
      }));
      console.log('updatedData ', updatedData)
      setRowData(updatedData);
    }
  };

  useEffect(() => {
    updateTimer = setInterval(updateData, updateStep * 1000);
    return () => {
      clearInterval(updateTimer);
    }
  }, [updateStep, updateData]);

  return (
    <div className="market-info-page">
      <h1 className="header-title">Market Information</h1>
      <div
        className="ag-theme-alpine"
        style={{
          height: '550px',
          width: '1300px',
        }}
      >
        <div className="update-container">
          <span className="update-label">Update rate every </span>
          <select value={updateStep} onChange={handleStepSelect}>
            <option value={5}>5s</option>
            <option value={10}>10s</option>
            <option value={15}>15s</option>
          </select>
        </div>
        <AgGridReact
          modules={AllCommunityModules}
          defaultColDef={{
            resizable: true,
            sortable: true,
          }}
          columnDefs={columns}
          rowData={rowData}
          onGridReady={onGridReady}
          paginationAutoPageSize={true}
          pagination={true}
        />
      </div>
    </div>
  )
}

export default MarketInfo;
