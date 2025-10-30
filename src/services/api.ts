import { Form, Field, Record, FilterCriteria } from '../types';
import { logger } from '../utils/logger';
import { NetworkError, APIError, parseFetchError } from '../utils/errors';
import { API_CONFIG } from '../constants/appConstants';

const API_BASE = API_CONFIG.BASE_URL;
const JWT_TOKEN = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyb2xlIjoic3R1ZGVudCIsInVzZXJuYW1lIjoiczQ5MDU4ODkifQ.JptTlKPqXgNhUCE_dP3ESwfqsUYaw3SGNXAYfIH3yzc';
const USERNAME = 's4905889';

/**
 * Build HTTP headers for API requests
 * Includes JWT authentication and PostgREST Prefer header for mutations
 *
 * @param method - HTTP method (POST/PATCH adds 'return=representation' header)
 * @returns Headers object for fetch requests
 */
const getHeaders = (method?: string) => {
  const baseHeaders: any = {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${JWT_TOKEN}`,
  };

  // Add Prefer header for POST/PATCH to return the created/updated data
  if (method === 'POST' || method === 'PATCH') {
    baseHeaders['Prefer'] = 'return=representation';
  }

  return baseHeaders;
};

/**
 * Build PostgREST filter query string from filter criteria
 * Handles both AND and OR logic correctly with PostgREST syntax
 *
 * @param filters - Array of filter criteria
 * @returns URL query string for PostgREST API
 *
 * @example
 * // Simple AND case: values->name.eq.John&values->age.gt.25
 * buildFilterQuery([
 *   { field: 'name', operator: 'eq', value: 'John', logic: 'and' },
 *   { field: 'age', operator: 'gt', value: '25' }
 * ])
 *
 * @example
 * // OR case: or=(values->>name.eq.John,values->>name.eq.Jane)
 * buildFilterQuery([
 *   { field: 'name', operator: 'eq', value: 'John', logic: 'or' },
 *   { field: 'name', operator: 'eq', value: 'Jane' }
 * ])
 */
export const buildFilterQuery = (filters: FilterCriteria[]): string => {
  if (filters.length === 0) return '';

  // Check if we have any OR logic
  const hasOr = filters.some((f, i) => i < filters.length - 1 && f.logic === 'or');

  if (!hasOr) {
    // Simple AND case - just join with &
    return filters.map(f => {
      let queryValue = f.value;
      if (f.operator === 'ilike') {
        queryValue = `*${f.value}*`;
      } else if (f.operator === 'like') {
        queryValue = `${f.value}*`; // Starts with
      }
      return `values->${f.field}.${f.operator}.${queryValue}`;
    }).join('&');
  }

  // Complex case with OR - group consecutive OR filters
  const groups: string[][] = [];
  let currentGroup: string[] = [];

  filters.forEach((filter, index) => {
    let queryValue = filter.value;
    if (filter.operator === 'ilike') {
      queryValue = `*${filter.value}*`;
    } else if (filter.operator === 'like') {
      queryValue = `${filter.value}*`; // Starts with
    }

    // For JSONB fields, use ->> for text extraction in OR clauses
    currentGroup.push(`values->>${filter.field}.${filter.operator}.${queryValue}`);

    if (filter.logic === 'or' && index < filters.length - 1) {
      // Continue current OR group
    } else if (index < filters.length - 1) {
      // AND - start new group
      groups.push(currentGroup);
      currentGroup = [];
    }
  });

  // Push last group
  if (currentGroup.length > 0) {
    groups.push(currentGroup);
  }

  // Build query with proper PostgREST syntax
  // For OR groups with JSONB, use or=(values->>field.op.val,...)
  return groups.map(group => {
    if (group.length === 1) {
      // Single condition - replace ->> with -> for regular access
      return group[0].replace('values->>', 'values->');
    }
    // Multiple conditions in OR group - use or=(...) wrapper
    return `or=(${group.join(',')})`;
  }).join('&');
};

/**
 * Forms API
 * CRUD operations for form management
 */
export const formAPI = {
  getAll: async (): Promise<Form[]> => {
    try {
      const url = `${API_BASE}/form?username=eq.${USERNAME}`;
      logger.log('Fetching forms from:', url);

      const response = await fetch(url, {
        headers: getHeaders(),
      });

      logger.log('Forms response status:', response.status);

      if (!response.ok) {
        const errorText = await response.text();
        logger.error('Forms API Error Response:', errorText);
        throw new APIError(`Failed to fetch forms: ${errorText}`, response.status);
      }

      const data = await response.json();
      logger.log(`Fetched ${data.length} forms`);
      return data;
    } catch (error) {
      logger.error('Error fetching forms:', error);

      if (error instanceof APIError) {
        throw error;
      }

      if (error instanceof TypeError && error.message.includes('fetch')) {
        throw new NetworkError();
      }

      throw new APIError('Failed to load forms. Please try again.', 500);
    }
  },

  getById: async (id: number): Promise<Form> => {
    try {
      const response = await fetch(`${API_BASE}/form?id=eq.${id}`, {
        headers: getHeaders(),
      });
      if (!response.ok) throw new Error('Failed to fetch form');
      const data = await response.json();
      return data[0];
    } catch (error) {
      logger.error('Error fetching form:', error);
      throw error;
    }
  },

  create: async (form: Omit<Form, 'id' | 'username'>): Promise<Form> => {
    try {
      logger.log('Creating form:', { ...form, username: USERNAME });
      const response = await fetch(`${API_BASE}/form`, {
        method: 'POST',
        headers: getHeaders('POST'),
        body: JSON.stringify({ ...form, username: USERNAME }),
      });
      logger.log('Create form response status:', response.status);

      if (!response.ok) {
        const errorText = await response.text();
        logger.error('Create form error:', errorText);
        throw new Error(`Failed to create form: ${response.status} ${errorText}`);
      }

      const data = await response.json();
      logger.log('Created form data:', data);
      return Array.isArray(data) ? data[0] : data;
    } catch (error) {
      logger.error('Error creating form:', error);
      throw error;
    }
  },

  update: async (id: number, form: Partial<Omit<Form, 'id' | 'username'>>): Promise<Form> => {
    try {
      const response = await fetch(`${API_BASE}/form?id=eq.${id}`, {
        method: 'PATCH',
        headers: getHeaders('PATCH'),
        body: JSON.stringify(form),
      });
      if (!response.ok) throw new Error('Failed to update form');
      const data = await response.json();
      return Array.isArray(data) ? data[0] : data;
    } catch (error) {
      logger.error('Error updating form:', error);
      throw error;
    }
  },

  delete: async (id: number): Promise<void> => {
    try {
      const response = await fetch(`${API_BASE}/form?id=eq.${id}`, {
        method: 'DELETE',
        headers: getHeaders(),
      });
      if (!response.ok) throw new Error('Failed to delete form');
    } catch (error) {
      logger.error('Error deleting form:', error);
      throw error;
    }
  },
};

/**
 * Fields API
 * CRUD operations for form field management
 */
export const fieldAPI = {
  getByFormId: async (formId: number): Promise<Field[]> => {
    try {
      const response = await fetch(`${API_BASE}/field?form_id=eq.${formId}&order=order_index.asc`, {
        headers: getHeaders(),
      });
      if (!response.ok) throw new Error('Failed to fetch fields');
      return await response.json();
    } catch (error) {
      logger.error('Error fetching fields:', error);
      throw error;
    }
  },

  create: async (field: Omit<Field, 'id' | 'username'>): Promise<Field> => {
    try {
      logger.log('Creating field:', { ...field, username: USERNAME });
      const response = await fetch(`${API_BASE}/field`, {
        method: 'POST',
        headers: getHeaders('POST'),
        body: JSON.stringify({ ...field, username: USERNAME }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        logger.error('Create field error:', errorText);
        throw new Error(`Failed to create field: ${response.status} ${errorText}`);
      }

      const data = await response.json();
      logger.log('Created field data:', data);
      return Array.isArray(data) ? data[0] : data;
    } catch (error) {
      logger.error('Error creating field:', error);
      throw error;
    }
  },

  delete: async (id: number): Promise<void> => {
    try {
      const response = await fetch(`${API_BASE}/field?id=eq.${id}`, {
        method: 'DELETE',
        headers: getHeaders(),
      });
      if (!response.ok) throw new Error('Failed to delete field');
    } catch (error) {
      logger.error('Error deleting field:', error);
      throw error;
    }
  },
};

/**
 * Records API
 * CRUD operations for form record/data management
 * Supports filtering with PostgREST query syntax
 */
export const recordAPI = {
  getByFormId: async (formId: number, filters?: FilterCriteria[]): Promise<Record[]> => {
    try {
      let url = `${API_BASE}/record?form_id=eq.${formId}`;

      if (filters && filters.length > 0) {
        const filterQuery = buildFilterQuery(filters);
        url += `&${filterQuery}`;
      }

      logger.log('Fetching records from URL:', url);

      const response = await fetch(url, {
        headers: getHeaders(),
      });

      logger.log('Records response status:', response.status);

      if (!response.ok) {
        const errorText = await response.text();
        logger.error('Records API Error Response:', errorText);
        throw new APIError(`Failed to fetch records: ${errorText}`, response.status);
      }

      const data = await response.json();
      logger.log(`Fetched ${data.length} records for form ${formId}`);
      return data;
    } catch (error) {
      logger.error('Error fetching records:', error);

      if (error instanceof APIError) {
        throw error;
      }

      if (error instanceof TypeError && error.message.includes('fetch')) {
        throw new NetworkError();
      }

      throw new APIError('Failed to load records. Please try again.', 500);
    }
  },

  create: async (record: Omit<Record, 'id' | 'username'>): Promise<Record> => {
    try {
      logger.log('Creating record:', { ...record, username: USERNAME });
      const response = await fetch(`${API_BASE}/record`, {
        method: 'POST',
        headers: getHeaders('POST'),
        body: JSON.stringify({ ...record, username: USERNAME }),
      });
      logger.log('Create record response status:', response.status);

      if (!response.ok) {
        const errorText = await response.text();
        logger.error('Create record error:', errorText);
        throw new Error(`Failed to create record: ${response.status} ${errorText}`);
      }

      const data = await response.json();
      logger.log('Created record data:', data);
      return Array.isArray(data) ? data[0] : data;
    } catch (error) {
      logger.error('Error creating record:', error);
      throw error;
    }
  },

  delete: async (id: number): Promise<void> => {
    try {
      const response = await fetch(`${API_BASE}/record?id=eq.${id}`, {
        method: 'DELETE',
        headers: getHeaders(),
      });
      if (!response.ok) throw new Error('Failed to delete record');
    } catch (error) {
      logger.error('Error deleting record:', error);
      throw error;
    }
  },
};
