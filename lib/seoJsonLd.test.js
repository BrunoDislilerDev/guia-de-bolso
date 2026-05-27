import assert from "node:assert/strict";
import { getLugarSchemaType } from "./seoJsonLd.js";

assert.equal(getLugarSchemaType({ categoria: "Natureza" }), "TouristAttraction");
assert.equal(getLugarSchemaType({ categoria: "Gastronomia" }), "FoodEstablishment");
assert.equal(getLugarSchemaType({ categoria: "Serviços" }), "LocalBusiness");

console.log("seoJsonLd.test.js: ok");
