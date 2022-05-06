module.exports = {
  paths: {
    '/auth/login': {
      post: {
        summary: 'Login',
        description: 'login',
        produces: ['application/json'],
        parameters: [
          {
            in: 'body',
            name: 'body',
            description: 'task object',
            required: true,
            schema: {
              type: 'object',
              $ref: '#/definitions/Login',
            },
          },
        ],
        responses: {
          200: {
            description: 'successful operation',
            schema: {
              type: 'array',
              items: {
                $ref: '#/definitions/todosResponse',
              },
            },
          },
          400: {
            description: 'Invalid status value',
            schema: {
              $ref: '#/definitions/InvalidResponse',
            },
          },
        },
      },
    },
  },
};
