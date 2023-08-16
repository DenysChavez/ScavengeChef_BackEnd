const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')

const api = supertest(app)

test(' are returned as json', async () => {
  await api
    .get('/api/recipes')
    .expect(200)
    .expect('Content-Type', /application\/json/)
}, 100000)

test('there are two recipes', async () => {
  const response = await api.get('/api/recipes')

  expect(response.body).toHaveLength(2)
})

test('the first recipe is about Pozole', async () => {
  const response = await api.get('/api/recipes')

  expect(response.body[0].name).toBe('Pozole de Pollo')
})

afterAll(async () => {
  await mongoose.connection.close()
})