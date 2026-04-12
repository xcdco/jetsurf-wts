import { business, siteUrl } from "@/lib/seo-config";
import { faqItems } from "@/lib/faq-data";

const brandImage =
  "https://images.unsplash.com/photo-1502680390469-be75c86b636f?w=1200&q=80&auto=format&fit=crop";

export function JsonLd() {
  const organization = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: business.name,
    url: siteUrl,
    email: business.email,
    telephone: business.phoneTel,
    sameAs: business.sameAs,
    logo: {
      "@type": "ImageObject",
      url: "https://images.unsplash.com/photo-1502680390469-be75c86b636f?w=512&h=512&fit=crop&q=80",
    },
  };

  const localBusiness = {
    "@context": "https://schema.org",
    "@type": "SportsActivityLocation",
    name: business.name,
    image: brandImage,
    url: siteUrl,
    telephone: business.phoneTel,
    email: business.email,
    address: {
      "@type": "PostalAddress",
      streetAddress: business.address.streetAddress,
      addressLocality: business.address.addressLocality,
      addressRegion: business.address.addressRegion,
      postalCode: business.address.postalCode,
      addressCountry: business.address.addressCountry,
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: business.geo.lat,
      longitude: business.geo.lng,
    },
    openingHoursSpecification: {
      "@type": "OpeningHoursSpecification",
      dayOfWeek: [
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday",
        "Sunday",
      ],
      opens: "09:00",
      closes: "20:00",
    },
    priceRange: "₽₽",
    areaServed: ["Севастополь", "Крым"],
  };

  const faq = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqItems.map((item) => ({
      "@type": "Question",
      name: item.q,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.a,
      },
    })),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organization) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusiness) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faq) }}
      />
    </>
  );
}
