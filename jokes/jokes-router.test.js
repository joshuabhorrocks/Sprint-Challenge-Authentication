const supertest = require("supertest");

const server = require("../api/server");
const db = require("../database/dbConfig");

afterEach(async () => {
    await db("users").truncate();
});

let token;

beforeAll((done) => {
    supertest(server)
    .post("/api/auth/register")
    .send({
        username: "atestusername",
        password: "atestpassword"
    })
    .end((err, response) => {
        // console.log("Token: ", response.body.token)
        token = response.body.token;
        done();
    })
})

describe("jokes-router", () => {
    it("can run the tests", () => {
        expect(true).toBeTruthy();
    });

    describe("GET / and fail", () => {
        it("Should require authentication and return 401", () => {
            return (
                supertest(server)
                .get("/api/jokes")
                .set('Authorization', null)
                .then(response => {
                    expect(response.status).toBe(401);
                })
            )
        })
    })

    describe("GET / and succeed", () => {
        it("Should accept token and return 200", () => {
            return (
                supertest(server)
                .get("/api/jokes")
                .set('Authorization', `${token}`)
                .then(response => {
                    expect(response.status).toBe(200)
                })
            )
        });
    });
});
