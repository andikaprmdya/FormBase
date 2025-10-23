import { Form, Field, Record, FilterCriteria } from '../types';

const API_BASE = 'https://comp2140a3.uqcloud.net/api';
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
 * // Simple AND case: name=John&age>25
 * buildFilterQuery([
 *   { field: 'name', operator: 'eq', value: 'John', logic: 'and' },
 *   { field: 'age', operator: 'gt', value: '25' }
 * ])
 *
 * @example
 * // OR case: or=(name.eq.John,name.eq.Jane)
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

    currentGroup.push(`values->${filter.field}.${filter.operator}.${queryValue}`);

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

  // Build query with or=() grouping for PostgREST
  return groups.map(group => {
    if (group.length === 1) return group[0];
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
      console.log('Fetching forms from:', `${API_BASE}/form?username=eq.${USERNAME}`);
      const response = await fetch(`${API_BASE}/form?username=eq.${USERNAME}`, {
        headers: getHeaders(),
      });
      console.log('Response status:', response.status);
      console.log('Response ok:', response.ok);

      if (!response.ok) {
        const errorText = await response.text();
        console.error('API Error Response:', errorText);
        throw new Error(`Failed to fetch forms: ${response.status} ${errorText}`);
      }

      const data = await response.json();
      console.log('Fetched forms:', data);
      return data;
    } catch (error) {
      console.error('Error fetching forms:', error);
      console.error('Error details:', JSON.stringify(error, null, 2));
      throw error;
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
      console.error('Error fetching form:', error);
      throw error;
    }
  },

  create: async (form: Omit<Form, 'id' | 'username'>): Promise<Form> => {
    try {
      console.log('Creating form:', { ...form, username: USERNAME });
      const response = await fetch(`${API_BASE}/form`, {
        method: 'POST',
        headers: getHeaders('POST'),
        body: JSON.stringify({ ...form, username: USERNAME }),
      });
      console.log('Create form response status:', response.status);

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Create form error:', errorText);
        throw new Error(`Failed to create form: ${response.status} ${errorText}`);
      }

      const data = await response.json();
      console.log('Created form data:', data);
      return Array.isArray(data) ? data[0] : data;
    } catch (error) {
      console.error('Error creating form:', error);
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
      console.error('Error updating form:', error);
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
      console.error('Error deleting form:', error);
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
      console.error('Error fetching fields:', error);
      throw error;
    }
  },

  create: async (field: Omit<Field, 'id' | 'username'>): Promise<Field> => {
    try {
      console.log('Creating field:', { ...field, username: USERNAME });
      const response = await fetch(`${API_BASE}/field`, {
        method: 'POST',
        headers: getHeaders('POST'),
        body: JSON.stringify({ ...field, username: USERNAME }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Create field error:', errorText);
        throw new Error(`Failed to create field: ${response.status} ${errorText}`);
      }

      const data = await response.json();
      console.log('Created field data:', data);
      return Array.isArray(data) ? data[0] : data;
    } catch (error) {
      console.error('Error creating field:', error);
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
      console.error('Error deleting field:', error);
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

      const response = await fetch(url, {
        headers: getHeaders(),
      });
      if (!response.ok) throw new Error('Failed to fetch records');
      return await response.json();
    } catch (error) {
      console.error('Error fetching records:', error);
      throw error;
    }
  },

  create: async (record: Omit<Record, 'id' | 'username'>): Promise<Record> => {
    try {
      console.log('Creating record:', { ...record, username: USERNAME });
      const response = await fetch(`${API_BASE}/record`, {
        method: 'POST',
        headers: getHeaders('POST'),
        body: JSON.stringify({ ...record, username: USERNAME }),
      });
      console.log('Create record response status:', response.status);

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Create record error:', errorText);
        throw new Error(`Failed to create record: ${response.status} ${errorText}`);
      }

      const data = await response.json();
      console.log('Created record data:', data);
      return Array.isArray(data) ? data[0] : data;
    } catch (error) {
      console.error('Error creating record:', error);
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
      console.error('Error deleting record:', error);
      throw error;
    }
  },
};
