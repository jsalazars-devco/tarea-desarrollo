import { UserResponse } from "../../../src/users/domain/userResponseModel";
import { UserManager } from "../../../src/users/application/userManager";
import { MockUserRepository } from "../infrastructure/mockUserRepository";

describe("UserManager", () => {
    let userManager: UserManager;

    beforeEach(() => {
        userManager = new UserManager(new MockUserRepository);
    });

    describe("findUserById", () => {
        test("should return the user when exists a user with that id", async () => {
            const existingUserId = 1;
            expect(await userManager.findUserById(existingUserId)).toBeInstanceOf(UserResponse);
        });

        test("should return null when the user does not exist", async () => {
            const nonExistingUserId = 10;
            expect(await userManager.findUserById(nonExistingUserId)).toBeNull();
        });
    });
});