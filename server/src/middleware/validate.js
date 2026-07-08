/** Runs a zod schema against a request part and replaces it with parsed data. */
export function validate(schema, part = 'body') {
  return (req, res, next) => {
    const result = schema.safeParse(req[part]);
    if (!result.success) {
      const message = result.error.issues.map((i) => i.message).join(', ');
      return res.status(400).json({ error: message });
    }
    req[part] = result.data;
    next();
  };
}
