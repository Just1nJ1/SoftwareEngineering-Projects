const request = require('request');
const baseUrl = "http://localhost:8080/changepassword";

describe('Change Password API endpoint', function() {
    it("PUT /changepassword should return status 200 for successful password change", function(done) {
        const data = {
            email: 'user2@example.com',
            old_password: 'pass456', 
            new_password: 'pass456',
            repeat_password: 'pass456' //change old_password and new_password if needed after each test
        };

        request.put(
            {url: baseUrl, json: data},
            function(error, response, body) {
                expect(response.statusCode).toBe(200);
                expect(body.message).toBe('Password changed successfully.');
                done();
            }
        );
    });

    it("PUT /changepassword should return status 400 for mismatched new passwords", function(done) {
        const data = {
            email: 'user2@example.com',
            old_password: 'pass456',
            new_password: 'newPassword123',
            repeat_password: 'Password123' //A different password with new password
        };
    
        request.put(
            {url: baseUrl, json: data},
            function(error, response, body) {
                expect(response.statusCode).toBe(400);
                expect(body.message).toBe('New passwords do not match.');
                done();
            }
        );
    });

    it("PUT /changepassword should return status 401 for incorrect old password", function(done) {
        const data = {
            email: 'user2@example.com',
            old_password: 'incorrectPassword123', // incorrcet old password(different with test case1)
            new_password: 'newPassword123',
            repeat_password: 'newPassword123'
        };
    
        request.put(
            {url: baseUrl, json: data},
            function(error, response, body) {
                expect(response.statusCode).toBe(401);
                expect(body.message).toBe('Old password is incorrect.');
                done();
            }
        );
    });

    it("PUT /changepassword should return status 404 for non-existent user email", function(done) {
        const data = {
            email: 'nonexist@gmail.com', // A user email that does not exist in the database
            old_password: 'oldPassword123',
            new_password: 'newPassword123',
            repeat_password: 'newPassword123'
        };
    
        request.put(
            {url: baseUrl, json: data},
            function(error, response, body) {
                expect(response.statusCode).toBe(404);
                expect(body.message).toBe('User not found.');
                done();
            }
        );
    });
});
