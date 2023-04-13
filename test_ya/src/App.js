import React, { useState } from 'react'
import styled from 'styled-components';
import NavState from './navState';
import MainMenu from './MainMenu';
import { YandexLogin, YandexLogout } from 'react-yandex-login';


import {Routes, Route} from 'react-router-dom';
import AllDBPage from './AllDBPage';
import NewDBPage from './NewDBPage';
import DBPage from './DBPage';
import { selectedDBName } from './AllDBPage';
import axios from 'axios';
 
import { HotTable, HotColumn } from "@handsontable/react";
import "handsontable/dist/handsontable.min.css";
import "pikaday/css/pikaday.css";
import Handsontable from 'handsontable';

const clientID = 'c81b1fc8556e47c289665b29d76527e9';
 
export default function App() {
  const [userData, setUserData] = useState(undefined);
 
  const loginSuccess = (userData) => {
    console.log('User Data: ', userData);
    setUserData(userData);

    axios.post(`http://localhost:8000/api/user/create-user?name=${userData.access_token}`)
    .then(res => {
      console.log(res);
      console.log(res.data);
    })
  }
 
  const logoutSuccess = () => {
    setUserData(null);
  }

  const LoginButton = styled.button`
  background-color: white;
  color: #3777ff;
  font-size: 20px;
  padding: 20px 30px;
  border-width: 0;
  border-radius: 5px;
  margin-top: 15%;
`;

const LogoutButton = styled.button`
background-color: white;
color: #3777ff;
font-size: 20px;
padding: 10px 30px;
border-width: 0;
border-radius: 5px;
margin-top: 1%;
margin-left: 85%;
`;

const Auth = styled.div`
background-color: #3777ff;
font-size: 20px;
position: fixed;
width: 100%;
height: 100%;
left: 0;
right: 0;
top: 0;
bottom: 0;
max-width: 100%;
text-align: center;
justify-content: center;

.full-height {
  height: 100%;
}
`;
 
  return (
    <Auth>
      {!userData && 
        <YandexLogin clientID={clientID} onSuccess={loginSuccess}>
          <LoginButton>Войдите с помощью Yandex</LoginButton>
        </YandexLogin>
      }
      {userData &&
        <NavState>
          <MainMenu />
          <Routes>
            <Route path="/myDB" element={<AllDBPage />} />
            <Route path="/createDB" element={<NewDBPage />} />
            <Route path="/DB" element={<DBPage />} />
          </Routes>
          <YandexLogout onSuccess={logoutSuccess}>
            <LogoutButton>Выйти</LogoutButton>
          </YandexLogout>
        </NavState>
      }
    </Auth>
  );
}

// export default function App () {
//   return <HotTable
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
// };

console.log(`Handsontable: v${Handsontable.version} (${Handsontable.buildDate}) Wrapper: v${HotTable.version} React: v${React.version}`);
