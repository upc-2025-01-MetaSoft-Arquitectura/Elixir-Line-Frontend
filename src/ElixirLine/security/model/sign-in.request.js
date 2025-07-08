/**
 * SignInRequest model
 * @summary
 * Represents a sign-in request
 */
export class SignInRequest {
    /**
     * Constructor
     * @param {string} email - The email
     * @param {string} password - The password
     */
    constructor(email, password) {
        this.email = email;
        this.password = password
    }
}