import { index, route, layout } from "@react-router/dev/routes";

export default [
  // El Login NO tiene barra lateral, por eso va afuera
  index("routes/login.jsx"),
  
  // Todo lo que esté dentro de 'layout' compartirá el MainLayout
  layout("components/MainLayout.jsx", [
    route("dashboard","routes/dashboard.jsx"), // Página por defecto después del login
    route("usuarios", "routes/usuarios.jsx"),
    route("ventas", "routes/ventas.jsx"),
    route("inventario", "routes/inventario.jsx"),
    route("compras", "routes/compras.jsx"),
    route("productos", "routes/productos.jsx"),
    route("reportes", "routes/reportes.jsx"),
    route("reporteventas", "routes/reporteventas.jsx"),
    route("reportemensual", "routes/reportemensual.jsx"),
    route("app.analisis-detallado", "routes/app.analisis-detallado.jsx"),
  ]),

  route(".well-known/*", "routes/ignore.jsx"),
] ;