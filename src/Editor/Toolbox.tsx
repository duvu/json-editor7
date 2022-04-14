import React, { useCallback } from 'react';
import styled from 'styled-components';
import JsonSchemaService from '../services/json-schema.service';
import { ItemTypes, useStore, useTreeView } from './model';

export interface ToolboxProps {
  clear: () => void;
}

const Toolbox: React.FC<ToolboxProps> = ({clear}) => {
  const tree = useTreeView();
  const store = useStore();
  
  const saveSchema = useCallback(() => {
    console.log('saveSchema', tree);
    JsonSchemaService.createSchema(JSON.stringify(tree));
  }, [tree]);

  const saveStore = useCallback(() => {
    console.log('saveStore', store);
    JsonSchemaService.createSchema(JSON.stringify(store));
  }, [store]);


  const onDragStart = useCallback((ev: React.DragEvent<HTMLDivElement>) => {
    console.log('Data', ev.currentTarget.dataset);
    const item = ev.currentTarget.dataset.item as string;
    ev.dataTransfer.setData('item', item);
  }, []);

  return (
    <StyledToolbox>
      {ItemTypes.map((t) => (
        <Item
          draggable
          onDragStart={onDragStart}
          data-item={JSON.stringify(t)}
          key={t.name}>
          {t.name}
        </Item>
      ))}

      <Button onClick={saveStore}>Save</Button>
      <Button>View JSON Schema</Button>
      <Button onClick={clear}>Clear</Button>
      
    </StyledToolbox>
  );
};

export default Toolbox;

const StyledToolbox = styled.div`
  border-right: 1px solid #d8d8d8;
`;

const Item = styled.div`
  padding: 5px;
  cursor: move;
  &:hover {
    background-color: #d8d8d8;
  }
`;

const Button = styled.button`
  color: palevioletred;
  font-size: 1em;
  margin: 0.5em;
  padding: 0.25em 1em;
  border: 1px solid palevioletred;
  border-radius: 3px;
`;

