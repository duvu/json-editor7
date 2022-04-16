import {ItemType, TreeNode, useAppend, useDel, useEdit, useEditing, useMoveDown, useMoveUp} from "./model";
import {useCallback, useState} from "react";
import styled from "styled-components";
import { nanoid } from "nanoid";

const NodeView: React.FC<TreeNode> = (node: TreeNode) => {
    const delHook = useDel();
    const editHook = useEdit();
    const editingHook = useEditing();
    const moveUpHook = useMoveUp();
    const moveDownHook = useMoveDown();
    const appendHook = useAppend();
    // --------------------------------------------------
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
    // --------------------------------------------------

    const onDragStart = useCallback((e: React.DragEvent<HTMLDivElement>) => {
        console.log('NodeView', e.currentTarget.dataset);
        const item = e.currentTarget.dataset.item as string;
        e.dataTransfer.setData('item', item);
    }, []);

    const remove = useCallback(() => {
        delHook(node);
    }, [delHook, node]);

    const up = useCallback(() => {
        moveUpHook(node);
    } , [moveUpHook, node]);
    const down = useCallback(() => {
        moveDownHook(node);
    } , [moveDownHook, node]);

    const setEdit = useCallback((id: string, editing: boolean) => {
        editingHook(id, editing);
    }, [editingHook]);

    const setNewName = useCallback((id: string, newName: string) => {
        editHook(id, newName);
    }, [editHook]);

    return (
        <StyledNodeView>
            <Node
                draggable
                dragOver={dragOver}
                onDragOver={onDragOver}
                onDragLeave={onDragLeave}
                onDrop={(e) => onDrop(e)}

                onDragStart={onDragStart}
                data-item={JSON.stringify(node)}
                data-node-id={node.id}>

                
                {
                    node.isEditing ? <EditName node={node} setEdit={setEdit} setNewName={setNewName}/> : node.type + ': ' + node.name
                        
                }
                
                    <Button onClick={() => setEdit(node.id, true)}>edit</Button>
                    {
                        node.id !== 'root' && <Button onClick={remove}>del</Button>
                    }
                    {
                        node.id !== 'root' && <Button onClick={up}>up</Button>
                    }
                    {
                        node.id !== 'root' && <Button onClick={down}>down</Button>
                    }

            
            </Node>

            <ChildrenView>
                {
                    node.children?.map((child) => (
                        <NodeView key={child.id} {...child} />
                    ))
                }
            </ChildrenView>
        </StyledNodeView>
    );
};

export default NodeView;

interface EditNameProps {
    node: TreeNode;
    setEdit: (id: string, editing: boolean) => void;
    setNewName: (id: string, newName: string) => void;
};
const EditName: React.FC<EditNameProps> = (props) => {
    const {node, setEdit, setNewName} = props;
    const onSubmit = () => {
        setEdit(node.id, false);
    }

    const onNewName = (e: React.ChangeEvent<HTMLInputElement>) => {
        setNewName(node.id, e.target.value);
    }

    return (
        <form onSubmit={onSubmit}>
            <label>Name: </label>
            <input type="text" value={node.name} onChange={onNewName}/>
            <Button type="submit">ok</Button>
        </form>
    )
}


const ChildrenView = styled.div`
  padding-left: 15px;
  position: relative;

  &::before {
    content: '';
    height: 100%;
    left: 15px;
    top: 0px;
    width: 1px;
    background-color: #f0f0f0;
    position: absolute;
  }
`;

const StyledNodeView = styled.div`
  padding-top: 10px;
  padding-left: 15px;
`;

const Node = styled.div<{ dragOver: boolean }>`
  border: 1px solid #d8d8d8;
  padding: 5px 10px;
  position: relative;
  background-color: ${(p) => (p.dragOver ? '#ddd5' : undefined)};
  &::before {
    content: '';
    height: 1px;
    top: calc(50% - 1px);
    width: 15px;
    right: 100%;
    background-color: #f0f0f0;
    position: absolute;
  }
`;

const NodeLabel = styled.div`
    grid-area: label;
`;

const NodeActions = styled.div`
    grid-area: actions;
`;

const Button = styled.button`
  color: palevioletred;
  font-size: 1em;
  margin: 0.25em;
  padding: 0.25em 0.25em;
  border: 1px solid palevioletred;
  border-radius: 10px;
`;

