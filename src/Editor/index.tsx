import React, { useCallback, useMemo, useState } from 'react';
import styled from 'styled-components';
import { Context, TreeStore, TreeNode } from './model';
import Toolbox from './Toolbox';
import TreeView from './TreeView';
import JsonView from './JsonView';
import JsonSchemaView from './JsonSchemaView';

const Editor: React.FC = () => {
  const [treeStore, setTreeStore] = useState<TreeStore>([
    {
      id: 'root',
      type: 'jsonSchema',
      isEditing: false,
      name: 'Json Schema'
    },
  ]);

  const clear = useCallback(() => {
    setTreeStore([
      {
        id: 'root',
        type: 'jsonSchema',
        isEditing: false,
        name: 'Json Schema'
      },
    ]);
  }, []);

  const append = useCallback((node: TreeNode) => {
    console.debug('append', node);
    setTreeStore((x) => {
      const numOfChild = x.filter((y) => y.parent === node.parent).length;
      node.orderId = numOfChild + 1;
      node.name = `${node.name} (${numOfChild + 1})`;
      return [...x, node]
    });
  }, []);

  const remove = useCallback((node: TreeNode) => {
    const filtered = treeStore.filter(x => {
      if (node.id === 'root') {
        console.log('Not allowed!')
        return true;
      } else {
        return x.id !== node.id
      }
    });
    setTreeStore(filtered);
  }, [treeStore]);

  const edit = useCallback((id: string, newName: string) => {
    let treeStoreX = [];
    for (let x of treeStore) {
      if (x.id === id) {
        if (!!newName) {
          x.name = newName;
        }
      }
      treeStoreX.push(x);
    }
    setTreeStore(treeStoreX);
  }, [treeStore]);

  const setEditing = useCallback((id: string, isEditing: boolean) => {
    let treeStoreX = [];
    for (let x of treeStore) {
      if (x.id === id) {
        x.isEditing = isEditing;
      }
      treeStoreX.push(x);
    }
    setTreeStore(treeStoreX);
  }, [treeStore])

  const moveUp = useCallback((node: TreeNode) => {
    const orderId = node.orderId;
    if (orderId > 1) {
      const preNode = treeStore.find(x => x.parent === node.parent && x.orderId === orderId - 1);
      const newTreeStore = treeStore.filter(x => x.id !== node.id && x.id !== preNode.id);
      newTreeStore.push({...node, orderId: preNode.orderId});
      newTreeStore.push({...preNode, orderId: orderId});
      setTreeStore(newTreeStore);
    }
  } , [treeStore]);
  const moveDown = useCallback((node: TreeNode) => {
    const orderId = node.orderId;
    const nextNode = treeStore.find(x => x.parent === node.parent && x.orderId === orderId + 1);
    if (nextNode) {
      const newTreeStore = treeStore.filter(x => x.id !== node.id && x.id !== nextNode.id);
      newTreeStore.push({...node, orderId: nextNode.orderId});
      newTreeStore.push({...nextNode, orderId: orderId});
      setTreeStore(newTreeStore);
    }
  } , [treeStore]);

  const contextValue = useMemo(() => {
    return {
      treeStore,
      clear,
      append,
      remove: remove,
      edit,
      setEditing,
      moveUp,
      moveDown,
    };
  }, [append, remove, edit, setEditing, moveUp, moveDown, treeStore]);

  return (
    <Context.Provider value={contextValue}>
      <Container>
        <TreeView />
        <JsonView/>
        <JsonSchemaView/>
        <Toolbox clear = {clear} setStore={setTreeStore}/>
        
      </Container>
    </Context.Provider>
  );
};

export default Editor;

const Container = styled.div`
  display: grid;
  grid-template-columns: 3fr 2fr 1fr 1fr;
  grid-gap: 0.25rem;
  height: calc(100vh - 50px);
`;
