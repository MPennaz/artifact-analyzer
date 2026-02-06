// src/features/map/testData.ts

export type DemoSite = {
  id: string;
  name: string;
  description: string;
  latitude: number;
  longitude: number;

  // for UI badges
  isOwner: boolean;

  // mock detail records for the right-side pane
  records: DemoDetailRecord[];

  // mock AI outputs for the right-side pane
  ai: DemoAiOutputs;
};

export type DemoDetailRecord = {
  id: string;
  siteId: string;

  title: string;
  artifactType:
    | 'Tools'
    | 'Stone & Rock'
    | 'Bone'
    | 'Pottery'
    | 'Weapons'
    | 'Jewelry'
    | 'Cultural'
    | 'Historical'
    | 'Other';

  notes: string;
  estimatedAge: string;

  latitude: number;
  longitude: number;

  // path under /public
  imageUrl: string;

  recordedAt: string;
};

export type DemoAiOutputs = {
  masterSummary: string;
  locationAgent: string;
  artifactAgent: string;
  ageAgent: string;
  suggestedNextSites: string[];
};

const IMG_POOL = [
  '/demo/img1.png',
  '/demo/img2.png',
  '/demo/img3.png',
  '/demo/img4.png',
  '/demo/img5.png',
  '/demo/img6.png',
  '/demo/img7.png',
  '/demo/img8.png'
];

// quick deterministic-ish helper (keeps “random” stable per id)
function hashToInt(s: string) {
  let h = 0;
  for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) >>> 0;
  return h;
}

function pickImage(seed: string) {
  const idx = hashToInt(seed) % IMG_POOL.length;
  return IMG_POOL[idx]!;
}

// ✅ explicit img1..img8 helper (1-based)
function pickImageByIndex(oneBased: number) {
  const safe = Math.max(1, Math.min(oneBased, IMG_POOL.length));
  return IMG_POOL[safe - 1]!;
}

/**
 * Adds a tiny jitter to lat/lng so records appear “near” the site.
 * jitterDeg ~ 0.0008 ≈ ~90m (varies by latitude)
 */
function jitterCoord(base: number, seed: string, jitterDeg = 0.0008) {
  const n = hashToInt(seed);
  const r = (n % 1000) / 1000; // 0..0.999
  const sign = n % 2 === 0 ? 1 : -1;
  return base + sign * r * jitterDeg;
}

function isoDaysAgo(days: number) {
  const d = new Date();
  d.setDate(d.getDate() - days);
  return d.toISOString();
}

function mkRecord(input: {
  id: string;
  siteId: string;
  siteLat: number;
  siteLng: number;
  title: string;
  artifactType: DemoDetailRecord['artifactType'];
  notes: string;
  estimatedAge: string;
  daysAgo: number;
  imageUrl?: string; // ✅ explicit override
}): DemoDetailRecord {
  const {
    id,
    siteId,
    siteLat,
    siteLng,
    title,
    artifactType,
    notes,
    estimatedAge,
    daysAgo,
    imageUrl
  } = input;

  const lat = jitterCoord(siteLat, id + ':lat');
  const lng = jitterCoord(siteLng, id + ':lng');

  return {
    id,
    siteId,
    title,
    artifactType,
    notes,
    estimatedAge,
    latitude: Number(lat.toFixed(6)),
    longitude: Number(lng.toFixed(6)),
    // ✅ use explicit if provided, otherwise stable fallback
    imageUrl: imageUrl ?? pickImage(id),
    recordedAt: isoDaysAgo(daysAgo)
  };
}

