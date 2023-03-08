db = db.getSiblingDB(process.env.MONGO_DB || 'dns-lookup');
db.createUser({
  user: process.env.MONGODB_USERNAME || 'dnsuser',
  pwd: process.env.MONGODB_PASSWORD || 'dnspass',
  roles: [
    {
      role: 'readWrite',
      db: process.env.MONGO_DB || 'dns-lookup',
    },
  ],
});
