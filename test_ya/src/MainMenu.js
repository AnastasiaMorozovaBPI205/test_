import React, { useRef, useContext } from 'react';
import styled from 'styled-components';
import useOnClickOutside from './onClickOutside';
import { MenuContext } from './navState';
import HamburgerButton from './hamburgerButton';
import { SideMenu } from './SideMenu.js';

const Navbar = styled.div`
  display: flex;
  position: fixed;
  left: 0;
  right: 0;
  max-width: 100%;
  height: 50px;
  align-items: center;
  background: #3777FF;
  color: rgb(248, 248, 248);
  padding: 6px 20px;
  box-shadow: rgba(0, 0, 0, 0.2) 0px 8px 16px;
  z-index: 500;
`;

const MainMenu = () => {
  const node = useRef();
  const { isMenuOpen, toggleMenuMode } = useContext(MenuContext);
  useOnClickOutside(node, () => {
    if (isMenuOpen) {
      toggleMenuMode();
    }
  });

  return (
    <header ref={node}>
      <Navbar>
        <HamburgerButton />
        <h1>DB Mocker</h1>
      </Navbar>
      <SideMenu />
    </header>
  );
};

export default MainMenu;