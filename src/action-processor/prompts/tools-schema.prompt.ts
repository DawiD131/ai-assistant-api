export const toolsSchema = [
  {
    type: 'function',
    function: {
      name: 'saveTodo',
      description: 'Save todo list or plan',
      parameters: {
        type: 'object',
        properties: {
          name: {
            type: 'string',
            description: 'Name of todo list',
          },
          tasks: {
            type: 'array',
            description: 'task list',
            items: {
              type: 'string',
            },
          },
        },
        required: ['name', 'tasks'],
      },
    },
  },
];
