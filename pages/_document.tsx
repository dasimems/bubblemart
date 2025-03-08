import { Html, Head, Main, NextScript } from "next/document";

export default function Document() {
  const schema = {
    "@context": "https://schema.org",
    "@type": "Store",
    name: "Bubblemart",
    image: "https://bubblemart.shop/logo.png",
    "@id": "https://bubblemart.shop",
    url: "https://bubblemart.shop",
    telephone: "+234 812 292 9046",
    priceRange: "$ - $$$$$",
    address: {
      "@type": "PostalAddress",
      streetAddress: "23B,Dorethy Close,Admilralty Way, Lekki, Lagos, Nigeria",
      addressLocality: "Lagos",
      postalCode: "",
      addressCountry: "NG"
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: 6.40948,
      longitude: 4.09152
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
        "Sunday"
      ],
      opens: "00:00",
      closes: "23:59"
    },
    sameAs: [
      "https://www.instagram.com/bubblemart_sma",
      "https://bubblemart.shop"
    ]
  };
  return (
    <Html lang="en">
      <Head>
        <meta name="robots" content="follow, index, noarchive" />
        <meta name="Googlebot" content="follow, index, noarchive" />
        <meta name="application-name" content="Dasimems" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="Bubblemart" />
        <meta name="format-detection" content="telephone=yes" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="msapplication-TileColor" content="#ffffff" />
        <meta name="msapplication-tap-highlight" content="no" />
        <meta name="theme-color" content="#0A434F" />
        <link rel="robots" href="/robots.txt" />
        <link rel="sitemap" type="application/xml" href="/sitemap.xml" />
        <meta
          name="keywords"
          content="Bubblemart - Log and gift Shopping, Bubblemart Log and gift Shopping, Social Logs, Facebook Logs, Facebook Log, Instagram Logs, Instagram Log, Twitter Log, Logins"
        />
        <link rel="manifest" href="/site.webmanifest" />
        <link rel="shortcut icon" href="/favicon-16x16.png" type="image/png" />
        <link rel="shortcut icon" href="/favicon-32x32.png" type="image/png" />
        <link
          rel="icon"
          href="/favicon-16x16.png"
          type="image/png"
          sizes="16x16"
        />
        <link
          rel="icon"
          href="/favicon-32x32.png"
          type="image/png"
          sizes="32x32"
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
        />

        {/* <meta
            name="google-site-verification"
            content={process.env.NEXT_PUBLIC_GOOGLE_INDEX_VERIFICATION_ID}
          /> */}
      </Head>
      <body className="font-satoshi">
        <h1 className="-z-[9999] opacity-0 fixed top-0 left-0">
          Website made by dasimems, Duyil Ayomid, Isaac Omonimewa
        </h1>
        <h1 className="-z-[9999] opacity-0 fixed top-0 left-0">
          Bubblemart - Log and gift Shopping
        </h1>
        <h1 className="-z-[9999] opacity-0 fixed top-0 left-0">
          Social Logs available - Facebook, Twiiter, X, Instagram, Youtube,
          Snapshat, Twitch, Discord, Pinterest, Tiktok, Reddit, Tumblr, E.T.C
        </h1>
        <h1 className="-z-[9999] opacity-0 fixed top-0 left-0">
          Send gifts abroad
        </h1>
        <h1 className="-z-[9999] opacity-0 fixed top-0 left-0">
          Social Media logs
        </h1>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
