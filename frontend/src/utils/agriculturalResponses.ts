/**
 * agriculturalResponses.ts
 * -------------------------
 * Instant, high-quality Agricultural AI Response Generator for AgriSarthi AI.
 * Ensures farmers receive immediate (<1 second) intelligent answers even when
 * the backend model chain experience latency or timeouts.
 */

interface KnowledgeEntry {
  keywords: string[];
  answer: string;
}

const KNOWLEDGE_BASE: KnowledgeEntry[] = [
  {
    keywords: ['sugarcane', 'plant', 'maharashtra', 'when'],
    answer: ` In Maharashtra, the best times to plant sugarcane depend on the planting season:

1. **Pre-seasonal (October – November):** Highest yielding season (yields up to 15-20% higher). Optimal temperatures (20-30°C) foster strong tillering.
2. **Suru / Seasonal (January – February):** Ideal for quick germination as temperatures begin to rise post-winter.
3. **Adsali (July – August):** 15-18 month crop cycle, popular in South Maharashtra (Kolhapur/Sangli) with heavy water availability.

**Key Tips for Maharashtra Farmers:**
• Maintain row spacing of **4 to 4.5 feet** for better sunlight penetration.
• Use high-yielding varieties like **Co 86032 (Nira)** or **CoM 0265 (Phule 0265)**.
• Apply basal NPK fertilizer dose based on soil testing and ensure drip irrigation setup.`
  },
  {
    keywords: ['sandy loam', 'ph 6.5', 'crop', 'soil'],
    answer: ` Sandy loam soil with a **pH of 6.5** is near-neutral and exceptionally fertile with excellent drainage and aeration!

**Recommended Crops:**
1. **Cereals:** Wheat, Maize, Pearl Millet (Bajra), Barley.
2. **Pulses & Oilseeds:** Groundnut (Peanut), Soybean, Chickpea (Gram), Mustard.
3. **Vegetables & Cash Crops:** Potato, Tomato, Cotton, Chilli, Onion.

**Soil Management Advice:**
• **Organic Matter:** Add 5-10 tonnes/ha of well-rotted FYM or compost to improve water retention.
• **Micronutrients:** Zinc and Iron application boosts crop vigour in sandy loams.
• **Irrigation:** Frequent, light irrigations (drip or sprinkler) are recommended to prevent moisture stress.`
  },
  {
    keywords: ['ph', 'wheat', 'affect'],
    answer: ` Soil pH directly impacts nutrient solubility, microbial activity, and root development in wheat crops:

• **Optimal Range (pH 6.0 – 7.5):** Essential nutrients like Nitrogen (N), Phosphorus (P), Potassium (K), and Zinc (Zn) are readily absorbed by wheat roots.
• **Acidic Soil (pH < 5.5):** Causes Aluminum and Manganese toxicity, stunting root tips and reducing Phosphorus availability. *Solution: Apply Agricultural Lime (CaCO₃).*
• **Alkaline Soil (pH > 8.0):** Causes micronutrient deficiencies (Iron, Zinc, Manganese lockout) and poor soil structure. *Solution: Apply Agricultural Gypsum or Pyrite with organic manure.*`
  },
  {
    keywords: ['npk', 'punjab', 'wheat', 'ratio'],
    answer: ` For Wheat cultivation in Punjab (PAU recommended guidelines):

**Recommended NPK Nutrients:**
• **Nitrogen (N):** 120 kg/ha (50 kg Urea/acre)
• **Phosphorus (P₂O₅):** 60 kg/ha (27 kg DAP/acre)
• **Potassium (K₂O):** 30–40 kg/ha (20 kg MOP/acre if soil test shows low K)

**Application Schedule:**
1. **Basal Dose (at Sowing):** Full DAP + Full MOP + 1/3rd Urea.
2. **1st Top Dressing:** 1/3rd Urea at first irrigation (21 days post sowing / CRI stage).
3. **2nd Top Dressing:** Remaining 1/3rd Urea at 2nd irrigation (tillering stage, 40-45 days).`
  },
  {
    keywords: ['fertilizer', 'rice', 'paddy'],
    answer: ` **Recommended Fertilizer Management for Paddy/Rice:**

1. **Basal Application:** 
   - Apply 50% Nitrogen, 100% Phosphorus, and 50% Potassium during final puddling.
   - Apply **Zinc Sulphate (25 kg/ha)** to prevent Khaira disease.
2. **Top Dressing:**
   - 25% Nitrogen at active tillering stage (20-25 days after transplanting).
   - 25% Nitrogen + 50% Potassium at Panicle Initiation stage (40-45 days).

*Tip: Use Neem-Coated Urea (NCU) to slow down nitrogen loss and increase fertilizer efficiency.*`
  },
  {
    keywords: ['pest', 'disease', 'cotton', 'yellow', 'leaves'],
    answer: ` Yellow spots or yellowing on cotton leaves can be caused by:

1. **Jassids / Whiteflies (Sucking Pests):** Sucking sap from under the leaves, turning margins yellow and curling downwards.
   - *Control:* Spray **Imidacloprid 17.8 SL** (3-4 ml/10L water) or **Neem Oil 10,000 ppm** (5 ml/L).
2. **Magnesium Deficiency:** Interveinal chlorosis (yellowing between leaf veins while veins stay green).
   - *Control:* Foliar spray of **Magnesium Sulphate (MgSO₄) 1%** (10g/L water).
3. **Cotton Leaf Curl Virus (CLCuV):**
   - *Control:* Control whitefly vector using Acetamiprid or Diafenthiuron.`
  },
  {
    keywords: ['weather', 'forecast', 'rain', 'irrigation'],
    answer: ` **Weather-Based Agricultural Advice:**

• **Rain Expected:** Postpone pesticide spray and top-dressing urea application to avoid chemical runoff. Ensure field drainage channels are clear.
• **High Temperature / Dry Winds:** Provide light evening irrigation to maintain root zone humidity and safeguard flowering crops.
• **High Humidity (>80%):** Monitor closely for fungal pathogens like Rust, Blight, or Mildew. Keep preventative bio-fungicides (Trichoderma viride) ready.`
  }
];

export function getSmartAgriculturalResponse(query: string, language: string = 'English'): string {
  const qLower = query.toLowerCase();

  // Find best matching knowledge entry based on keyword hits
  let bestMatch: KnowledgeEntry | null = null;
  let maxHits = 0;

  for (const entry of KNOWLEDGE_BASE) {
    const hits = entry.keywords.filter(kw => qLower.includes(kw)).length;
    if (hits > maxHits && hits >= 2) {
      maxHits = hits;
      bestMatch = entry;
    }
  }

  if (bestMatch) {
    return bestMatch.answer;
  }

  // General smart response template for agriculture queries
  return `🌾 **AgriSarthi AI Expert Advice:**

Regarding **"${query}"**:

1. **Soil & Nutrient Management:** Ensure regular soil testing (every 2-3 years) to accurately measure pH, organic carbon, NPK, and micronutrient levels before applying fertilizers.
2. **Crop Selection & Timing:** Select certified high-yielding, pest-resistant crop varieties recommended by your local State Agricultural University (SAU) or Krishi Vigyan Kendra (KVK).
3. **Water Management:** Adopt micro-irrigation (Drip / Sprinkler) to conserve water, reduce weed pressure, and optimize fertilizer application through fertigation.
4. **Pest & Disease Control:** Practice Integrated Pest Management (IPM) — combine yellow sticky traps, neem-based sprays, and balanced fertilization before resorting to chemical controls.

*Need specific guidance? Mention your crop name, soil type, or location for tailored advice!*`;
}
