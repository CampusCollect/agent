const express = require('express');
const app = express();
const port = process.env.PORT || 3000;

app.get('/', (req, res) => {
  res.send('Agentic web app backend');
});

app.listen(port, () => {
  console.log(`Backend listening on port ${port}`);
});
