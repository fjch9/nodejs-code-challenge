const csvtojson = require("csvtojson");

const db = require("../models");
const CsvUpload = db.csvUploads;
// object with the column layout for each brand
const brandLayouts = require("../config/brandColumnLayout.json");

// Uploads CSV content
exports.upload = (req, res) => {
  try {
    // Validate request
    if (!req.files) {
      res.send({
        status: false,
        message: "No file uploaded"
      });
    }
    if (!req.body.brand) {
      res.send({
        status: false,
        message: "No brand specified"
      });
    } else {
      let csvFile = req.files.file;

      //this will place the file into the upload directory
      csvFile.mv("./uploads/" + csvFile.name);

      //parsing the csv into json
      csvtojson()
        .fromFile(`./uploads/${req.files.file.name}`)
        .then(csvData => {
          // console.log(csvData);
          const brand = req.body.brand.toLowerCase();
          const columnLayout = brandLayouts.brands[brand].columnLayout;

          // var obj = JSON.parse(brandLayouts);

          //we'll proceed to process the data according to each car brand

          res.send({
            status: true,
            message: "CSV file uploaded!",
            data: {
              name: csvFile.name,
              mimetype: csvFile.mimetype,
              size: csvFile.size,
              data: csvData,
              columnLayout: columnLayout
            }
          });
        });
    }
  } catch (err) {
    res.status(500).send(err);
  }

  // const csvUpload = new CsvUpload({
  //   uuid: req.body.uuid,
  //   vin: req.body.vin,
  //   make: req.body.make,
  //   model: req.body.model,
  //   mileage: req.body.mileage,
  //   year: req.body.year,
  //   price: req.body.price,
  //   zip_code: req.body.zip_code
  // });

  // Saves the data in the collection
  //   csvUpload
  //     .save(csvUpload)
  //     .then(data => {
  //       console.log(data);
  //       res.send(data);
  //     })
  //     .catch(err => {
  //       res.status(500).send({
  //         message: err.message || "Some error occurred while uploading the data."
  //       });
  //     });

  //   res.send(req.files);
};
