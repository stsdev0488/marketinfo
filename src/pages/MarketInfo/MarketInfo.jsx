import React, {
  useCallback, useEffect, useRef, useState,
} from 'react';
import { AgGridReact } from 'ag-grid-react';
import { AllCommunityModules } from '@ag-grid-community/all-modules';
import data from '../../mockup/marketinfo.json';
import './styles.scss';

const marketInfo = data.map((item, index) => ({
  no: index + 1,
  ...item,
}));

const columns = [
  { headerName: 'No', field: 'no' },
  { headerName: 'From', field: 'from' },
  { headerName: 'To', field: 'to' },
  { headerName: 'Rate', field: 'rate' },
  { headerName: 'Order Expire', field: 'orderExpiresIn' },
  { headerName: 'Status', field: 'status' },
  { headerName: 'Max', field: 'max' },
  { headerName: 'Min', field: 'min' },
  { headerName: 'Min Configuration', field: 'minConf' },
];

const timeSteps = [
  { value: 5, label: '5s' },
  { value: 10, label: '10s' },
  { value: 15, label: '15s' },
];

export const MarketInfo = () => {
  const [rowData, setRowData] = useState([]);
  const [updateStep, setUpdateStep] = useState(5);
  const updateTimer = useRef();

  const autoSizeAll = (api) => {
    const allColumnIds = [];
    api.getAllColumns().forEach((column) => {
      allColumnIds.push(column.colId);
    });
    api.autoSizeColumns(allColumnIds, false);
  };

  const onGridReady = (params) => {
    setRowData(marketInfo);
    autoSizeAll(params.columnApi);
  };

  const updateData = useCallback(() => {
    if (rowData.length) {
      const updatedData = rowData.map((dataItem) => ({
        ...dataItem,
        rate: dataItem.rate + 1,
      }));
      setRowData(updatedData);
    }
  }, [rowData]);

  const handleStepSelect = useCallback((event) => {
    setUpdateStep(event.target.value);
    clearInterval(updateTimer.current);
    updateTimer.current = setInterval(updateData, event.target.value * 1000);
  }, [updateData]);

  useEffect(() => {
    updateTimer.current = setInterval(updateData, updateStep * 1000);
    return () => {
      clearInterval(updateTimer.current);
    };
  }, [updateData, updateStep]);

  return (
    <div className="market">
      <h1 className="market__title">Market Information</h1>
      <div className="market__section ag-theme-alpine">
        <div className="market__timer">
          <span className="market__timer-label">Update rate every </span>
          <select value={updateStep} onChange={handleStepSelect}>
            {timeSteps.map((item) => (
              <option value={item.value}>{item.label}</option>
            ))}
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
          paginationAutoPageSize
          pagination
        />
      </div>
    </div>
  );
};
