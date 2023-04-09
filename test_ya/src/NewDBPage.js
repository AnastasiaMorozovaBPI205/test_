import React from "react";
import styled, { css } from 'styled-components';
import { dataBases } from "./AllDBPage";
import { useRef } from 'react';
import axios from 'axios';

export default function NewDBPage() {

  const Button = styled.button`
    color: white;
    font-size: 20px;
    border-width: 0;

    background-color: #3777ff;
    border-width: 0;
    border-radius: 5px;
    margin-top: 10%;
    width: 100px;
    height: 50px;
  `;

  const Input = styled.input`
    color: white;
    font-size: 20px;
    border-width: 0;

    background-color: #3777ff;
    border-width: 0;
    border-radius: 5px;
    margin-top: 10%;
    width: 230px;
    height: 50px;

    ::placeholder {
        color: #77bbff;
    }
  `;

  const Form = styled.div`
  border-width: 0;
  background-color: white;
  padding: 10px 10px;
  border-radius: 5px;
  margin-left: 40%;
  margin-top: 15%;
  width: 250px;
`;

  const inputRef = useRef(null);

  const addNewDB = () => {
    dataBases.push(inputRef.current.value);

    /// Запрос на создание БД
    axios.post(`http://localhost:8000/api/db/create-db?name=${inputRef.current.value}`)
      .then(res => {
        console.log(res);
        console.log(res.data);
      })

    alert("База данных " + inputRef.current.value + " создана!");
  }

  return (
    <Form>
      <Input placeholder="Введите название БД" ref={inputRef}></Input>
      <Button onClick={addNewDB}>Создать</Button>
    </Form>
  );
}