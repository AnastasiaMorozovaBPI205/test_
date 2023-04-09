import React from 'react';
import { useNavigate } from "react-router-dom";
import styled, { css } from 'styled-components';

const CreateDB = () => {
  let navigate = useNavigate(); 
  const routeChange = () =>{ 
    let path = `createDB`; 
    navigate(path);
  }

  const Button = styled.button`
  position: relative;
  display: block;
  text-align: left;
  max-width: 100%;
  padding-top: 25px;
  padding-bottom: 25px;
  padding-left: 10%;
  background-position: 88% 30%;
  background-size: 36px;
  background-repeat: no-repeat;
  transition: background-position 300ms cubic-bezier(0.455, 0.03, 0.515, 0.955);
  text-decoration: none;
  color: #fff;
  font-size: 20px;
  line-height: 20%;
  font-weight: 500;
  border-width: 0;
  background-color: #11ffee00;

  :hover {
    background-position: 90% 50%;
  }
`;
  
  return (
    <Button onClick={routeChange}>Создать БД</Button>
  );
}

export default CreateDB;