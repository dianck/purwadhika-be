import { prismaMock } from "../setup_test/singleton";
import { getUser } from "../setup_test/function";

describe("getUser function", () => {
  it("should return an array of users", async () => {
    const sampleUser = [
      {
        id: 1,
        firstName: "John",
        lastName: "Doe",
        email: "johndoe@gmail.com",
      },
      {
        id: 2,
        firstName: "Jane",
        lastName: "Dine",
        email: "janedine@gmail.com",
      },
    ];

    // 🧪 Mocking findMany
    prismaMock.user.findMany.mockResolvedValue(sampleUser);

    // ✅ Assertion
    await expect(getUser()).resolves.toEqual(sampleUser);
  });
});
