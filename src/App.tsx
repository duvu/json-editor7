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
  display: grid;
  height: 100vh;
  grid-template-rows: 50px 1fr;
  grid-template-areas:
    'header'
    'main';
  grid-gap: 0.25rem;
  main {
    grid-area: main;
    height: calc(100vh - 50px);
  }

`;

export default App;
