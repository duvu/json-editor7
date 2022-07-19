import {ItemType, TreeNode, useAppend, useDel, useEdit, useEditing, useMoveDown, useMoveUp} from "./model";
import {useCallback, useState} from "react";
import styled from "styled-components";
import { nanoid } from "nanoid";
import jsonIcon from '../images/json-icon-blue.png'
import IconEdit from "../images/edit.png";
import IconDelete from "../images/delete.png";
import IconUp from "../images/up.png";
import IconDown from "../images/down.png";
import IconSave from "../images/save.png";

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
          data-node-id={node.id}
        >
          <ImageLogo src={jsonIcon} alt="Json icon"></ImageLogo>
          <StyledContentNode>
            {node.isEditing ? (
              <EditName node={node} setEdit={setEdit} setNewName={setNewName} />
            ) : (
              node.type + ": " + node.name
            )}
            {!node?.isEditing && <GroupButton>
              <IconAction onClick={() => setEdit(node.id, true)} src={IconEdit} alt="edit"></IconAction>
              {node.id !== "root" && <IconAction onClick={remove} src={IconDelete} alt="edit"></IconAction>}
              {node.id !== "root" && <IconAction onClick={up} src={IconUp} alt="edit"></IconAction>}
              {node.id !== "root" && <IconAction onClick={down} src={IconDown} alt="edit"></IconAction>}
            </GroupButton>}
          </StyledContentNode>
        </Node>

        <ChildrenView>
          {node.children?.map((child) => (
            <NodeView key={child.id} {...child} />
          ))}
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
        <Form onSubmit={onSubmit}>
            <LabelEdit>Name:</LabelEdit>
            <InputEdit type="text" value={node.name} onChange={onNewName}></InputEdit>
            <IconActionSave onClick={() => onSubmit()} src={IconSave} alt="edit"></IconActionSave>
        </Form>
    )
}

const ImageLogo = styled.img`
  width: 45px;
  height: 45px;
  margin-right: 16px;
`;

const ChildrenView = styled.div`
  padding-left: 15px;
  position: relative;

  &::before {
    content: '';
    height: 100%;
    left: 15px;
    top: 0px;
    width: 1px;
    background-color: #f2f2f2;
    position: absolute;
  }
  &:hover:before {
    background-color: #bfbfbf;
  }
`;

const StyledContentNode = styled.div`
  display: flex;
  flex-direction: column;
  font-size: 16px;
  font-weight: bold;
`;

const StyledNodeView = styled.div`
  padding-top: 10px;
  padding-left: 15px;
`;

const Node = styled.div<{ dragOver: boolean }>`
  padding: 10px 10px 10px 2px;
  position: relative;
  border: 1px dashed transparent;
  background-color: ${(p) => (p.dragOver ? "#f2f2f2" : undefined)};
  border-radius: ${(p) => (p.dragOver ? "8px" : undefined)};
  border-color: ${(p) => (p.dragOver ? "#f05142" : "")};
  &::before {
    content: "";
    height: 1px;
    top: calc(50% - 1px);
    width: 15px;
    right: 100%;
    background-color: #f2f2f2;
    position: absolute;
  }
  &:hover:before {
    background-color: #bfbfbf;
  }
  cursor: move;
  display: flex;
  align-items: center;
`;

const GroupButton = styled.div`
  display: flex;
  
`;

const IconAction = styled.img`
  border: none;
  cursor: pointer;
  width: 17px;
  height: 17px;
  margin-right: 10px;
  margin-top: 5px;
  opacity: 0.5;
  &:hover {
    opacity: 1;
  }
`;

const IconActionSave = styled.img`
  border: none;
  cursor: pointer;
  width: 20px;
  height: 20px;
  margin-left: 10px;
  opacity: 0.5;
  &:hover {
    opacity: 1;
  }
`;

const LabelEdit = styled.label`
  font-size: 16px;
  margin-right: 10px;
`

const InputEdit = styled.input`
  border: 1px solid #e4e6ef;
  border-radius: 4px;
  height: 35px;
  width: 250px;
  padding-left: 10px;
  background-color: #f5f8fa;
  color: #5e6278;
  outline: none;
  &:focus {
    background-color: #eef3f7;
  }
`;

const Form = styled.form`
  display: flex;
  align-items: center;
`;

