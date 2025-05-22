import { prismaMock } from "../setup_test/singleton";
import { getUser } from "../setup_test/function";

test("Should return an array of users", async () => {
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
    
      prismaMock.user.findMany.mockResolvedValue(sampleUser);
    
      await expect(getUser()).resolves.toEqual(sampleUser);

});