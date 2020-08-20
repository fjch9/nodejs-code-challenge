module.exports = mongoose => {
  var schema = mongoose.Schema(
    {
      uuid: String,
      vin: String,
      make: String,
      model: String,
      mileage: Number,
      year: Number,
      price: Number,
      zip_code: String
    },
    { timestamps: true }
  );

  schema.method("toJSON", function() {
    const { __v, _id, ...object } = this.toObject();
    object.id = _id;
    return object;
  });

  //csv_uploads is the name of the target collection
  const CsvUpload = mongoose.model("csv_uploads", schema);
  return CsvUpload;
};
