export const unkownEndpoint = (_req, res) =>
  res.status(404).json({ msg: "Endpoint doesn't exist." });

export const errorHandler = (error, _req, res) => {
  console.error(error);

  if (error.name === 'CastError') {
    return res.status(400).json({ error: 'Malformatted id' });
  }

  if (error.name === 'ValidationError') {
    return res.status(400).json({ error: error.message });
  }

  res.status(500).json({ error: error.message });
};
