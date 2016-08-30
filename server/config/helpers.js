module.exports = {
  errorHandler: function (error, req, res, next) {
    // send error message to client
    // message for gracefull error handling on app
    res.status(500).send({error: error.message});
  },
  notInDb: function (result, req, res, next) {
    //send 404 message to client when item not in db
    res.status(404).send("Thespian not in local DB.");
  }
};