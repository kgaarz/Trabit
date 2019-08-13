module.exports = function getRoute(id, schema, res) {
  schema.findById(
      id
    )
    .exec()
    .then(doc => {
      if (doc) {
        res.status(200).send({
          message: "Successfully get data",
          data: doc
        });
      } else {
        res
          .status(404)
          .json({
            message: "No valid entry found for provided ID"
          });
      }
    })
    .catch(err => {
      res.status(502).json({
        message: "Database-Connection failed",
        error: err
      });
    });
}
