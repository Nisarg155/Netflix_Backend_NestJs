export default () => ({
  appName: process.env.APP_NAME || 'netflix backend',
  database_url: process.env.DATABASE_URL,
});
