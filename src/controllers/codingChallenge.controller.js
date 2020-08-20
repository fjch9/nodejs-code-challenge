const db = require("../models");
const CsvUpload = db.csvUploads;

// Uploads CSV content
exports.upload = (req, res) => {
  // Validate request
  if (
    !req.body.uuid ||
    !req.body.vin ||
    !req.body.make ||
    !req.body.model ||
    !req.body.mileage ||
    !req.body.year ||
    !req.body.price ||
    !req.body.zip_code
  ) {
    res.status(400).send({ message: "Content can not be empty!" });
    return;
  }

  const csvUpload = new CsvUpload({
    uuid: req.body.uuid,
    vin: req.body.vin,
    make: req.body.make,
    model: req.body.model,
    mileage: req.body.mileage,
    year: req.body.year,
    price: req.body.price,
    zip_code: req.body.zip_code
  });

  // Saves the data in the collection
  csvUpload
    .save(csvUpload)
    .then(data => {
      console.log(data);
      res.send(data);
    })
    .catch(err => {
      res.status(500).send({
        message: err.message || "Some error occurred while uploading the data."
      });
    });
};
