/**
 * Parses optional ?page and ?limit query parameters.
 * Returns isPaginated=false when neither is provided to preserve array compatibility.
 */
function getPaginationParams(query, defaultLimit = 10, maxLimit = 100) {
  const hasPagination =
    query.page !== undefined || query.limit !== undefined;

  if (!hasPagination) {
    return { isPaginated: false };
  }

  const page = Math.max(1, parseInt(query.page, 10) || 1);
  const limit = Math.min(
    maxLimit,
    Math.max(1, parseInt(query.limit, 10) || defaultLimit)
  );
  const skip = (page - 1) * limit;

  return { isPaginated: true, page, limit, skip };
}

/**
 * Executes a MongoDB find query with optional pagination.
 * Returns `{ data, pagination }` when paginated, or an array otherwise.
 */
async function paginateCollection(
  collection,
  filter = {},
  query = {},
  sort = { _id: -1 }
) {
  const { isPaginated, page, limit, skip } = getPaginationParams(query);

  if (!isPaginated) {
    return collection.find(filter).sort(sort).toArray();
  }

  const [data, total] = await Promise.all([
    collection.find(filter).sort(sort).skip(skip).limit(limit).toArray(),
    collection.countDocuments(filter),
  ]);

  const totalPages = Math.max(1, Math.ceil(total / limit));

  return {
    data,
    pagination: {
      total,
      page,
      limit,
      totalPages,
      hasNextPage: page < totalPages,
      hasPrevPage: page > 1,
    },
  };
}

module.exports = {
  getPaginationParams,
  paginateCollection,
};
