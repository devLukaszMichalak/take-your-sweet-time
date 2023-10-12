export enum PageRouts {
  LOGIN = 'login',
  DASHBOARD = 'dashboard',
}

export function getRouterLink(path: PageRouts): string[] {
  return ['/' + path];
}
