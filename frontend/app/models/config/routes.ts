//  * Users can navigate to these routes regardless of their login status.
export const publicRoutes = ["/products/", "/verify-email", "/pedido/"];

// * Users if logged in and try to navigate to these routes, they will be redirected to the defaultLoginRedirect.
export const authRoutes = ["/login", "/register"];
// export const authRoutes = ['/login', '/register', '/reset-password', '/new-password'];

//* Default routes for login redirect by rol
export const defaultLoginRedirectCliente = "/dashboard/ajustes";
export const defaultLoginRedirectEmpleado = "/dashboard/ventas";

//* Protected routes are those that require the user to be logged in, this is managed on auth.config.ts
