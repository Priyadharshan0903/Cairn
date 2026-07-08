export function notFound(req, res) {
  res.status(404).json({ error: 'Not found' });
}

// eslint-disable-next-line no-unused-vars
export function errorHandler(err, req, res, next) {
  console.error(err);
  if (err.code === 11000) {
    return res.status(409).json({ error: 'That email is already registered' });
  }
  const status = err.status || 500;
  res.status(status).json({ error: err.message || 'Something went wrong' });
}

/** Wrap async route handlers so thrown errors reach errorHandler. */
export const asyncHandler = (fn) => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next);
