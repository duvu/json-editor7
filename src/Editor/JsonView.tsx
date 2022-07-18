import React from "react";
import styled from 'styled-components';
import {useSchema, useTreeView} from "./model";

const JsonView: React.FC = () => {
    const tree = useTreeView();
    
    return (
        <StyledJsonView>
            <pre>{JSON.stringify(tree, null, 2)}</pre>
        </StyledJsonView>
    )
};

export default JsonView;

const StyledJsonView = styled.div`
  height: 100%;
  background-color: #fff;
  border-radius: 8px;
  padding: 16px;
  border-color: #eff2f5;
  box-shadow: 0px 0px 20px 0px rgb(76 87 125 / 2%);
  overflow: auto;
  padding-left: 15px;
  position: relative;
  overflow-y: auto;

  &::before {
    content: '';
    left: 15px;
    top: 0px;
    width: 1px;
    background-color: #e6e6e6;
    position: absolute;
  }
`;
