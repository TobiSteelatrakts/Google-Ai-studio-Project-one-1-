import { Property, PropertyAgent } from '../models/property.model';

export const PRIMARY_AGENT: PropertyAgent = {
  id: 'agent-1',
  name: 'Marcus Sterling',
  title: 'Managing Principal & Architectural Specialist',
  phone: '+1 (310) 892-4410',
  email: 'm.sterling@verdantestates.com',
  license: 'DRE #01928471',
  avatar: '/images/agent_portrait_1792939740440.webp',
  rating: 4.98,
  experienceYears: 16,
  totalDeals: 142,
  bio: 'Specializing in mid-century modernist restorations and avant-garde sustainable estates across coastal Southern California. Marcus bridges architectural preservation with seamless client concierge services.'
};

export const SECONDARY_AGENT: PropertyAgent = {
  id: 'agent-2',
  name: 'Elena Rostova',
  title: 'Senior Partner, Waterfront Portfolio',
  phone: '+1 (310) 745-9920',
  email: 'e.rostova@verdantestates.com',
  license: 'DRE #02148930',
  avatar: '/images/agent_portrait_1792939740440.webp',
  rating: 4.95,
  experienceYears: 12,
  totalDeals: 98,
  bio: 'Recognized authority on coastal residential acquisitions and high-yield architectural holdings. Dedicated to discretion and bespoke advisory.'
};

