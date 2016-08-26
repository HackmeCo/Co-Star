


// GET /thespians

app.get('/thespians', function (req, res) {
  res.sendFile( path.join(__dirname, '../client', 'index.html') );
})


// POST /thespians

app.post('/thespians', function (req, res) {
  res.sendFile( path.join(__dirname, '../client', 'index.html') );
});