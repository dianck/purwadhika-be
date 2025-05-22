import request from "supertest";
import app from ".."; 
import prisma from "../prisma";

describe("GET /api/users", () => {
    const sampleUser = [
        {
            id: 1,
            firstName: "Budi",
            lastName: "Santoso",
            email: "budis@gmail.com"

        },

        {
            id: 2,
            firstName: "Andi",
            lastName: "Hermansyah",
            email: "andih@gmail.com"
        }
    ]
    
    beforeAll(async () => {
        await prisma.$connect();  
    });


    beforeEach(async () => {
        const users = await prisma.user.findMany();
        if (users.length == 0){
            await prisma.user.createMany({data: sampleUser});
        }
    });

    afterEach(async () => {
        await prisma.user.deleteMany({where: {}});
    });

    afterAll(async () => {
        await prisma.$disconnect();
    });

    it("should return an array of users", async () => {
        const response = await request(app).get("/api/users");

        expect(response.status).toBe(200);
        // expect(response.body).toEqual(sampleUser);
        expect(response.body).toMatchObject({
            users: sampleUser,
        });
    });


});
