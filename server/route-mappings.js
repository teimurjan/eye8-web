const routesMappings = [
  {
    matches: pathname => pathname.startsWith('/admin'),
    route: '/admin',
  },
  {
    matches: pathname => pathname.startsWith('/profile'),
    route: '/profile',
  },
  {
    matches: pathname => pathname.startsWith('/login') || pathname.startsWith('/signup'),
    route: '/',
  },
];

module.exports.getRouteMapping = route => routesMappings.find(mapping => mapping.matches(route));
