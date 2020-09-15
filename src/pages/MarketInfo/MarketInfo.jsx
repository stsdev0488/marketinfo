import React, {
  useCallback, useEffect, useRef, useState,
} from 'react';
import { AgGridReact, AgGridColumn } from 'ag-grid-react';
import { AllCommunityModules } from '@ag-grid-community/all-modules';
import apiHandler from '../../apis';
import './styles.scss';

const timeSteps = [
  { value: 5, label: '5s' },
  { value: 10, label: '10s' },
  { value: 15, label: '15s' },
];

export const MarketInfo = () => {
  const [rowData, setRowData] = useState([]);
  const [updateStep, setUpdateStep] = useState(5);
  const updateTimer = useRef();

  const updateData = useCallback(() => {
    const updatedData = rowData.map((dataItem) => ({
      ...dataItem,
      rate: dataItem.rate + 1,
    }));
    setRowData(updatedData);
  }, [rowData]);

  const handleStepSelect = useCallback((event) => {
    setUpdateStep(event.target.value);
    clearInterval(updateTimer.current);
    updateTimer.current = setInterval(updateData, event.target.value * 1000);
  }, [updateData]);

  const fetchData = async () => {
    try {
      const marketData = await apiHandler('get', '/swap/marketinfo');
      const marketInfo = marketData?.data.map((info, index) => ({
        no: index,
        ...info,
      }));
      setRowData(marketInfo);
    } catch (e) {
      console.log(e);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

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
              <option key={item.value} value={item.value}>{item.label}</option>
            ))}
          </select>
        </div>
        <AgGridReact
          modules={AllCommunityModules}
          defaultColDef={{
            resizable: true,
            sortable: true,
          }}
          rowData={rowData}
          paginationAutoPageSize
          pagination
        >
          <AgGridColumn field="no" width={90} suppressSizeToFit />
          <AgGridColumn field="from" width={100} />
          <AgGridColumn field="to" width={100} />
          <AgGridColumn field="rate" width={170} type="numericColumn" />
          <AgGridColumn field="orderExpiresIn" width={150} />
          <AgGridColumn field="status" width={100} />
          <AgGridColumn field="max" width={200} type="numericColumn" />
          <AgGridColumn field="min" width={200} type="numericColumn" />
          <AgGridColumn field="minConf" width={120} />
        </AgGridReact>
      </div>
    </div>
  );
};
