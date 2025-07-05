/**
 * Sign In Response
 * @summary
 * Represents a sign-in response
 */
export class SignInResponse {
    /**
     * Constructor
     * @param {string} id - The user id
     * @param {string} email - The username
     * @param {string} token - The token
     */
    constructor(id, email, token) {
        this.id = id;
        this.email = email;
        this.token = token;
    }

}