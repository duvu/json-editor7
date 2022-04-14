import React, { useEffect } from "react";
import styled from "styled-components";
import { useSchema } from "./model";
import JsonSchemaService from '../services/json-schema.service';


const JsonSchemaList: React.FC = () => {
    const schema = useSchema();
    const [schemas, setSchemas] = React.useState<any[]>([]);
    const [schemaIds, setSchmasIds] = React.useState<string[]>([]);

    useEffect(() => {
        JsonSchemaService.getAllSchemas().then(schemas => {
            const schemaList = schemas.map(x => JSON.parse(x.document))
            const schemaIds = schemas.map(x => x.id);
            setSchemas(schemaList);
            setSchmasIds(schemaIds);
        })
    }, []);

    return (
        <StyledJsonSchemaList>
            {
            schemaIds.map((id) => (
                <div>{id}</div>
            ))
            }
        </StyledJsonSchemaList>
    )
}

export default JsonSchemaList;

const StyledJsonSchemaList = styled.div`
    padding: 8px;
`;