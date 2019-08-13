module.exports = function deleteRoute(id, schema, res){
    schema.findOneAndDelete(
      id
    )
    .exec()
    .then(doc => {
      if (doc) {

        res.status(200).send({
			message: "Successfully deleted",
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
