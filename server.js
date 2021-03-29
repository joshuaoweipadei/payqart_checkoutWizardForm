const path = require('path');
const express = require('express');
const app = express();
const cors = require('cors');

// Define port
const port = process.env.NODE_ENV === 'production' ? (process.env.PORT || 80) : 7000;

app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(cors());

// Store API Routes
app.use('/api', require('./order/order.controller'));

if(process.env.NODE_ENV === 'production'){
  // Serve static files from the React app
  app.use(express.static(path.join(__dirname, 'client/build')));

  // The "catchall" handler: for any request that doesn't
  // match one above, send back React's index.html file.
  app.get('*', (req, res) => {
      res.sendFile(path.join(__dirname + '/client/build/index.html'));
  });
}

// Start server
app.listen(port, () => {
  console.log('Server listening on port ' + port);
});