const mapping: Record<string, string> = {
  organizations: 'organization',
  'token-transactions': 'token_transaction',
  users: 'user',
};

export function convertRouteToEntityUtil(route: string) {
  return mapping[route] || route;
}
