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
padding-left: 15px;
  position: relative;
  overflow-y: auto;

  &::before {
    content: '';
    left: 15px;
    top: 0px;
    width: 1px;
    background-color: #f0f0f0;
    position: absolute;
  }
`;
