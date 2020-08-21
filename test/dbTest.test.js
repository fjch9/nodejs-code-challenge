const mongoose = require("mongoose");
const { MongoMemoryServer } = require("mongodb-memory-server");
const request = require("supertest");
const fs = require("fs");
const express = require("express");
const app = express();
require("../src/routes/codingChallenge.routes")(app);
// May require additional time for downloading MongoDB binaries
jasmine.DEFAULT_TIMEOUT_INTERVAL = 600000;

let mongoServer;
const opts = {
  autoReconnect: true,
  reconnectTries: Number.MAX_VALUE,
  reconnectInterval: 1000
};

beforeAll(async () => {
  mongoServer = new MongoMemoryServer();
  const mongoUri = await mongoServer.getUri();
  await mongoose.connect(mongoUri, opts, err => {
    if (err) console.error(err);
  });
});

afterAll(async () => {
  await mongoose.disconnect();
  await mongoServer.stop();
});

describe("Upload csv", () => {
  it("should upload csv data", async () => {
    const res = await request(app)
      .post("/api/coding-challenge")
      .send({
        file: {
          value: fs.createReadStream(`${__dirname}/mazda-test.csv`),
          options: {
            filename: "mazda-cars.csv",
            contentType: null
          }
        },
        brand: "mazda"
      });
    expect(res.statusCode).toEqual(200);
  });
});
