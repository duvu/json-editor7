import { createContext, useContext, useMemo } from 'react';
import convertTreeToSchema from './convertTreeToSchema';

export type PropertyType =
  | {
      type: 'text';
    }
  | {
      type: 'number';
    }
  | {
      type: 'boolean';
    }
  | {
      type: 'choice';
      options: string[];
    }
  | {
      type: 'array';
    };

export type ItemType = {
  name: string;
  type: string;
  properties: Record<string, PropertyType>;
  value?: any;
  leaf?: boolean; // can have child node or not
  validChildType?: string[];
};

export const ItemTypes: ItemType[] = [
  {
    name: 'String',
    type: 'string',
    value: {
      type: 'string'
    },
    properties: {},
    leaf: true,
  },
  {
    name: 'Integer',
    type: 'integer',
    value: {
      type: 'integer'
    },
    properties: {},
    leaf: true,
  },

  {
    name: 'Number',
    type: 'number',
    value: {
      type: 'number'
    },
    properties: {
      multipleOf: { type: 'number' },
    },
    leaf: true,
  },
  {
    name: 'Boolean',
    type: 'boolean',
    value: {
      type: 'boolean'
    },
    properties: {},
    leaf: true,
  },
  {
    name: 'Array',
    type: 'array',
    value: {
      type: 'array'
    },
    properties: {},
    leaf: true,
  },

  {
    name: 'Object',
    type: 'object',
    value: {
      type: 'object'
    },
    properties: {
      additionalProperties: { type: 'boolean' },
    },
    validChildType: ['properties', 'required'],
  },
  {
    name: 'Properties',
    type: 'properties',
    value: undefined,
    properties: {},
  },
  {
    name: 'MaturityDate',
    type: 'maturityDate',
    value: {
      type: 'maturityDate'
    },
    properties: {},
  },
  {
    name: 'NominalInterestRate',
    type: 'nominalInterestRate',
    value: {
      type: 'nominalInterestRate'
    },
    properties: {},
  }
];

export type TreeNode = {
  id: string;
  type: string;
  name: string;

  valueSchema?: Object;
  value?: string

  isEditing: boolean;
  parent?: string; // parentId
  children?: TreeNode[]; // store
  orderId?: number;
};

export type TreeStore = TreeNode[]; // store tree in an array

export type ContextType = {
  treeStore: TreeStore;
  clear: () => void;
  append: (node: TreeNode) => void;
  remove: (node: TreeNode) => void;
  edit: (id: string, newName: string) => void;
  setEditing: (id: string, isEditing: boolean) => void;
  moveUp: (node: TreeNode) => void;
  moveDown: (node: TreeNode) => void;

  schemaList: any[];
  appendSchema: (schema: any) => void;
};

export const Context = createContext<ContextType>(
  null as unknown as ContextType,
);

function toTree(source: TreeStore, item?: TreeNode) {
  // console.log('Tree0', source)
  if (!item) {
    item = source.find((item) => item.id === 'root');
  }

  let parent: TreeNode = { ...item, children: [] };
  parent.children = source
    .filter((x) => x.parent === item.id)
    .sort((a, b) => +a.orderId - +b.orderId)
    .map((y) => toTree(source, y));

  return parent;
}

function toSchema(source: TreeStore) {
  // convert array of TreeNode to schema Json
  const tree = toTree(source);
  const schema = convertTreeToSchema(tree);

  return schema;
}

export const useStore = () => {
  const { treeStore } = useContext(Context);
  return useMemo(() => {
    return treeStore
  }, [treeStore]);
}

export const useTreeView = () => {
  const { treeStore } = useContext(Context);

  return useMemo(() => {
    return toTree(treeStore);
  }, [treeStore]);
};

export const useSchema = () => {
  const { treeStore } = useContext(Context);

  return useMemo(() => {
    return toSchema(treeStore);
  }, [treeStore]);
}

export const useById = (id: string) => {
  const { treeStore } = useContext(Context);
  return useMemo(() => {
    return treeStore.filter(x => x.id === id)[0]
  }, [treeStore])
}

export const useClear = () => {
  const { clear } = useContext(Context);
  return clear;
};

export const useAppend = () => {
  const { append } = useContext(Context);
  return append;
};

export const useDel = () => {
  const {remove} = useContext(Context);
  return remove;
}

export const useEdit = () => {
  const {edit} = useContext(Context);
  return edit;
}

export const useEditing = () => {
  const {setEditing} = useContext(Context);
  return setEditing;
}

export const useMoveUp = () => {
  const {moveUp} = useContext(Context);
  return moveUp;
}

export const useMoveDown = () => {
  const {moveDown} = useContext(Context);
  return moveDown;
}

// schema
export const useSchemaList = () => {
  const { schemaList } = useContext(Context);
  return useMemo(() => {
    return schemaList
  }, [schemaList])
}

export const useAppendSchema = () => {
  const {appendSchema} = useContext(Context);
  return appendSchema;
}