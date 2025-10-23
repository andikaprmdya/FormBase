// API Data Types
export interface Form {
  id: number;
  name: string;
  description: string;
  username: string;
}

export interface Field {
  id: number;
  form_id: number;
  name: string;
  field_type: FieldType;
  options?: string[];
  required: boolean;
  is_num: boolean;
  order_index: number;
  username: string;
}

export type FieldType = 'text' | 'multiline' | 'multiple choice' | 'location' | 'image';

export interface Record {
  id: number;
  form_id: number;
  values: RecordValues;
  username: string;
}

export type RecordValues = {
  [fieldName: string]: string | number | LocationValue | null;
};

export interface LocationValue {
  lat: number;
  lng: number;
}

export type FilterOperator = 'ilike' | 'like' | 'eq' | 'gt' | 'lt' | 'gte' | 'lte';
export type FilterLogic = 'and' | 'or';

export interface FilterCriteria {
  field: string;
  operator: FilterOperator;
  value: string;
  logic?: FilterLogic;
}

export type RootStackParamList = {
  Landing: undefined;
  MainTabs: undefined;
  Home: undefined;
  About: undefined;
  FormList: undefined;
  FormCreate: undefined;
  FormEdit: { formId: number };
  FormDetail: { formId: number; formName: string };
  FieldCreate: { formId: number };
  RecordCreate: { formId: number; formName: string };
  RecordList: { formId: number; formName: string };
  FilterBuilder: { formId: number; formName: string };
  Map: undefined;
  Help: undefined;
  Settings: undefined;
};

export type TabParamList = {
  HomeTab: undefined;
  FormsTab: undefined;
  MapTab: undefined;
  AboutTab: undefined;
};
