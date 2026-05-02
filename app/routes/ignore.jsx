// app/routes/ignore.jsx
export function loader() {
  // Respondemos con un 404 real para que el navegador deje de preguntar
  return new Response(null, { status: 404 });
}

export default function Ignore() {
  return null; 
}