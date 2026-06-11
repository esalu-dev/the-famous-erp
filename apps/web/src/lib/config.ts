export const config = {
  services: {
    auth: process.env.NEXT_PUBLIC_AUTH_SERVICE_URL || 'http://localhost:3001',
    inventory: process.env.NEXT_PUBLIC_INVENTORY_SERVICE_URL || 'http://localhost:3002',
    analytics: process.env.NEXT_PUBLIC_ANALYTICS_SERVICE_URL || 'http://localhost:3003',
  },
};
