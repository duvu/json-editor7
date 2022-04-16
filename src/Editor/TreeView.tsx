import React, { useCallback, useState } from 'react';
import styled from 'styled-components';
import {ItemType, useAppend, useTreeView} from './model';
import NodeView from './NodeView';
import { nanoid } from 'nanoid';

const TreeView: React.FC = () => {
    const tree = useTreeView();
    const appendHook = useAppend();

    const onDrop = useCallback(
        (e: React.DragEvent) => {
            try {
                const item = JSON.parse(e.dataTransfer.getData('item')) as ItemType;
                console.log('Drop', item);
                
                appendHook({
                    id: nanoid(),
                    type: item.type,
                    name: item.name,
                    value: item.value,
                    isEditing: false,
                    parent: (e.target as HTMLElement).dataset.nodeId || 'root',
                });
                setDragOver(false);
            } catch (e) {
                //
                console.log('Exception JSON//')
            }
        },
        [appendHook],
    );

    const [dragOver, setDragOver] = useState(false);
    const onDragOver = useCallback((e) => {
        e.preventDefault();
        setDragOver(true);
        return true;
    }, []);

    const onDragLeave = useCallback((e) => {
        e.preventDefault();
        setDragOver(false);
    }, []);

    return (
        <StyledTreeViewContainer
            dragOver={dragOver}>
            {
                <NodeView key={tree.id} {...tree} />
            }
        </StyledTreeViewContainer>
    );
};

export default TreeView;

const StyledTreeViewContainer = styled.div<{ dragOver: boolean }>`
  height: 100%;
  background-color: ${(p) => (p.dragOver ? '#ddd5' : undefined)};
  overflow: auto;
`;

