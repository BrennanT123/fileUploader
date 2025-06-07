

import crypto from "crypto";


/**
 * Validates password by comparint it to the hash value corresponding to the email in the db
 * 
 * @param {string} password - this is the password to validate
 * @param {string} hash - hash from db correlating to the email
 * @param {*} salt - salt (random values inserted into hash) used for hashing 
 * @returns {boolean} - true if the password is valid, false otherwise.
 */
function validatePassword(password, hash, salt)
{
    var hashVerify = crypto.pbkdf2Sync(password,salt, 10000, 64, 'sha512').toString('hex');
    return hash === hashVerify;
}

/**
 * Function to generate the hash and salt for any given password 
 * @param {string} password - password to be hashed and salted
 * @returns the salt and has for the password
 */
function genPasswordHashAndSalt(password)
{
    var salt = crypto.randomBytes(32).toString('hex');
    var hash = crypto.pbkdf2Sync(password,salt, 10000, 64, 'sha512').toString('hex');

    return{
        salt: salt,
        hash: hash,
    };
}


export default {
    validatePassword,
    genPasswordHashAndSalt,
}

