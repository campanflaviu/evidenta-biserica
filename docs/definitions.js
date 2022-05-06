module.exports = {
  definitions: {
    Login: {
      type: "object", // data type
      properties: {
        email: {
          type: "string", // data-type
          description: "Email", // desc
          example: "email@domain.com", // example of an id
        },
        password: {
          type: "string", // data-type
          description: "Password", // desc
          example: "here goes the password", // example of a title
        },
      },
    },
  }
};
