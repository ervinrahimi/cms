export default function buildQuery(
  searchParams: URLSearchParams,
  tableName: string,
  validOrderByFields: string[],
  queryField?: 'title' | 'name'
): string {
  // Initialize the query
  let query = `SELECT * FROM ${tableName}`;

  // Array to hold conditions
  const conditions: string[] = [];

  // Supported filters (with dynamic queryField)
  const filters = [
    { key: 'query', column: queryField }, // Map "query" to either "title" or "name"
    { key: 'category', column: 'categories' },
    { key: 'media_type', column: 'media_type' },
    { key: 'slug', column: 'slug' },
    { key: 'city', column: 'city' },
    { key: 'country', column: 'country' },
    { key: 'price', column: 'price' },
  ];

  function escapeValue(value: string): string {
    return value.replace(/\\/g, '\\\\').replace(/'/g, "\\'").replace(/&/g, '\\&');
  }

  // Iterate through filters and add conditions
  filters.forEach((filter) => {
    const value = searchParams.get(filter.key); // Get the value
    if (value) {
      const decodedValue = decodeURIComponent(value.trim()); // Decode and trim
      const escapedValue = escapeValue(decodedValue); // Escape single quotes
      if (filter.key === 'query') {
        conditions.push(`${filter.column} CONTAINS '${escapedValue}'`);
      } else {
        conditions.push(`${filter.column} = '${escapedValue}'`);
      }
    }
  });

  // Add WHERE clause if conditions exist
  if (conditions.length > 0) {
    query += ` WHERE ${conditions.join(' AND ')}`;
  }

  // Handle orderBy and orderDirection
  const orderBy = searchParams.get('orderBy') || 'created_at';
  const orderDirection =
    searchParams.get('orderDirection')?.toUpperCase() === 'ASC' ? 'ASC' : 'DESC';
  const safeOrderBy = validOrderByFields.includes(orderBy) ? orderBy : 'created_at';
  query += ` ORDER BY ${safeOrderBy} ${orderDirection}`;

  // Handle pagination
  let limitParam = parseInt(searchParams.get('limit') || '', 10);
  if (isNaN(limitParam) || limitParam <= 0) {
    limitParam = 10;
  }
  limitParam = Math.min(limitParam, 100);

  let start = parseInt(searchParams.get('start') || '', 10);
  if (isNaN(start) || start < 0) {
    start = 0;
  }

  query += ` LIMIT ${limitParam} START ${start}`;

  return query;
}
