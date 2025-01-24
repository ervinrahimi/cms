export default function buildQuery(
  searchParams: URLSearchParams,
  tableName: string,
  validOrderByFields: string[]
) {
  let query = `SELECT * FROM ${tableName}`;
  const conditions: string[] = [];

  // Extract search filters and add to conditions
  const title = searchParams.get('title');
  const author = searchParams.get('author');
  const category = searchParams.get('category');
  const postRef = searchParams.get('post_ref');
  const mediaType = searchParams.get('media_type');
  const name = searchParams.get('name');

  if (title) conditions.push(`title CONTAINS '${title}'`);
  if (author) conditions.push(`author = '${author}'`);
  if (category) conditions.push(`categories CONTAINS '${category}'`);
  if (postRef) conditions.push(`post_ref = '${postRef}'`);
  if (mediaType) conditions.push(`media_type = '${mediaType}'`);
  if (name) conditions.push(`name CONTAINS '${name}'`);

  // Append WHERE clause if any conditions exist
  if (conditions.length > 0) {
    query += ` WHERE ${conditions.join(' AND ')}`;
  }

  // Extract orderBy and orderDirection
  const orderBy = searchParams.get('orderBy') || 'created_at'; // Default field for sorting
  const orderDirection = searchParams.get('orderDirection') || 'DESC'; // Default sorting direction

  // Validate orderBy to prevent SQL injection
  const safeOrderBy = validOrderByFields.includes(orderBy) ? orderBy : 'created_at';

  // Add ORDER BY clause for sorting
  query += ` ORDER BY ${safeOrderBy} ${orderDirection}`;

  // Extract limit parameter for pagination
  let limitParam = parseInt(searchParams.get('limit') || '', 10);
  if (isNaN(limitParam)) {
    limitParam = 10;
  }

  limitParam = Math.max(1, Math.min(limitParam, 100));

  // Extract start parameter for pagination
  let start = parseInt(searchParams.get('start') || '', 10);
  if (isNaN(start)) {
    start = 0;
  }

  // Add LIMIT and START clauses for pagination
  query += ` LIMIT ${limitParam} START ${start}`;

  return query;
}
