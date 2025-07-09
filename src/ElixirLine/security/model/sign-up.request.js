/**
 * Sign up request
 * @summary
 * Represents a sign-up request
 */
export class SignUpRequest {
    /**
     * Constructor
     * @param {string} email - The username
     * @param {string} password - The password
     * @param {string} role - The role
     */
    constructor(email, password, role) {
        this.email = email;
        this.password = password
        this.role = role;
    }
}