export const PROPERTIES_DATA: Property[] = [
  {
    id: 'prop-1',
    title: 'The Solstice Glass Pavilion',
    tagline: 'Cantilevered cedar residence with panoramic ocean sunset views & reflection pool',
    status: 'available',
    statusLabel: 'Available Now',
    propertyType: 'Villa',
    featured: true,
    location: {
      address: '1482 Pacific Ridge Drive',
      neighborhood: 'Pacific Palisades',
      city: 'Los Angeles',
      state: 'CA',
      zip: '90272',
      lat: 34.045,
      lng: -118.525,
      mapX: 28,
      mapY: 34,
      walkScore: 78,
      transitScore: 65,
      schoolRating: '10/10'
    },
    specs: {
      beds: 5,
      baths: 6.5,
      sqft: 6850,
      lotSizeSqft: 22400,
      yearBuilt: 2024,
      garageSpaces: 3,
      stories: 2,
      architect: 'Kappe & Olson Architects',
      ceilingHeightFt: 14
    },
    financials: {
      price: 5450000,
      originalPrice: 5700000,
      estMonthlyMortgage: 27950,
      propertyTaxAnnual: 62675,
      hoaDuesMonthly: 420,
      homeInsuranceAnnual: 11500,
      pricePerSqft: 795
    },
    features: [
      'Infinity Reflection Pool',
      'Dual Travertine Fireplaces',
      'Sub-Zero & Miele Chef Kitchen',
      'Integrated Solar Photovoltaic Roof',
      'Custom Wine Cellar (800 bottles)',
      'Floor-to-Ceiling Motorized Glass',
      'Smart Lutron Homeworks Lighting',
      'EV High-Speed Dual Chargers'
    ],
    energyScore: 'Passivhaus Tier 1 (Net Zero Ready)',
    description: 'An architectural triumph of steel, warm cedar timber, and structural glass. Floating majestically above the Pacific coastline, this sanctuary was conceived as an ode to natural light and biophilic living. The double-height great room opens via seamless pocketing glass walls onto an expansive travertine terrace, heated infinity reflection pool, and drought-tolerant botanical gardens.',
    architecturalNotes: 'Designed with passive solar orientation and natural coastal cross-ventilation. Structural cantilevers eliminate corner columns, allowing unbroken 270-degree horizons.',
    images: [
      {
        url: '/images/hero_modern_villa_1792939739344.webp',
        caption: 'Exterior facade at dusk with lit infinity pool and architectural glazing',
        tag: 'Exterior'
      },
      {
        url: '/images/villa_living_room_1792939739632.webp',
        caption: 'Double-height great room with floor-to-ceiling travertine fireplace',
        tag: 'Living Space'
      },
      {
        url: '/images/penthouse_terrace_1792939740144.webp',
        caption: 'Cantilevered terrace with plunge pool and panoramic coastal vistas',
        tag: 'Terrace & Pool'
      }
    ],
    floorPlans: [
      {
        name: 'Main Level (Level 1)',
        sqft: 3950,
        rooms: ['Great Room', 'Chef Kitchen', 'Dining Suite', 'Guest Villa', 'Wine Gallery', 'Terrace'],
        dimensions: '65ft x 58ft'
      },
      {
        name: 'Upper Private Level (Level 2)',
        sqft: 2900,
        rooms: ['Primary Master Suite', 'Dual Bathrooms', '3 En-Suite Bedrooms', 'Library Studio', 'Private Balcony'],
        dimensions: '52ft x 48ft'
      }
    ],
    agent: PRIMARY_AGENT,
    virtualTourUrl: 'https://example.com/virtual-tour/solstice-pavilion'
  },
  {
    id: 'prop-2',
    title: 'The Azure Penthouse at Marina Ridge',
    tagline: 'Private rooftop terrace, heated dip pool & 360-degree coastal bay panoramas',
    status: 'new_listing',
    statusLabel: 'New Listing',
    propertyType: 'Penthouse',
    featured: true,
    location: {
      address: '720 Promenade Maritime, Penthouse B',
      neighborhood: 'Marina Bay',
      city: 'Newport Beach',
      state: 'CA',
      zip: '92660',
      lat: 33.618,
      lng: -117.928,
      mapX: 68,
      mapY: 62,
      walkScore: 92,
      transitScore: 78,
      schoolRating: '9/10'
    },
    specs: {
      beds: 3,
      baths: 3.5,
      sqft: 3420,
      lotSizeSqft: 4800,
      yearBuilt: 2023,
      garageSpaces: 2,
      stories: 1,
      architect: 'Studio Vondel',
      ceilingHeightFt: 12
    },
    financials: {
      price: 3890000,
      estMonthlyMortgage: 19950,
      propertyTaxAnnual: 44735,
      hoaDuesMonthly: 1250,
      homeInsuranceAnnual: 7800,
      pricePerSqft: 1137
    },
    features: [
      'Private Heated Rooftop Plunge Pool',
      'Direct Key-Card Elevator Access',
      'Teak Sun Deck & Outdoor Kitchen',
      'Bespoke Italian Poliform Cabinetry',
      'Automated Somfy Solar Blinds',
      'Private 40ft Marina Boat Slip Option',
      'Acoustic Studio-Grade Glazing',
      'Dedicated Wine & Cigar Vault'
    ],
    energyScore: 'LEED Gold Certified',
    description: 'Crowning the marquee Marina Ridge tower, this masterwork penthouse commands unrestricted perspectives of the yacht harbor and sunset horizons. Finished in hand-selected bleached teak, honed Calacatta marble, and custom bronze hardware, it merges metropolitan sophistication with seaside serenity.',
    architecturalNotes: 'Engineered rooftop terrace with load-bearing plunge pool and perimeter frameless glass balustrades to maximize horizon exposure without wind disruption.',
    images: [
      {
        url: '/images/penthouse_terrace_1792939740144.webp',
        caption: 'Private sunset terrace with plunge pool and panoramic coastal vistas',
        tag: 'Terrace'
      },
      {
        url: '/images/villa_living_room_1792939739632.webp',
        caption: 'Sun-drenched salon with custom oak millwork and garden perspective',
        tag: 'Living Space'
      },
      {
        url: '/images/coastal_bluff_estate_1792940942729.webp',
        caption: 'Harbor overview and evening coastal light',
        tag: 'Overview'
      }
    ],
    floorPlans: [
      {
        name: 'Penthouse Residence & Roof Deck',
        sqft: 3420,
        rooms: ['Primary Suite', 'Sky Lounge', '2 Guest Suites', 'Chef Kitchen', 'Sun Deck & Pool'],
        dimensions: '48ft x 65ft'
      }
    ],
    agent: SECONDARY_AGENT,
    virtualTourUrl: 'https://example.com/virtual-tour/azure-penthouse'
  },
  {
    id: 'prop-3',
    title: 'The Olive Grove Modernist Residence',
    tagline: 'Warm travertine, double-height natural light atrium & native drought-resilient garden',
    status: 'available',
    statusLabel: 'Available Now',
    propertyType: 'Modernist Estate',
    featured: true,
    location: {
      address: '3820 Encino Hills Trail',
      neighborhood: 'Encino Hills',
      city: 'Los Angeles',
      state: 'CA',
      zip: '91436',
      lat: 34.156,
      lng: -118.502,
      mapX: 42,
      mapY: 22,
      walkScore: 68,
      transitScore: 54,
      schoolRating: '10/10'
    },
    specs: {
      beds: 4,
      baths: 4.5,
      sqft: 5200,
      lotSizeSqft: 18500,
      yearBuilt: 2022,
      garageSpaces: 3,
      stories: 2,
      architect: 'Eichler Legacy Group',
      ceilingHeightFt: 16
    },
    financials: {
      price: 4250000,
      estMonthlyMortgage: 21800,
      propertyTaxAnnual: 48875,
      hoaDuesMonthly: 280,
      homeInsuranceAnnual: 8900,
      pricePerSqft: 817
    },
    features: [
      'Mature Century Olive Trees Courtyard',
      'Hand-Cut Roman Travertine Fireplace',
      'Terrazzo & French White Oak Floors',
      'Sculptural Floating Minimalist Staircase',
      'Whole-Home Hydroponic Water Filter',
      'Acoustic Screening Media Room',
      'Boffi Designed Minimalist Bathrooms',
      'Integrated Security Bio-Entry'
    ],
    energyScore: 'Zero Net Carbon Certified',
    description: 'An architectural dialogue between organic warmth and pure modernist geometry. Centered around a tranquil interior olive grove atrium, this estate blends massive thermal-mass travertine walls with expansive structural glass that welcomes dappled sunlight throughout the day.',
    architecturalNotes: 'Passive cooling courtyard architecture creates a gentle thermal chimney effect, maintaining pristine comfort without heavy HVAC consumption.',
    images: [
      {
        url: '/images/modernist_atrium_1792940943369.webp',
        caption: 'Central open-air olive tree atrium and travertine reflecting pool',
        tag: 'Courtyard Atrium'
      },
      {
        url: '/images/villa_living_room_1792939739632.webp',
        caption: 'Double-height living pavilion with floor-to-ceiling travertine chimney',
        tag: 'Living Space'
      },
      {
        url: '/images/hero_modern_villa_1792939739344.webp',
        caption: 'Evening perspective of the cantilevered glass wings and terrace',
        tag: 'Exterior'
      }
    ],
    floorPlans: [
      {
        name: 'Ground Garden Level',
        sqft: 3100,
        rooms: ['Central Atrium', 'Living Salon', 'Culinary Lab', 'Media Lounge', 'Guest Wing'],
        dimensions: '58ft x 50ft'
      },
      {
        name: 'Upper Sanctuary Level',
        sqft: 2100,
        rooms: ['Primary Suite', 'Zen Terrace', '2 En-Suite Bedrooms', 'Executive Study'],
        dimensions: '44ft x 46ft'
      }
    ],
    agent: PRIMARY_AGENT
  },
  {
    id: 'prop-4',
    title: 'The Seacliff Waterfront Compound',
    tagline: 'Private beach access, tiered botanical terraces & dramatic ocean bluff setting',
    status: 'under_contract',
    statusLabel: 'Under Contract',
    propertyType: 'Waterfront',
    featured: false,
    location: {
      address: '29800 Cliffside Drive',
      neighborhood: 'Point Dume',
      city: 'Malibu',
      state: 'CA',
      zip: '90265',
      lat: 34.004,
      lng: -118.808,
      mapX: 12,
      mapY: 48,
      walkScore: 62,
      transitScore: 40,
      schoolRating: '9/10'
    },
    specs: {
      beds: 6,
      baths: 7.5,
      sqft: 8100,
      lotSizeSqft: 43560,
      yearBuilt: 2021,
      garageSpaces: 4,
      stories: 2,
      architect: 'Marmol Radziner Collaborative',
      ceilingHeightFt: 13
    },
    financials: {
      price: 8900000,
      estMonthlyMortgage: 45600,
      propertyTaxAnnual: 102350,
      hoaDuesMonthly: 650,
      homeInsuranceAnnual: 18400,
      pricePerSqft: 1098
    },
    features: [
      'Gated Private Trail to Sandy Cove',
      'Heated 60ft Lap Pool & Spa Pavilion',
      'Detached 2-Bedroom Guest Villa',
      'Marine-Grade Anodized Finishes',
      'Organic Herb & Citrus Orchard',
      'Cold Plunge & Cedar Barrel Sauna',
      'Tesla Powerwall 3 Battery Backup (4x)',
      'Smart Irrigation Weather Tracking'
    ],
    energyScore: 'Eco-Smart Tier A',
    description: 'Poised on an ocean bluff in legendary Point Dume, this private 1-acre compound redefines coastal exclusivity. Surrounded by manicured native coastal flora, residents enjoy an unobstructed direct staircase leading directly to sand and secluded surf breaks.',
    architecturalNotes: 'Constructed with marine-grade bronze, cast-in-place board-formed concrete, and weathering cedar to age gracefully in the sea mist.',
    images: [
      {
        url: '/images/coastal_bluff_estate_1792940942729.webp',
        caption: 'Blufftop residence overlooking the ocean waves and coastline at sunset',
        tag: 'Bluff Estate'
      },
      {
        url: '/images/penthouse_terrace_1792939740144.webp',
        caption: 'Oceanfront sun deck with private pool and panoramic horizon',
        tag: 'Deck'
      },
      {
        url: '/images/villa_living_room_1792939739632.webp',
        caption: 'Expansive indoor-outdoor salon opening to the garden terraces',
        tag: 'Living Space'
      }
    ],
    floorPlans: [
      {
        name: 'Main Manor & Terraces',
        sqft: 6200,
        rooms: ['Grand Salon', 'Dual Kitchens', 'Master Wing', '3 Family Suites', 'Wine Vault'],
        dimensions: '75ft x 62ft'
      },
      {
        name: 'Detached Guest Cottage',
        sqft: 1900,
        rooms: ['Living Suite', 'Kitchenette', '2 Bedrooms', 'Private Patio'],
        dimensions: '35ft x 42ft'
      }
    ],
    agent: SECONDARY_AGENT
  },
  {
    id: 'prop-5',
    title: 'The Highline Architectural Loft',
    tagline: 'Raw concrete, soaring 18ft ceilings, minimalist steel accents & rooftop garden',
    status: 'available',
    statusLabel: 'Available Now',
    propertyType: 'Architectural Studio',
    featured: false,
    location: {
      address: '1100 Arts District Boulevard, Unit 4A',
      neighborhood: 'Arts District',
      city: 'Los Angeles',
      state: 'CA',
      zip: '90013',
      lat: 34.041,
      lng: -118.232,
      mapX: 84,
      mapY: 38,
      walkScore: 96,
      transitScore: 89,
      schoolRating: '8/10'
    },
    specs: {
      beds: 2,
      baths: 2.5,
      sqft: 2650,
      lotSizeSqft: 2650,
      yearBuilt: 2023,
      garageSpaces: 2,
      stories: 2,
      architect: 'Morphosis Studio Alumni',
      ceilingHeightFt: 18
    },
    financials: {
      price: 2150000,
      originalPrice: 2280000,
      estMonthlyMortgage: 11020,
      propertyTaxAnnual: 24725,
      hoaDuesMonthly: 780,
      homeInsuranceAnnual: 4200,
      pricePerSqft: 811
    },
    features: [
      '18-Foot Concrete Ceilings & Steel Trusses',
      'Industrial Black Iron Mullioned Windows',
      'Custom Stainless Steel Boffi Kitchen',
      'Private 800 sq ft Planted Roof Deck',
      'Freight & Private Key-Elevator Access',
      'Integrated Studio Recording Acoustics',
      'Hydronic Radiant Heated Concrete Floors',
      'Motorized Blackout Screening Panels'
    ],
    energyScore: 'Passivhaus Studio Standard',
    description: 'An uncompromising urban loft for collectors and creators. Industrial concrete and blackened raw steel establish an authentic dialogue with sleek European minimalism, crowned with a private rooftop garden retreat above the vibrant arts epicenter.',
    architecturalNotes: 'Original 1920s reinforced concrete framework paired with contemporary thermally broken custom steel sash windows.',
    images: [
      {
        url: '/images/industrial_arts_loft_1792940944589.webp',
        caption: 'High-ceiling industrial loft with black steel mullions and concrete finishes',
        tag: 'Loft Interior'
      },
      {
        url: '/images/penthouse_terrace_1792939740144.webp',
        caption: 'Planted rooftop terrace with downtown skyline panorama',
        tag: 'Rooftop'
      },
      {
        url: '/images/hero_modern_villa_1792939739344.webp',
        caption: 'Nighttime exterior perspective through floor-to-ceiling industrial glass',
        tag: 'Atmosphere'
      }
    ],
    floorPlans: [
      {
        name: 'Loft Level 1',
        sqft: 1850,
        rooms: ['Great Gallery', 'Stainless Kitchen', 'Dining Area', 'Guest Suite', 'Balcony'],
        dimensions: '42ft x 44ft'
      },
      {
        name: 'Mezzanine Studio Level',
        sqft: 800,
        rooms: ['Primary Loft Bedroom', 'Spa Bathroom', 'Dressing Suite', 'Work Atelier'],
        dimensions: '28ft x 30ft'
      }
    ],
    agent: PRIMARY_AGENT
  },
  {
    id: 'prop-6',
    title: 'The Highland Park Scandinavian Villa',
    tagline: 'Minimalist Nordic aesthetics, organic cedar louvers & mountain backdrop',
    status: 'coming_soon',
    statusLabel: 'Coming Soon',
    propertyType: 'Townhome',
    featured: false,
    location: {
      address: '5420 Monte Vista Street',
      neighborhood: 'Highland Park',
      city: 'Los Angeles',
      state: 'CA',
      zip: '90042',
      lat: 34.115,
      lng: -118.192,
      mapX: 74,
      mapY: 18,
      walkScore: 88,
      transitScore: 72,
      schoolRating: '9/10'
    },
    specs: {
      beds: 3,
      baths: 3,
      sqft: 2890,
      lotSizeSqft: 6500,
      yearBuilt: 2024,
      garageSpaces: 2,
      stories: 3,
      architect: 'Nordic Light Studio',
      ceilingHeightFt: 11
    },
    financials: {
      price: 1980000,
      estMonthlyMortgage: 10150,
      propertyTaxAnnual: 22770,
      hoaDuesMonthly: 310,
      homeInsuranceAnnual: 3900,
      pricePerSqft: 685
    },
    features: [
      'Nordic Light Pine & Ash Millwork',
      'Private Zen Courtyard with Cedar Hot Tub',
      'Passive Solar Vertical Louver Shading',
      'Induction Culinary Island & Pantry',
      'Tri-Level Skylit Light Shaft Staircase',
      'EV Ready 2-Car Garage with Storage',
      'Daikin Multi-Zone Variable Heat Pumps',
      'Permeable Cobblestone Driveway'
    ],
    energyScore: 'Tier A+ Net Positive',
    description: 'Sublime Scandinavian minimalism meets Californian indoor-outdoor harmony. Clad in vertical blackened pine with natural cedar highlights, every room was engineered around natural morning light and curated views of the San Gabriel mountains.',
    architecturalNotes: 'Timber frame sustainably sourced with FSC-certified cedar and zero-VOC mineral silicate paint finishes throughout.',
    images: [
      {
        url: '/images/nordic_scandinavian_villa_1792940944628.webp',
        caption: 'Scandinavian timber villa enveloped in old-growth pine trees at twilight',
        tag: 'Facade'
      },
      {
        url: '/images/modernist_atrium_1792940943369.webp',
        caption: 'Minimalist courtyard opening to private natural garden',
        tag: 'Courtyard'
      },
      {
        url: '/images/villa_living_room_1792939739632.webp',
        caption: 'Minimalist living area with custom oak cabinetry and fireplace',
        tag: 'Living Space'
      }
    ],
    floorPlans: [
      {
        name: 'Tri-Level Living Plan',
        sqft: 2890,
        rooms: ['Garden Suite', 'Open Concept Salon', 'Primary Suite', 'Sky Office', 'Courtyard'],
        dimensions: '32ft x 36ft (x3)'
      }
    ],
    agent: PRIMARY_AGENT
  },
  {
    id: 'prop-7',
    title: 'The Carmel Pinecrest Forest Retreat',
    tagline: 'Architectural compound nestled in Monterey pines with private glass wellness spa',
    status: 'available',
    statusLabel: 'Available Now',
    propertyType: 'Modernist Estate',
    featured: false,
    location: {
      address: '26400 Scenic Road',
      neighborhood: 'Carmel Point',
      city: 'Carmel-by-the-Sea',
      state: 'CA',
      zip: '93923',
      lat: 36.545,
      lng: -121.928,
      mapX: 20,
      mapY: 72,
      walkScore: 74,
      transitScore: 45,
      schoolRating: '10/10'
    },
    specs: {
      beds: 4,
      baths: 4.5,
      sqft: 4600,
      lotSizeSqft: 31200,
      yearBuilt: 2023,
      garageSpaces: 3,
      stories: 1,
      architect: 'Olson Kundig Studio',
      ceilingHeightFt: 15
    },
    financials: {
      price: 6750000,
      estMonthlyMortgage: 34600,
      propertyTaxAnnual: 77625,
      hoaDuesMonthly: 150,
      homeInsuranceAnnual: 14200,
      pricePerSqft: 1467
    },
    features: [
      'Glass-Enclosed Heated Mineral Plunge Pool',
      'Hand-Quarried Carmel Stone Walls',
      'Turn-Crank Hand-Operated Glazed Walls',
      'Bespoke Cast Bronze Door Hardware',
      'Forest Canopy Yoga Pavilion',
      'Radiant Heated Basalt Stone Flooring',
      'Bespoke Fire Pit with Ocean Whispers',
      'Subterranean 1200-Bottle Cellar'
    ],
    energyScore: 'Passivhaus Gold',
    description: 'A discreet sanctuary immersed in old-growth Monterey pines just steps from Carmel Beach. Olson Kundig-inspired kinetic iron hardware allows walls of glass to swing open effortlessly, erasing any distinction between the curated interiors and the whispering forest.',
    architecturalNotes: 'Low-slung single-story profile respects coastal view sheds while preserving every native coastal tree on the 0.7-acre parcel.',
    images: [
      {
        url: '/images/nordic_scandinavian_villa_1792940944628.webp',
        caption: 'Low-slung forest sanctuary illuminated among towering pines',
        tag: 'Exterior'
      },
      {
        url: '/images/villa_living_room_1792939739632.webp',
        caption: 'Living room with floor-to-ceiling forest glass and travertine fireplace',
        tag: 'Living Space'
      },
      {
        url: '/images/modernist_atrium_1792940943369.webp',
        caption: 'Travertine reflecting pool and courtyard terrace',
        tag: 'Patio'
      }
    ],
    floorPlans: [
      {
        name: 'Single Level Forest Pavilion',
        sqft: 4600,
        rooms: ['Great Hearth Room', 'Chef Kitchen', 'Primary Forest Suite', '3 Guest Wings', 'Wellness Spa'],
        dimensions: '88ft x 48ft'
      }
    ],
    agent: SECONDARY_AGENT
  },
  {
    id: 'prop-8',
    title: 'The Bel-Air Promontory Estate',
    tagline: 'Ultra-luxury modern estate with 100ft infinity pool, tennis court & screening room',
    status: 'new_listing',
    statusLabel: 'New Listing',
    propertyType: 'Villa',
    featured: true,
    location: {
      address: '10771 Bellagio Road',
      neighborhood: 'Bel-Air',
      city: 'Los Angeles',
      state: 'CA',
      zip: '90077',
      lat: 34.083,
      lng: -118.442,
      mapX: 48,
      mapY: 42,
      walkScore: 50,
      transitScore: 35,
      schoolRating: '10/10'
    },
    specs: {
      beds: 7,
      baths: 9,
      sqft: 11200,
      lotSizeSqft: 65340,
      yearBuilt: 2024,
      garageSpaces: 6,
      stories: 2,
      architect: 'SAOTA Architecture',
      ceilingHeightFt: 16
    },
    financials: {
      price: 14500000,
      estMonthlyMortgage: 74350,
      propertyTaxAnnual: 166750,
      hoaDuesMonthly: 950,
      homeInsuranceAnnual: 28500,
      pricePerSqft: 1294
    },
    features: [
      '100ft Cantilevered Infinity Edge Pool',
      'Regulation Championship Tennis Court',
      '18-Seat Dolby Atmos Cinema Suite',
      'Subterranean 6-Vehicle Auto Gallery',
      'Commercial Prep Kitchen + Show Kitchen',
      'Full Spa Suite with Hammam & Sauna',
      'Smart Creston 4K Home Automation',
      'Security Gatehouse with Guard Quarters'
    ],
    energyScore: 'Tier A Green Tech',
    description: 'An architectural statement without equal in upper Bel-Air. Positioned on an ultra-rare 1.5-acre promontory, this estate commands city-to-ocean perspectives. From the 100ft infinity edge pool to the museum-grade car gallery, every detail represents the pinnacle of Californian luxury.',
    architecturalNotes: 'Deep cantilevered roof planes provide natural shading during zenith sun while framing endless Southern California horizons.',
    images: [
      {
        url: '/images/hero_modern_villa_1792939739344.webp',
        caption: 'Promontory dusk perspective with 100ft lit infinity reflection pool',
        tag: 'Estate View'
      },
      {
        url: '/images/coastal_bluff_estate_1792940942729.webp',
        caption: 'Cantilevered promontory decks overlooking city-to-sea horizons',
        tag: 'Sky Terrace'
      },
      {
        url: '/images/industrial_arts_loft_1792940944589.webp',
        caption: 'Grand reception salon with double-height volume and luxury fixtures',
        tag: 'Reception Salon'
      }
    ],
    floorPlans: [
      {
        name: 'Main Entertainment Level',
        sqft: 6800,
        rooms: ['Grand Salon', 'Show Kitchen', 'Chef Prep Lab', 'Dining Pavilion', 'Auto Gallery', 'Terrace'],
        dimensions: '95ft x 75ft'
      },
      {
        name: 'Upper Residence & Wellness Wing',
        sqft: 4400,
        rooms: ['Primary Presidential Wing', '5 Guest Suites', 'Wellness Hammam', 'Screening Theater'],
        dimensions: '82ft x 55ft'
      }
    ],
    agent: PRIMARY_AGENT,
    virtualTourUrl: 'https://example.com/virtual-tour/bel-air-promontory'
  }
];
