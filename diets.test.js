// tests/diets.test.js
const request = require("supertest");
const app = require("./app"); // Your main app file

it("GET /diets", async () => {
  // Send a GET request to the `/diets` route
  const res = await request(app).get("/diets");
  //On test d'abord la route si elle est egale a 200 (ok)
  expect(res.statusCode).toBe(200);
  //si result est egal a true in ThunderClient
  //We could also do res.body.diets[0].name("Healthy") to check diet name (ThunderClient)
  expect(res.body.result).toEqual(true);
});

it("GET /diets", async () => {
  const res = await request(app).get("/diets");

  expect(res.statusCode).toBe(200);

  expect(res.body.diets.length).toBeGreaterThanOrEqual(5);
});
