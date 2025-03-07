const request = require('supertest');
const mongoose = require('mongoose');
const app = require('./app');
const User = require('./models/users');

const newUserTest = { username: 'test-backend', password: 'test1234', email: 'test-backend@test.fr' };
const fields = ['muscleGain', 'healthy', 'pregnant', 'glutenFree', 'vegetarian'];

beforeEach(async () => {
    await User.deleteOne({ username: newUserTest.username });
});

it('POST /users/signup: ok', async () => {
    const res = await request(app).post('/users/signup').send(newUserTest);

    expect(res.statusCode).toBe(200);
    expect(res.body.result).toBe(true);
    expect(res.body.token).toEqual(expect.any(String));
    expect(res.body.token.length).toBe(32);
});

it('POST /users/signup: user already exists', async () => {
    const res = await request(app).post('/users/signup').send(newUserTest);

    expect(res.statusCode).toBe(200);

    const res2 = await request(app).post('/users/signup').send(newUserTest);

    expect(res2.statusCode).toBe(200);
    expect(res2.body.result).toBe(false);
    expect(res2.body.error).toEqual('User already exists with given email.');
});

it('POST /users/signup: empty username', async () => {
    const res = await request(app).post('/users/signup').send({ username: '', password: 'test1234', email: 'test-backend@test.fr' });

    expect(res.statusCode).toBe(200);
    expect(res.body.result).toBe(false);
    expect(res.body.error).toEqual('Empty username.');
});

it('POST /users/signup: no username', async () => {
    const res = await request(app).post('/users/signup').send({password: 'test1234', email: 'test-backend@test.fr' });

    expect(res.statusCode).toBe(200);
    expect(res.body.result).toBe(false);
    expect(res.body.error).toEqual('Empty username.');
});

it('POST /users/signup: invalid password', async () => {
    const res = await request(app).post('/users/signup').send({ username: 'test-backend', password: 'test', email: 'test-backend@test.fr' });

    expect(res.statusCode).toBe(200);
    expect(res.body.result).toBe(false);
    expect(res.body.error).toEqual('Password must be at least 6 characters long.');
});

it('POST /users/signup: password with invalid characters', async () => {
    const res = await request(app).post('/users/signup').send({ username: 'test-backend', password: 'test1234{}', email: 'test-backend@test.fr' });

    expect(res.statusCode).toBe(200);
    expect(res.body.result).toBe(false);
    expect(res.body.error).toEqual('Password contains not allowed characters.');
});

it('POST /users/signup: invalid email', async () => {
    const res = await request(app).post('/users/signup').send({ username: 'test-backend', password: 'test1234', email: 'test-backendtest.fr' });

    expect(res.statusCode).toBe(200);
    expect(res.body.result).toBe(false);
    expect(res.body.error).toEqual('Not valid email.');
});


it('POST /users/signin: ok', async () => {
    const res = await request(app).post('/users/signup').send(newUserTest);
    expect(res.statusCode).toBe(200);

    const res2 = await request(app).post('/users/signin').send({
        email: newUserTest.email,
        password: newUserTest.password,
    });
    expect(res2.statusCode).toBe(200);
    expect(res2.body.result).toBe(true);
    expect(res2.body.token).toEqual(expect.any(String));
    expect(res2.body.token.length).toBe(32);
});

it('POST /users/signin: different password', async () => {
    const res = await request(app).post('/users/signup').send(newUserTest);
    expect(res.statusCode).toBe(200);

    const res2 = await request(app).post('/users/signin').send({
        email: newUserTest.email,
        password: newUserTest.password + 'test',
    });
    expect(res2.statusCode).toBe(200);
    expect(res2.body.result).toBe(false);
    expect(res2.body.error).toEqual('User not found or wrong password.');
});

it('POST /users/signin: unknown user', async () => {
    const res = await request(app).post('/users/signup').send(newUserTest);
    expect(res.statusCode).toBe(200);

    const res2 = await request(app).post('/users/signin').send({
        email: newUserTest.email + 'fr',
        password: newUserTest.password,
    });
    expect(res2.statusCode).toBe(200);
    expect(res2.body.result).toBe(false);
    expect(res2.body.error).toEqual('User not found or wrong password.');
});

it('PUT /users/diet/:token: ok', async () => {
    const res = await request(app).post('/users/signup').send(newUserTest);
    expect(res.statusCode).toBe(200);

    const res2 = await request(app).put(`/users/diet/${res.body.token}`).send({field: fields[0]})
    expect(res2.statusCode).toBe(200);
    expect(res2.body.result).toBe(true);
});

it('PUT /users/diet/:token: invalid field', async () => {
    const res = await request(app).post('/users/signup').send(newUserTest);
    expect(res.statusCode).toBe(200);

    const res2 = await request(app).put(`/users/diet/${res.body.token}`).send({field: 'test-field'})
    expect(res2.statusCode).toBe(200);
    expect(res2.body.result).toBe(false);
    expect(res2.body.error).toEqual('Invalid field.');
});

it('PUT /users/diet/:token: invalid token', async () => {
    const res = await request(app).post('/users/signup').send(newUserTest);
    expect(res.statusCode).toBe(200);

    const res2 = await request(app).put(`/users/diet/falsetoken`).send({field: fields[0]})
    expect(res2.statusCode).toBe(200);
    expect(res2.body.result).toBe(false);
    expect(res2.body.error).toEqual('User not found.');
});

afterAll(async () => {
    await User.deleteOne({ username: newUserTest.username });
    mongoose.connection.close();
});
