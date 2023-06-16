const app = require('./app');

// Environment variable=> node JS or Express apps can run in different environments And the most important ones are the development environment and the production environment.That's because depending on the environment,we might use different databases or   all kinds of different settings that might change depending on the development that we're in.

// by default, Express sets the environment to development
console.log(app.get('env'));

const port = 3000;

app.listen(port, () => {
  console.log(`App running on port ${port}... `);
});