export const DEMO_SITES: DemoSite[] = [
  {
    id: 'c2d5b2f3-b723-4aff-8729-9db0c8475fd0',
    name: 'Mitchell Prehistoric Indian Village',
    description:
      'Located on the shores of Lake Mitchell, the Mitchell Prehistoric Indian Village is a 1,000 year-old Native American village currently under study.',
    // Lake Mitchell area (approx)
    latitude: 43.7416,
    longitude: -98.0298,
    isOwner: false,
    records: [
      mkRecord({
        id: 'rec-mit-001',
        siteId: 'c2d5b2f3-b723-4aff-8729-9db0c8475fd0',
        siteLat: 43.7416,
        siteLng: -98.0298,
        title: 'Pottery shard cluster',
        artifactType: 'Pottery',
        notes:
          'Several ceramic fragments found in close proximity; possible cooking vessel.',
        estimatedAge: '~900–1100 years old',
        daysAgo: 2,
        imageUrl: pickImageByIndex(1) // ✅ img1
      }),
      mkRecord({
        id: 'rec-mit-002',
        siteId: 'c2d5b2f3-b723-4aff-8729-9db0c8475fd0',
        siteLat: 43.7416,
        siteLng: -98.0298,
        title: 'Bone fragment (worked)',
        artifactType: 'Bone',
        notes: 'Small worked bone piece; could be part of a tool handle.',
        estimatedAge: '~800–1000 years old',
        daysAgo: 4,
        imageUrl: pickImageByIndex(2) // ✅ img2
      }),
      mkRecord({
        id: 'rec-mit-003',
        siteId: 'c2d5b2f3-b723-4aff-8729-9db0c8475fd0',
        siteLat: 43.7416,
        siteLng: -98.0298,
        title: 'Stone scraper',
        artifactType: 'Tools',
        notes: 'Flaked stone edge suggests hide-processing or general scraping.',
        estimatedAge: '~900–1200 years old',
        daysAgo: 6,
        imageUrl: pickImageByIndex(3) // ✅ img3
      }),
      mkRecord({
        id: 'rec-mit-004',
        siteId: 'c2d5b2f3-b723-4aff-8729-9db0c8475fd0', // ✅ fixed mismatch
        siteLat: 43.7416,
        siteLng: -98.0298,
        title: 'Fire pit charcoal sample',
        artifactType: 'Cultural',
        notes: 'Charcoal and ash layer; good candidate for dating.',
        estimatedAge: 'Dating pending (est. ~1000 years)',
        daysAgo: 8,
        imageUrl: pickImageByIndex(4) // ✅ img4
      }),
      mkRecord({
        id: 'rec-mit-005',
        siteId: 'c2d5b2f3-b723-4aff-8729-9db0c8475fd0', // ✅ fixed mismatch
        siteLat: 43.7416,
        siteLng: -98.0298,
        title: 'Decorative bead',
        artifactType: 'Jewelry',
        notes: 'Small bead-like object; may indicate personal adornment.',
        estimatedAge: '~700–1000 years old',
        daysAgo: 10,
        imageUrl: pickImageByIndex(5) // ✅ img5
      }),
      mkRecord({
        id: 'rec-mit-006',
        siteId: 'c2d5b2f3-b723-4aff-8729-9db0c8475fd0', // ✅ fixed mismatch
        siteLat: 43.7416,
        siteLng: -98.0298,
        title: 'Lithic flakes scatter',
        artifactType: 'Stone & Rock',
        notes: 'Multiple flakes suggest tool-making activity nearby.',
        estimatedAge: '~900–1200 years old',
        daysAgo: 12,
        imageUrl: pickImageByIndex(6) // ✅ img6
      })
    ],
    ai: {
      masterSummary:
        'This site shows strong indicators of a long-term settlement: pottery fragments, tool-making debris, and evidence of hearth activity. The mix of domestic artifacts suggests routine daily life and repeated occupation over time.',
      locationAgent:
        'The site’s proximity to a lake supports settlement patterns: water access, food resources, and transportation. Clusters of pottery + charcoal samples suggest possible living/cooking areas.',
      artifactAgent:
        'Pottery + lithic flakes + scrapers strongly align with village life: cooking, hide processing, and tool production. The bead supports cultural/personal items beyond purely functional tools.',
      ageAgent:
        'Artifact styles and context point toward roughly 900–1100 years ago. Charcoal samples could tighten this window once dated.',
      suggestedNextSites: [
        'Search for additional hearth circles nearby',
        'Look for storage pits (subsurface anomalies)',
        'Survey shoreline edge for additional activity areas'
      ]
    }
  },

  {
    id: 'fea240bd-5751-4501-813d-9f7d4fd82df5',
    name: 'On a Slant Indian village',
    description:
      'Slant Village was occupied by the Mandan, an agricultural Indian tribe, and received its name because of the sloping ground upon which it was situated.',
    // Slant Village State Historic Site area (approx)
    latitude: 46.7447,
    longitude: -100.6222,
    isOwner: false,
    records: [
      mkRecord({
        id: 'rec-sla-001',
        siteId: 'fea240bd-5751-4501-813d-9f7d4fd82df5',
        siteLat: 46.7447,
        siteLng: -100.6222,
        title: 'Pottery rim piece',
        artifactType: 'Pottery',
        notes:
          'Rim fragment with visible patterning; may indicate specific vessel style.',
        estimatedAge: '~1400–1700 CE',
        daysAgo: 1,
        imageUrl: pickImageByIndex(1) // ✅ img1
      }),
      mkRecord({
        id: 'rec-sla-002',
        siteId: 'fea240bd-5751-4501-813d-9f7d4fd82df5',
        siteLat: 46.7447,
        siteLng: -100.6222,
        title: 'Arrow point fragment',
        artifactType: 'Weapons',
        notes:
          'Chipped stone point; fragment suggests break during use or manufacture.',
        estimatedAge: '~1400–1700 CE',
        daysAgo: 3,
        imageUrl: pickImageByIndex(2) // ✅ img2
      }),
      mkRecord({
        id: 'rec-sla-003',
        siteId: 'fea240bd-5751-4501-813d-9f7d4fd82df5',
        siteLat: 46.7447,
        siteLng: -100.6222,
        title: 'Grinding stone surface',
        artifactType: 'Tools',
        notes:
          'Smoothed stone surface consistent with grinding processing (food prep).',
        estimatedAge: '~1400–1700 CE',
        daysAgo: 5,
        imageUrl: pickImageByIndex(3) // ✅ img3
      }),
      mkRecord({
        id: 'rec-sla-004',
        siteId: 'fea240bd-5751-4501-813d-9f7d4fd82df5',
        siteLat: 46.7447,
        siteLng: -100.6222,
        title: 'Charred seed sample',
        artifactType: 'Cultural',
        notes: 'Charred plant material; supports agricultural activity.',
        estimatedAge: 'Dating pending (likely 1400–1700 CE)',
        daysAgo: 7,
        imageUrl: pickImageByIndex(4) // ✅ img4
      }),
      mkRecord({
        id: 'rec-sla-005',
        siteId: 'fea240bd-5751-4501-813d-9f7d4fd82df5',
        siteLat: 46.7447,
        siteLng: -100.6222,
        title: 'Bone awl-like tool',
        artifactType: 'Bone',
        notes:
          'Bone piece shaped to a point; could be used for stitching/leatherwork.',
        estimatedAge: '~1400–1700 CE',
        daysAgo: 9,
        imageUrl: pickImageByIndex(5) // ✅ img5
      }),
      mkRecord({
        id: 'rec-sla-006',
        siteId: 'fea240bd-5751-4501-813d-9f7d4fd82df5',
        siteLat: 46.7447,
        siteLng: -100.6222,
        title: 'Trade-style ornament',
        artifactType: 'Historical',
        notes:
          'Small ornament-like object; could reflect later contact-era materials.',
        estimatedAge: '~1600–1800 CE (possible)',
        daysAgo: 11,
        imageUrl: pickImageByIndex(6) // ✅ img6
      })
    ],
    ai: {
      masterSummary:
        'The record set suggests an agricultural village with evidence of food processing, domestic pottery use, and hunting/defense tools. Charred seeds support farming and storage practices.',
      locationAgent:
        'Sloped terrain can influence settlement layout: structures may align along ridges, with activity areas downslope. Sample clusters suggest distinct zones for cooking, crafting, and storage.',
      artifactAgent:
        'Grinding stone + pottery + bone awl indicate daily life and processing. Arrow point fragment indicates hunting and protection. Ornament suggests later period material culture.',
      ageAgent:
        'Most items fit a late prehistoric to early historic timeframe. The “trade-style” item could indicate a slightly later layer or nearby contact-era activity.',
      suggestedNextSites: [
        'Search for lodge circle patterns',
        'Map artifact density along the slope',
        'Look for storage/cache pits near agricultural indicators'
      ]
    }
  },

  {
    id: '7be2cdb5-5f3c-4e68-a67d-d9309bf354d7',
    name: 'Cahokia Mounds',
    description:
      'Recognized as the largest pre-Columbian site North of Mexico. Peaked in 1100 CE, covered more than 4,000 acres, had 120 earthen mounds, and had a population of about 20,000 - larger than London at the time.',
    // Cahokia Mounds area (approx)
    latitude: 38.655,
    longitude: -90.061,
    isOwner: false,
    records: [
      mkRecord({
        id: 'rec-cah-001',
        siteId: 'site-cahokia',
        siteLat: 38.655,
        siteLng: -90.061,
        title: 'Decorated pottery fragment',
        artifactType: 'Pottery',
        notes:
          'Fragment with complex decoration; likely ceremonial or high-status use.',
        estimatedAge: '~1000–1200 CE',
        daysAgo: 2,
        imageUrl: pickImageByIndex(1) // ✅ img1
      }),
      mkRecord({
        id: 'rec-cah-002',
        siteId: 'site-cahokia',
        siteLat: 38.655,
        siteLng: -90.061,
        title: 'Stone tool (polished)',
        artifactType: 'Tools',
        notes:
          'Polished stone tool; may be used for shaping or construction tasks.',
        estimatedAge: '~1000–1200 CE',
        daysAgo: 4,
        imageUrl: pickImageByIndex(2) // ✅ img2
      }),
      mkRecord({
        id: 'rec-cah-003',
        siteId: 'site-cahokia',
        siteLat: 38.655,
        siteLng: -90.061,
        title: 'Shell bead',
        artifactType: 'Jewelry',
        notes: 'Bead suggests adornment and potential long-distance trade networks.',
        estimatedAge: '~1000–1200 CE',
        daysAgo: 6,
        imageUrl: pickImageByIndex(3) // ✅ img3
      }),
      mkRecord({
        id: 'rec-cah-004',
        siteId: 'site-cahokia',
        siteLat: 38.655,
        siteLng: -90.061,
        title: 'Charcoal layer sample',
        artifactType: 'Cultural',
        notes:
          'Charcoal layer possibly linked to structured burning or cooking activity.',
        estimatedAge: 'Dating pending (est. 1000–1200 CE)',
        daysAgo: 8,
        imageUrl: pickImageByIndex(4) // ✅ img4
      }),
      mkRecord({
        id: 'rec-cah-005',
        siteId: 'site-cahokia',
        siteLat: 38.655,
        siteLng: -90.061,
        title: 'Pigment residue',
        artifactType: 'Cultural',
        notes:
          'Colored residue suggests painting/ceremonial use or artifact decoration.',
        estimatedAge: '~1000–1200 CE',
        daysAgo: 10,
        imageUrl: pickImageByIndex(5) // ✅ img5
      }),
      mkRecord({
        id: 'rec-cah-006',
        siteId: 'site-cahokia',
        siteLat: 38.655,
        siteLng: -90.061,
        title: 'Chert flakes',
        artifactType: 'Stone & Rock',
        notes: 'Chert flakes indicate tool production and craft activity nearby.',
        estimatedAge: '~1000–1200 CE',
        daysAgo: 12,
        imageUrl: pickImageByIndex(6) // ✅ img6
      })
    ],
    ai: {
      masterSummary:
        'Cahokia’s records strongly suggest a dense, complex settlement with craft production, ceremonial material culture, and evidence consistent with large population centers. Items like shell beads imply trade and regional networks.',
      locationAgent:
        'As a major mound complex, artifact finds likely correlate with activity zones (ceremonial, domestic, craft). Recording exact coordinates helps map these zones over time.',
      artifactAgent:
        'Decorated pottery + pigment residue suggest symbolic/ceremonial use. Chert flakes + polished stone tools support ongoing craft production and construction support.',
      ageAgent:
        'Overall range aligns well with the peak era around 1100 CE. Charcoal sample could refine the specific layer’s date.',
      suggestedNextSites: [
        'Survey perimeter areas for craft-production clusters',
        'Focus on transitions between mound and domestic areas',
        'Track bead/pigment finds for ceremonial zone mapping'
      ]
    }
  }
];

/**
 * Convenience helpers for your map UI
 */
export function getDemoSiteById(siteId: string | null | undefined) {
  if (!siteId) return null;
  return DEMO_SITES.find((s) => s.id === siteId) ?? null;
}

export function getAllDemoPins() {
  return DEMO_SITES.map((s) => ({
    id: s.id,
    name: s.name,
    latitude: s.latitude,
    longitude: s.longitude,
    isOwner: s.isOwner
  }));
}

export function getDemoSiteByName(name: string | null | undefined) {
  if (!name) return null;
  const n = name.trim().toLowerCase();

  return DEMO_SITES.find((s) => s.name.trim().toLowerCase() === n) ?? null;
}
