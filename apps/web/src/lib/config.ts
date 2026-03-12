export const config = {
  services: {
    auth: process.env.NEXT_PUBLIC_AUTH_SERVICE_URL!,
    inventory: process.env.NEXT_PUBLIC_INVENTORY_SERVICE_URL!,
    analytics: process.env.NEXT_PUBLIC_ANALYTICS_SERVICE_URL!,
  },
};
