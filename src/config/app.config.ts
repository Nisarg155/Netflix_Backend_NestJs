export default () => ({
  appName: process.env.APP_NAME || 'netflix backend',
  databaseUrl: process.env.DATABASE_URL,
  jwtSecret: process.env.JWT_SECRET,
  adminJwtSecret: process.env.JWT_SECRET_ADMIN,
});
