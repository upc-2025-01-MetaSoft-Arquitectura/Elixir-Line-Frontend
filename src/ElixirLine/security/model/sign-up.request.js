/**
 * Sign up request
 * @summary
 * Represents a sign-up request
 */
export class SignUpRequest {
    /**
     * Constructor
     * @param {string} username - The username
     * @param {string} password - The password
     * @param {string} role - The role
     */
    constructor(username, password, role) {
        this.username = username;
        this.password = password
        this.role = role;
    }
}