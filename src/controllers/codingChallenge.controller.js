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

          const defaultColumns =
            brandLayouts.brands["defaultLayout"].columnLayout;

          //we'll proceed to process the data according to each car brand
          const columnLayout = brandLayouts.brands[brand].columnLayout;

          let dataToImport = csvData.map(data => {
            const processedData = new CsvUpload();
            for (let [index, value] of columnLayout.entries()) {
              if (data.hasOwnProperty(value)) {
                processedData[defaultColumns[index]] = data[value];
              }
            }
            return processedData;
          });

          // Saves the data in the collection
          for (let temp of dataToImport) {
            temp
              .save(temp)
              .then(data => {
                console.log(data);
              })
              .catch(err => {
                res.status(500).send({
                  message:
                    err.message ||
                    "Some error occurred while uploading the data."
                });
              });
          }
          res.send({
            status: true,
            message: "CSV file uploaded!",
            data: {
              name: csvFile.name,
              mimetype: csvFile.mimetype,
              size: csvFile.size,
              data: dataToImport,
              columnLayout: columnLayout
            }
          });
        });
    }
  } catch (err) {
    res.status(500).send(err);
  }
};
