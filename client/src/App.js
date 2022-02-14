import React, { useState, useEffect } from "react";
import "./App.css";
import Axios from "axios";
import { Card, Row, Col, Input } from "antd";
import { useCSVReader } from "react-papaparse";

function App() {
  const { CSVReader } = useCSVReader();

  const [file, setFile] = useState(null);
  const [average, setAverage] = useState(null);
  const [totalstocks, setTotalstocks] = useState(null);

  useEffect(() => {
    Axios.get("http://localhost:8080/getStock").then((response) => {
      if (response != null) {
        setFile(response);
      }
    });
  }, []);

  return (
    <CSVReader
      onUploadAccepted={(results) => {
        Axios.post("http://localhost:8080/createStock", results.data).then(
          (response) => {
            setAverage(response.data.averagePrice);
            setTotalstocks(response.data.totalStock);
            alert("data send succesfully");
          }
        );
      }}
    >
      {(
        { getRootProps, acceptedFile, ProgressBar, getRemoveFileProps },
        reset = () => {
          Axios.delete("http://localhost:8080/reset").then((response) => {
            setAverage(response.data.averagePrice);
            setTotalstocks(response.data.totalStock);
            alert("data deleted succesfully");
          });
        }
      ) => (
        <>
          <div className="header">Upload your CSV file</div>
          <center>
            <button type="button" {...getRootProps()} className="button">
              Browse file
            </button>
            <div>{acceptedFile && acceptedFile.name}</div>
            {acceptedFile && (
              <button {...getRemoveFileProps()} className="button">
                Remove
              </button>
            )}
          </center>
          <ProgressBar />
          <div className="data">
            {acceptedFile && (
              <div className="data-1">Total stocks : {totalstocks}</div>
            )}
            {acceptedFile && (
              <div className="data-2">Average value : {average}</div>
            )}
          </div>
          {acceptedFile && (
            <center>
              <table>
                <thead>
                  <tr>
                    <th>Id</th>
                    <th>Trade_type</th>
                    <th>Quantity</th>
                    <th>Price</th>
                  </tr>
                </thead>
                <tbody>
                  {file.data.map((item) => {
                    return (
                      <tr key={item.id}>
                        <td>{item.id}</td>
                        <td>{item.trade_type}</td>
                        <td>{item.quantity}</td>
                        <td>{item.price}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </center>
          )}
          <center>
            {acceptedFile && (
              <button onClick={reset} className="button">
                Reset
              </button>
            )}
          </center>
        </>
      )}
    </CSVReader>
  );
}

export default App;
