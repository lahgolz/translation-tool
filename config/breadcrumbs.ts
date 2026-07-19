export default {
	/*
	 * The prefix to be used for all the routes.
	 * It can be a string (a route pattern), or a function
	 * that takes two arguments and returns a string or BreadcrumbItem.
	 * E.g: (ctx: HttpContext, router: Router) => ({ url: '/admin/dashboard', title: 'Dashboard' })
	 *
	 * @default null
	 */
	prefix: null,
};
