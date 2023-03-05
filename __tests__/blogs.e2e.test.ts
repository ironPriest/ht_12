import request from 'supertest'
import {app} from "../src/appSettings";
import {runDb} from "../src/repositories/db";
import mongoose from "mongoose";

describe('/api', () => {

    beforeAll(async () => {
        await runDb()
        await request(app).delete('/testing/all-data')
    })

    afterAll(async ()=>{
        await mongoose.connection.close()
    })

    it('should create user', async () => {
        await request(app)
            .post('/users')
            .send({
                "login": "login",
                "password": "password",
                "email": "email@email.com"
            })
            .expect(201)
    })

})