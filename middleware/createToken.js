const jwt = require('jsonwebtoken')

const createToken = (id) => {
    return jwt.sign({ id }, 'impact week project', {
    });
};





module.exports = {createToken}