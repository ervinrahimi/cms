export default function buildQuery(
  searchParams: URLSearchParams,
  tableName: string,
  validOrderByFields: string[]
): string {
  let query = `SELECT * FROM ${tableName}`;
  const conditions: string[] = [];

  // Extract search filters and add to conditions
  const filters: { key: string; column: string }[] = [
    { key: 'title', column: 'title' },
    { key: 'author', column: 'author' },
    { key: 'category', column: 'categories' },
    { key: 'post_ref', column: 'post_ref' },
    { key: 'media_type', column: 'media_type' },
    { key: 'name', column: 'name' },
    { key: 'slug', column: 'slug' },
  ];

  filters.forEach((filter) => {
    const value = searchParams.get(filter.key);
    if (value) {
      // Escape single quotes
      const escapedValue = value.replace(/'/g, "\\'");
      if (['title', 'category', 'name', 'slug'].includes(filter.key)) {
        conditions.push(`${filter.column} CONTAINS '${escapedValue}'`);
      } else {
        conditions.push(`${filter.column} = '${escapedValue}'`);
      }
    }
  });

  // Append WHERE clause if any conditions exist
  if (conditions.length > 0) {
    query += ` WHERE ${conditions.join(' AND ')}`;
  }

  // Extract orderBy and orderDirection
  const orderBy = searchParams.get('orderBy') || 'created_at'; // Default field for sorting
  const orderDirection =
    searchParams.get('orderDirection')?.toUpperCase() === 'ASC' ? 'ASC' : 'DESC'; // Default sorting direction

  // Validate orderBy to prevent SQL injection
  const safeOrderBy = validOrderByFields.includes(orderBy) ? orderBy : 'created_at';

  // Add ORDER BY clause for sorting
  query += ` ORDER BY ${safeOrderBy} ${orderDirection}`;

  // Extract limit parameter for pagination
  let limitParam = parseInt(searchParams.get('limit') || '', 10);
  if (isNaN(limitParam) || limitParam <= 0) {
    limitParam = 10; // Default value
  }
  limitParam = Math.min(limitParam, 100); // Max limit 100

  // Extract start parameter for pagination
  let start = parseInt(searchParams.get('start') || '', 10);
  if (isNaN(start) || start < 0) {
    start = 0; // Default value
  }

  // Add LIMIT and START clauses for pagination
  query += ` LIMIT ${limitParam} START ${start}`;

  return query;
}
