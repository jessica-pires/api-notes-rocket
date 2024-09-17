module.exports = {
  apps: [
    {
      name: 'api-notas',
      script: 'server.js', // Certifique-se de que este é o nome correto do seu arquivo principal
      env: {
        NODE_ENV: 'development'
      },
      env_production: {
        NODE_ENV: 'production'
      }
    }
  ]
};
