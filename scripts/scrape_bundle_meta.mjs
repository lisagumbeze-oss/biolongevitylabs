import https from "https";

const products = [
  { id: "prod_20948", slug: "fat-loss-research-bundle", price: 395.91 },
  { id: "prod_44436", slug: "obesity-research-bundle", price: 449.97 },
  { id: "prod_15365", slug: "anti-aging-research-bundle-round-1", price: 489.85 },
  { id: "prod_15359", slug: "eye-research-bundle", price: 379.88 },
  { id: "prod_15321", slug: "cardiovascular-heart-research-bundle", price: 474.88 },
  { id: "prod_219498", slug: "bioscavenger", price: 169.97 },
];

function fetch(url) {
  return new Promise((resolve, reject) => {
    https
      .get(url, { headers: { "User-Agent": "Mozilla/5.0" } }, (res) => {
        let data = "";
        res.on("data", (c) => (data += c));
        res.on("end", () => resolve(data));
      })
      .on("error", reject);
  });
}

for (const p of products) {
  const html = await fetch(`https://biolongevitylabs.com/product/${p.slug}/`);
  const og = html.match(/property="og:image" content="([^"]+)"/);
  const schemaPrice = html.match(/"price":"([0-9.]+)"/);
  const uploads = [
    ...new Set(
      (html.match(/biolongevitylabs\.com\/wp-content\/uploads\/[^"'\\s]+/g) || []).map(
        (u) => u.split("?")[0]
      )
    ),
  ].filter((u) => !u.includes("rank-math") && !u.includes("BioLongevity-Labs-scaled"));

  console.log(
    JSON.stringify({
      id: p.id,
      fallbackPrice: p.price,
      schemaPrice: schemaPrice?.[1],
      image: og?.[1] || "",
      uploads: uploads.slice(0, 8),
    })
  );
}
