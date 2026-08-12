import { Helmet } from 'react-helmet-async';

import Logo from '@/assets/images/logo.avif'


export default function BusinessSchema() {
  const schema = {
    "@context": "https://schema.org",
    "@type": "HVACBusiness",
    "name": "Pátyod Klíma",
    "description": "Klímaszolgáltatás Pátyodon és 30 km-es körzetében. Ingyenes felmérés! Telepítés, karbantartás, tisztítás - gyorsan, garanciával, rövid határidővel.",
    "image": {Logo},
    "url": "https://patyodklima.hu",
    "telephone": "+36306290793",
    "address": {
      "@type": "PostalAddress",
      "addressLocality": "Pátyod",
      "streetAddress": "Rákóczi utca 55.",
      "postalCode": "4766",
      "addressCountry": "HU"
    },
    "geo": {
      "@type": "GeoCoordinates",
      "latitude": "47.8642",
      "longitude": "22.6244"
    }
  };

  return (
    <Helmet>
      <script type="application/ld+json">
        {JSON.stringify(schema)}
      </script>
    </Helmet>
  );
}