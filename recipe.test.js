const request = require('supertest');
const app = require('./app');

// Test qu'il y a plus de 500 recettes
it('GET /recipes/all', async () => {
    const res = await request(app).get('/recipes/all');

    expect(res.statusCode).toBe(200);
    expect(res.body.number).toBeGreaterThanOrEqual(500);
});

// Test qu'il y a des recttes de soupe
it('GET /recipes/search', async () => {
    const res = await request(app).get('/recipes/search?name=soup');

    expect(res.statusCode).toBe(200);
    expect(res.body.result).toEqual(true);
});

// Test que la route recipe par id fonctionne
it('GET /recipes/recipe/:id', async () => {
    const res = await request(app).get('/recipes/recipe/67c35fded4c0c6e5baee23c5');

    expect(res.statusCode).toBe(200);
    expect(res.body.result).toEqual(true);
});