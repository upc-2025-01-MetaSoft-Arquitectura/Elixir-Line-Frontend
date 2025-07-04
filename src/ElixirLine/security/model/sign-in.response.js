/**
 * Sign In Response
 * @summary
 * Represents a sign-in response
 */
export class SignInResponse {
    /**
     * Constructor
     * @param {string} id - The user id
     * @param {string} username - The username
     * @param {string} token - The token
     * @param role
     */
    constructor(id, username, token, role) {
        this.id = id;
        this.username = username;
        this.token = token;
        this.role = role;
    }

}