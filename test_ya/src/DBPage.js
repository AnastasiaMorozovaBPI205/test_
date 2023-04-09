import React from "react";
import styled from 'styled-components';
import { useRef } from 'react';
import AddTableModal from "./AddTableModal.js";
import { useState } from "react";

import "pikaday/css/pikaday.css";
import Handsontable from 'handsontable';
import { HotTable, HotColumn } from "@handsontable/react";
import "handsontable/dist/handsontable.min.css";

import axios from 'axios';

export let getTablesNames = [];

export default function DBPage() {

  let dataSelectedTable = [[]];
  const settingsSelectedTable = {
    colHeaders: true,
    rowHeaders: true,
    height: 250,
    contextMenu: true,
    manualColumnResize: true,
    manualRowResize: true,
    dropdownMenu: true,
    filters: true,
    columnSorting: true,
    licenseKey: 'non-commercial-and-evaluation',
  };

  let dataResponse = [];
  const settingsResponse = {
    colHeaders: true,
    rowHeaders: true,
    height: 500,
    licenseKey: 'non-commercial-and-evaluation',
  };

  const Button = styled.button`
  color: white;
  font-size: 15px;
  border-width: 0;
  background-color: #3777ff;
  border-width: 0;
  border-radius: 5px;
  padding: 5px 5px 5px 5px; 
`;

  const Header = styled.h1`
  color: #3777ff;
  font-size: 15px;
  margin-top: 3px;
`;

  const FormSelectedTable = styled.div`
border-width: 0;
background-color: white;
border-radius: 5px;
width: 920px;
height: 350px;
float:right;
overflow: scroll;
`;

  const FormTables = styled.div`
border-width: 0;
background-color: white;
border-radius: 5px;
float: left;
width: 320px;
height: 350px;
overflow: scroll;
`;

  const FormRequest = styled.div`
border-width: 0;
background-color: white;
border-radius: 5px;
width: 620px;
height: 160px;
margin-top: 0.7%;
overflow: scroll;
float: left;
`;

  const FormResponse = styled.div`
border-width: 0;
background-color: white;
border-radius: 5px;
width: 620px;
height: 160px;
margin-top: 0.7%;
overflow: scroll;
float: right;
`;

  const MasterForm = styled.div`
width: 1250px;
height: 520px;
margin-top: 6%;
margin-left: 1%;
`;

  const Divider = styled.hr`
    border-top: 2px dotted #3777ff;
    margin-top: -10px;
`;



  const InputQuery = styled.textarea`
    color: white;
    font-size: 15px;
    border-width: 0;

    background-color: #3777ff;
    border-width: 0;
    border-radius: 5px;
    width: 570px;
    height: 100px;

    ::placeholder {
        color: #77bbff;
    }
  `;

  const InputTableName = styled.input`
  color: white;
  font-size: 15px;
  border-width: 0;

  background-color: #3777ff;
  border-width: 0;
  border-radius: 5px;
  width: 500px;
  height: 50px;

  margin-bottom: 5%;

  ::placeholder {
      color: #77bbff;
  }
`;

  const TableList = styled.ul`
list-style-type: none;
`;

  const inputQueryRef = useRef(null);
  const inputTableRef = useRef(null);
  const inputPrimaryKeyRef = useRef(null);
  const inputColumnNamesRef = useRef(null);
  const inputColumnTypesRef = useRef(null);

  const [tables, setTables] = useState(getTablesNames);
  const [selectedTable, setSelectedTable] = useState(undefined);

  const [gotResponse, setGotResponse] = useState(false);
  const [isTableOpen, setIsTableOpen] = useState(false);

  const [columnHeaders, setColumnHeaders] = useState([]);
  const [columnTypes, setColumnTypes] = useState([]);

  const [modalActive, setModalActive] = useState(false);

  const openTable = (name) => {
    /// ИНИЦИАЛИЗИРОВАТЬ МАССИВЫ ХЕДЕРОВ И ТИПОВ
    setColumnHeaders([]);
    //  setColumnHeaders(columnHeaders => {
    //   return columnHeaders.slice(1)});
    //  setColumnTypes(columnTypes => {
    //   return columnTypes.slice(1)});

    /// Запрос для получения таблицы
    axios.get(`http://localhost:8000/api/table/get-table-by-name?table_name=${name}`)
      .then(res => {
        console.log(res);
        console.log(res.data);

        /// записать результат
        /// пример json: {"table_name": "имя", "columns_amount": 2, "column_infos": [[name1, type], [name2, type]], "primary_key": "name1"}

      })

    /// Запрос для получения данных таблицы
    axios.get(`http://localhost:8000/api/table/get-data?table_name=${name}`)
      .then(res => {
        console.log(res);
        console.log(res.data);

        /// записать результат
        /// пример json:

      })

    setSelectedTable([selectedTable, name]);
    setIsTableOpen([isTableOpen, true]);
  }

  const addTable = () => {
    // tables.push(inputTableRef.current.value);

    /// ИНИЦИАЛИЗИРОВАТЬ МАССИВЫ ХЕДЕРОВ И ТИПОВ
    setColumnHeaders([]);
    //  setColumnHeaders(columnHeaders => {
    //   return columnHeaders.slice(1)});
    //  setColumnTypes(columnTypes => {
    //   return columnTypes.slice(1)});


    const colNamesStr = String(inputColumnNamesRef.current.value).split(" ");
    for (let i = 0; i < colNamesStr.length; i++) {
      // columnHeaders.push(colNamesStr[i]);
      setColumnHeaders([...columnHeaders, colNamesStr[i]]);
      // setColumnHeaders(columnHeaders => {return [...columnHeaders, colNamesStr[i]]})
    }

    const colTypesStr = String(inputColumnTypesRef.current.value).split(" ");
    for (let i = 0; i < colTypesStr.length; i++) {
      //columnTypes.push(colTypesStr[i]);
      setColumnTypes([...columnTypes, colTypesStr[i]]);
    }

    setModalActive(false);

    const colHeadStr = JSON.stringify(columnHeaders);
    const colTypeStr = JSON.stringify(columnTypes);
    /// Запрос создания новой таблицы
    axios.post(`http://localhost:8000/api/table/create-table?table_name=${inputTableRef.current.value}
    &columns_amount=${columnHeaders.length}&primary_key=${inputPrimaryKeyRef.current.value}`,
      { colHeadStr, colTypeStr })
      .then(res => {
        console.log(res);
        console.log(res.data);
      })

    alert("Таблица " + inputTableRef.current.value + " создана!");

    setTables([...tables, inputTableRef.current.value]);
  }

  const sendRequest = () => {
    /// Запрос отправления SQL запроса
    axios.post(`http://localhost:8000/api/table-query/add-new-query-to-table?table_name=${selectedTable}&query=${inputQueryRef.current.value}`)
      .then(res => {
        console.log(res);
        console.log(res.data);

        /// записать ответ
        settingsResponse.colHeaders = res.data[0]
        dataResponse = res.data.slice(1)
      })

    setGotResponse(gotResponse, true);
  }

  const saveChangesInTable = () => {
    /// Запрос сохранения изменений в данных таблицы
    axios.post(`http://localhost:8000/api/table/save-data`, { dataSelectedTable })
      .then(res => {
        console.log(res);
        console.log(res.data);
      })
  }


  function getCol() {
    //alert(columnHeaders.length)
    const col = [];
    for (let i = 0; i < columnHeaders.length; i++) {
      col.push(<HotColumn type={columnTypes[i]} />);
    }
    return col;
  }

  function getHotTable() {
    return <HotTable data={dataSelectedTable} settings={settingsSelectedTable} colHeaders={columnHeaders}>
      {getCol()}
    </HotTable>;
  }

  return (
    <MasterForm>
      <FormSelectedTable>
        <Header>Таблица1</Header>
        <Divider></Divider>
        {isTableOpen ? getHotTable() : <></>}
        <Button onClick={() => saveChangesInTable()}>Сохранить изменения</Button>
      </FormSelectedTable>

      <FormTables>
        <Header>Таблицы</Header>
        <Divider></Divider>
        <TableList>
          {tables.map(name => (<li>
            <Button onClick={(name) => openTable(name)}>{name}</Button>
          </li>))}
          <Button onClick={() => setModalActive(true)}>Создать таблицу</Button>
        </TableList>
      </FormTables>

      <FormRequest>
        <Header>Запрос</Header>
        <Divider></Divider>
        <InputQuery placeholder="Введите запрос" ref={inputQueryRef}></InputQuery>
        <Button onClick={() => sendRequest()}>Отправить запрос</Button>
      </FormRequest>

      <FormResponse>
        <Header>Ответ</Header>
        <Divider></Divider>
        {gotResponse ? <HotTable data={dataResponse} settings={settingsResponse}>
        </HotTable> : <></>}
      </FormResponse>

      <AddTableModal active={modalActive} setActive={setModalActive}>
        <InputTableName placeholder="Введите имя новой таблицы" ref={inputTableRef}></InputTableName>
        <InputTableName placeholder="Введите PrimaryKey" ref={inputPrimaryKeyRef}></InputTableName>
        <InputTableName placeholder="Введите имена столбцов" ref={inputColumnNamesRef}></InputTableName>
        <InputTableName placeholder="Введите типы столбцов" ref={inputColumnTypesRef}></InputTableName>
        <Button onClick={() => addTable()}>Добавить таблицу</Button>
      </AddTableModal>
    </MasterForm>
  );
}