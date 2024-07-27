module.exports = {
  apps: [
    {
      name: 'lua-ai-assistant-api',
      script: 'dist/main.js',
      instances: 'max',
      exec_mode: 'cluster',
    },
  ],
};
