import React, { useEffect } from "react";
import styled from "styled-components";
import { useSchema } from "./model";
import JsonSchemaService from '../services/json-schema.service';

interface JsonSchemaListProps {
    setStore: (store: any) => void;
}

const JsonSchemaList: React.FC<JsonSchemaListProps> = (props) => {
    const { setStore } = props;
    const schema = useSchema();
    // const [schemas, setSchemas] = React.useState<any[]>([]);
    const [schemas, setSchemas] = React.useState<any[]>([]);

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
            setSchemas(schemaList.filter(x => x.name !== 'root'));
    
        })
    }, []);

    const loadSchema = (x: any): void => {
        console.log('loadSchema', x);
        JsonSchemaService.getSchema(x.id).then(schema => {
            console.log('loadSchema', schema);
            setStore(JSON.parse(schema.document));
        });
    }
    

    return (
        <StyledJsonSchemaList>
            {
            schemas.map((x) => (
                <StyledSchmaLabel key={x.id} onClick={ () => loadSchema(x)}>{x.name}</StyledSchmaLabel>
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

