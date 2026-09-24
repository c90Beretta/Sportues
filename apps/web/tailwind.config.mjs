/** @type {import('tailwindcss').Config} */
export default {
  content: ["./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}"],
  theme: {
    extend: {
      colors: {
        primary: "var(--ues-vino)",
        "primary-container": "var(--ues-vino-oscuro)",
        secondary: "var(--ues-naranja)",
        "secondary-container": "var(--ues-dorado)",
        "tertiary-fixed-dim": "var(--ues-dorado)", // Para el ícono de la llama Berrendo
        
        "text-primary": "var(--ues-tinta)",
        "text-muted": "var(--ues-gris)",
        "on-surface": "var(--ues-tinta)",
        
        background: "var(--ues-fondo)",
        surface: "#FFFFFF",
        "surface-container-lowest": "#FFFFFF",
        "surface-container-low": "var(--ues-vino-suave)",
        "surface-container": "var(--ues-linea)",      
        "surface-container-high": "#e0d9db",
        "surface-container-highest": "var(--ues-gris)",
        
        outline: "var(--ues-linea)",
        "state-error": "var(--ues-error)",
        "state-success": "var(--ues-exito)",
      },
      fontFamily: {
        heading: ["Montserrat", "sans-serif"],
      },
      fontSize: {
        "headline-lg-mobile": ["2rem", { lineHeight: "2.5rem", fontWeight: "700" }],
        "headline-sm": ["1.5rem", { lineHeight: "2rem", fontWeight: "700" }],
        "label-lg": ["1rem", { lineHeight: "1.5rem", letterSpacing: "0.025em", fontWeight: "600" }],
        "label-md": ["0.875rem", { lineHeight: "1.25rem", letterSpacing: "0.025em", fontWeight: "600" }],
        "label-sm": ["0.75rem", { lineHeight: "1rem", letterSpacing: "0.05em", fontWeight: "600" }],
        "body-md": ["1rem", { lineHeight: "1.5rem" }],
        "body-sm": ["0.875rem", { lineHeight: "1.25rem" }],
      },
    },
  },
  plugins: [],
};