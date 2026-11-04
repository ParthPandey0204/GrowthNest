const buckets = new Map();

const rateLimit = ({ windowMs = 15 * 60 * 1000, max = 10 } = {}) => (req, res, next) => {
  const now = Date.now();
  const key = `${req.ip}:${req.baseUrl}${req.path}`;
  let bucket = buckets.get(key);
  if (!bucket || bucket.resetAt <= now) bucket = { count: 0, resetAt: now + windowMs };
  bucket.count += 1;
  buckets.set(key, bucket);
  if (bucket.count > max) {
    res.set('Retry-After', String(Math.ceil((bucket.resetAt - now) / 1000)));
    return res.status(429).json({ message: 'Too many requests. Please try again later.' });
  }
  return next();
};

module.exports = rateLimit;
