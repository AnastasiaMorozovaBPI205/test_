import React from "react";
import styled from 'styled-components';
import { useNavigate } from "react-router-dom";
import { getTablesNames } from "./DBPage";

import axios from 'axios';

export let dataBases = [];
export let selectedDBName = "";

export default function AllDBPage() {

  const Button = styled.button`
  color: #3777ff;
  font-size: 20px;
  border-width: 0;

  background-color: white;
  border-width: 0;
  border-radius: 5px;
  width: 200px;
  height: 50px;
  margin-bottom: 1%;
`;

  const Header = styled.h1`
  color: white;
  font-size: 30px;
  margin-top: 7%;
`;

  const DBList = styled.ul`
  list-style-type: none;
`;

  let navigate = useNavigate();

  const openDB = (dbName) => {
    selectedDBName = dbName.target.innerHTML;
    let path = "/DB";
    navigate(path);

    /// запрос post - получить все таблицы
    axios.get(`http://localhost:8000/api/db/get-all-tables_in_db?db_name=${selectedDBName}`)
      .then(res => {
        console.log(res);
        console.log(res.data);

        /// записать все таблицы
        //getTablesNames = res.data;
        getTablesNames.splice(0, getTablesNames.length);
        for (let i = 0; i < res.data.length; i++) {
          getTablesNames.push(res.data[i]);
        }
      })
  }

  return (
    <div className="AllDBPage">
      <Header>Мои БД:</Header>
      <DBList>
        {
        dataBases=["hell"] &&
        dataBases.map(name => (<li>
          <Button onClick={(dbName) => openDB(dbName)}>{'\u2728'}{name}</Button>
        </li>))}
      </DBList>
    </div>
  );
}