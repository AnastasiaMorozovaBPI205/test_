import React from "react";
import styled from 'styled-components';
import { useRef } from 'react';
import AddTableModal from "./AddTableModal.js";
import { useState } from "react";

import "pikaday/css/pikaday.css";
import Handsontable from 'handsontable';
import { HotTable, HotColumn } from "@handsontable/react";
import "handsontable/dist/handsontable.min.css";

import { v4 as uuidv4 } from 'uuid';

import axios from 'axios';

export let getTablesNames = [];

export default function DBPage() {

  const [dataSelectedTable, setDataSelectedTable] = useState([]);
  const settingsSelectedTable = {
    colHeaders: [],
    rowHeaders: true,
    height: 250,
    contextMenu: true,
    manualColumnResize: true,
    manualRowResize: true,
    dropdownMenu: true,
    filters: true,
    columnSorting: true,
    licenseKey: 'non-commercial-and-evaluation'
  };

  const [dataResponse, setDataResponse] = useState([]);
  const settingsResponse = {
    colHeaders: false,
    rowHeaders: true,
    height: 500,
    colWidths: 100,
    licenseKey: 'non-commercial-and-evaluation'
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
    setColumnHeaders([]);

    try {
      /// Запрос для получения данных таблицы
      axios.get(`http://localhost:8000/api/table/get-data?table_name=${name.target.innerText}`)
        .then(res => {
          console.log(res);
          console.log(res.data);

          /// записать результат
          /// пример json:

          //const arr = [["aaa", "baaa", "d"], ["1", "2", "3"]];
          settingsSelectedTable.colHeaders = res.data[0];
          setColumnHeaders(res.data[0]);
          setDataSelectedTable(res.data.slice(1));
        })
    } catch (error) {
      console.error(error);
      alert(error)
    }

    // const arr = [["aaa", "baaa", "d"], ["1", "2", "3"]];
    // setColumnHeaders(arr[0]);
    // setDataSelectedTable(arr.slice(1));

    // const arr = [["aaa", "baaa", "d"], ["1", "2", "3"]];
    // settingsSelectedTable.colHeaders = arr[0];
    // setColumnHeaders(arr[0]);
    // setDataSelectedTable(arr.slice(1));

    setSelectedTable(name.target.innerText);
    setIsTableOpen(true);
  }

  const addTable = () => {

    const colNamesStr = String(inputColumnNamesRef.current.value).split(" ");
    for (let i = 0; i < colNamesStr.length; i++) {
      columnHeaders.push(colNamesStr[i]);
    }

    const colTypesStr = String(inputColumnTypesRef.current.value).split(" ");
    for (let i = 0; i < colTypesStr.length; i++) {
      columnTypes.push(colTypesStr[i]);
    }

    setModalActive(false);

    /// Запрос создания новой таблицы
    axios.post(`http://localhost:8000/api/table/create-table?table_name=${inputTableRef.current.value}
    &columns_amount=${columnHeaders.length}&primary_key=${inputPrimaryKeyRef.current.value}`,
      { "columns_names": columnHeaders, "columns_types": columnTypes })
      .then(res => {
        console.log(res);
        console.log(res.data);
      })

    alert("Таблица " + inputTableRef.current.value + " создана!");

    setTables([...tables, inputTableRef.current.value]);
  }

  const sendRequest = () => {
    const id = uuidv4();
    /// Запрос отправления SQL запроса
    axios.post(`http://localhost:8000/api/table-query/add-new-query-to-table?query_id=${id}&table_name=${selectedTable}&query=${inputQueryRef.current.value}`)
      .then(res => {
        console.log(res);
        console.log(res.data);
      })


    try {
      axios.get(`http://localhost:8000/api/table-query/execute-table-query-by-id?id=${id}`)
        .then(res => {
          console.log(res);
          console.log(res.data);

          /// записать ответ

          setDataResponse(res.data)
        })
    } catch (error) {
      console.error(error);
      alert(error)
    }

    setGotResponse(true);
  }

  const saveChangesInTable = () => {
    /// Запрос сохранения изменений в данных таблицы
    axios.post(`http://localhost:8000/api/table/save-data`, { "data": dataSelectedTable })
      .then(res => {
        console.log(res);
        console.log(res.data);
      })
  }


  function getColumnSelectedTable() {
    const col = [];
    for (let i = 0; i < columnHeaders.length; i++) {
      col.push(<HotColumn type={columnTypes[i]} />);
    }
    return col;
  }

  function getSelectedTable() {
    return <HotTable data={dataSelectedTable} settings={settingsSelectedTable} colHeaders={columnHeaders}>
      {getColumnSelectedTable()}
    </HotTable>;

    // return <HotTable
    //   data={[['Мявкинс', '10/12/2023', '4']]}
    //   height={450}
    //   colWidths={[140, 192, 100]}
    //   colHeaders={['имя', 'дата_рождения', 'кол-во_лап']}
    //   dropdownMenu={true}
    //   contextMenu={true}
    //   multiColumnSorting={true}
    //   filters={true}
    //   rowHeaders={true}
    //   licenseKey="non-commercial-and-evaluation"
    // >
    //   <HotColumn type="text" />
    //   <HotColumn type="date" />
    //   <HotColumn type="numeric" />
    // </HotTable>;
  }

  function getColumnResponseTable() {
    const col = [];
    if (dataResponse === undefined) {
      return;
    }
    if (dataResponse.length === 0) {
      return;
    }

    for (let i = 0; i < dataResponse[0].length; i++) {
      col.push(<HotColumn type="text" />);
    }
    return col;
  }

  function getResponseTable() {
    return <HotTable data={dataResponse} settings={settingsResponse}>
      {getColumnResponseTable()}
    </HotTable>;
  }

  return (
    <MasterForm>
      <FormSelectedTable>
        <Header>Таблица</Header>
        <Divider></Divider>
        {isTableOpen ? getSelectedTable() : <></>}
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
        {gotResponse ? getResponseTable() : <></>}
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

console.log(`Handsontable: v${Handsontable.version} (${Handsontable.buildDate}) Wrapper: v${HotTable.version} React: v${React.version}`);
