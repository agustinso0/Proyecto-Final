import React from "react";
import { Helmet } from "react-helmet-async";

const SEOHead = ({
  title = "Control de Gastos Personales - Gestiona tus Finanzas",
  description = "Gestiona tus finanzas personales de manera inteligente. Controla gastos, categoriza transacciones y mantén un balance saludable de tus ingresos y egresos.",
  keywords = "control gastos, finanzas personales, gestión dinero, presupuesto personal, transacciones, categorías gastos, balance financiero",
  canonical = "",
  ogImage = "/og-image.png",
  noIndex = false,
}) => {
  const baseUrl = "https://control-gastos-app.com";
  const fullCanonical = canonical ? `${baseUrl}${canonical}` : baseUrl;

  return (
    <Helmet>
      <title>{title}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords} />
      <link rel="canonical" href={fullCanonical} />

      {noIndex && <meta name="robots" content="noindex, nofollow" />}
    </Helmet>
  );
};

export default SEOHead;
