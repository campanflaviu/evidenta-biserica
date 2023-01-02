"use strict";
module.exports = {
    definitions: {
        Login: {
            type: 'object',
            properties: {
                email: {
                    type: 'string',
                    description: 'Email',
                    example: 'email@domain.com', // example of an id
                },
                password: {
                    type: 'string',
                    description: 'Password',
                    example: 'here goes the password', // example of a title
                },
            },
        },
    },
};
