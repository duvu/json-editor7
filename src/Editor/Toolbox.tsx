import React, { useCallback } from 'react';
import styled from 'styled-components';
import JsonSchemaService from '../services/json-schema.service';
import JsonSchemaList from './JsonSchemaList';
import { ItemTypes, useAppendSchema, useStore, useTreeView } from './model';

export interface ToolboxProps {
  clear: () => void;
  setStore: (store: any) => void;
  setSchemaList: (list: any) => void;
  appendSchema: (schema: any) => void;
}

const Toolbox: React.FC<ToolboxProps> = ({clear, setStore, setSchemaList}) => {
  const store = useStore();

  const appendSchemaHook = useAppendSchema();
  
  const saveSchema = useCallback(() => {
    JsonSchemaService.createSchema(JSON.stringify(store)).then(x => {
      const r = JSON.parse(x.document)[0];
      appendSchemaHook({id: x.id, name: r.name});
    });
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

      <Button onClick={saveSchema}>Save</Button>
      <Button onClick={clear}>Clear</Button>
      
      <JsonSchemaList setStore={setStore} setSchemaList={setSchemaList}/>
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

