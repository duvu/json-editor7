import React from 'react';
import styled from 'styled-components';
import Editor from './Editor';
function App() {
  return (
    <AppWrapper>
      <Header>LOGO</Header>
      <main>
        <Editor/>
      </main>
    </AppWrapper>
  );
}

const Header = styled.header`
  display: flex;
  align-items: center;
  height: 50px;
  grid-area: header;
  padding-left: 20px;
  padding-right: 20px;
  background-color: #222;
  color: #fff;
`;

const AppWrapper = styled.div`
  height: 100vh;
  display: grid;
  grid-template-rows: 50px 1fr;
  grid-template-areas:
    'header'
    'main';

  main {
    grid-area: main;
  }
`;

export default App;
