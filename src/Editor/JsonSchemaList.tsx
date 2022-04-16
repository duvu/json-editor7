import React, { useEffect } from "react";
import styled from "styled-components";
import { useSchemaList } from "./model";
import JsonSchemaService from '../services/json-schema.service';

interface JsonSchemaListProps {
    setStore: (store: any) => void;
    setSchemaList: (list: any[]) => void;
}

const JsonSchemaList: React.FC<JsonSchemaListProps> = (props) => {
    const { setStore, setSchemaList } = props;

    const schemaList = useSchemaList();

    useEffect(() => {
        JsonSchemaService.getAllSchemas().then(schemas => {
            const schemaList = schemas.map(x => {
                const s = JSON.parse(x.document);
                try {
                    const r = s.filter(xx => xx.id==='root')[0];
                    return {
                        id: x.id,
                        name: r.name
                    }
                    
                } catch (e) {
                    return {
                        id: x.id,
                        name: 'root'
                    }
                }
            });
            setSchemaList(schemaList.filter(x => x.name !== 'root'));
    
        })
    }, []);

    const loadSchema = (x: any): void => {
        JsonSchemaService.getSchema(x.id).then(schema => {
            console.log('loadSchema', schema);
            setStore(JSON.parse(schema.document));
        });
    }

    const deleteSchema = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>, x: any): void => {
        e.stopPropagation();
        JsonSchemaService.deleteSchema(x.id).then(() => {
            setSchemaList(schemaList.filter(xx => xx.id !== x.id));
        });
    }
    

    return (
        <StyledJsonSchemaList>
            {
            schemaList.map((x) => (
                <StyledSchmaLabel key={x.id} onClick={ () => loadSchema(x)}>
                    {x.name}
                    <Button onClick={(e) => deleteSchema(e, x)}>del</Button>
                </StyledSchmaLabel>
            ))
            }
        </StyledJsonSchemaList>
    )
}

export default JsonSchemaList;

const StyledJsonSchemaList = styled.div`
    padding: 8px;
`;

const StyledSchmaLabel = styled.div`
    padding: 0.25em, 0.5em;
`;

const Button = styled.button`
  color: palevioletred;
  font-size: 1em;
  margin: 0.25em;
  padding: 0.25em 0.25em;
  border: 1px solid palevioletred;
  border-radius: 10px;
`;
