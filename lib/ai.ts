import type { IdentifiedPart } from './types';

export type AiStatus = 'live' | 'demo' | 'error';
export interface IdentificationResult {
  part: IdentifiedPart;
  status: AiStatus;
  message?: string;
}

// Richer catalog grouped for deterministic matching.
interface CatalogEntry extends IdentifiedPart {
  colorBias?: 'metallic' | 'dark' | 'bright' | 'any';
  aspectBias?: 'tall' | 'wide' | 'square';
}

const CATALOG: CatalogEntry[] = [
  // Bearings
  { name: 'Deep Groove Ball Bearing 25mm', category: 'Bearings',
    likelySkus: ['SKF 6205-2RS', 'NSK 6205-DDU', 'NTN 6205LLU'],
    specs: [{ label: 'Bore', value: '25 mm' }, { label: 'OD', value: '52 mm' }, { label: 'Width', value: '15 mm' }, { label: 'Seal', value: 'Double rubber' }],
    confidence: 0.93, colorBias: 'metallic', aspectBias: 'square' },
  { name: 'Tapered Roller Bearing', category: 'Bearings',
    likelySkus: ['SKF 32208', 'Timken 32208', 'NSK HR32208J'],
    specs: [{ label: 'Bore', value: '40 mm' }, { label: 'OD', value: '80 mm' }, { label: 'Width', value: '24.75 mm' }],
    confidence: 0.9, colorBias: 'metallic', aspectBias: 'square' },
  { name: 'Pillow Block Bearing', category: 'Bearings',
    likelySkus: ['SKF SY 30 TF', 'Dodge P2B-GT-30M', 'Sealmaster NP-30'],
    specs: [{ label: 'Bore', value: '30 mm' }, { label: 'Mount', value: '2-bolt' }, { label: 'Housing', value: 'Cast iron' }],
    confidence: 0.88, colorBias: 'dark' },

  // Fasteners
  { name: 'Hex Head Cap Screw M10x40', category: 'Fasteners',
    likelySkus: ['DIN 931 M10x40-8.8', 'ISO 4014 M10x40', 'ASTM A325 M10x40'],
    specs: [{ label: 'Thread', value: 'M10 x 1.5' }, { label: 'Length', value: '40 mm' }, { label: 'Grade', value: '8.8' }, { label: 'Finish', value: 'Zinc plated' }],
    confidence: 0.91, colorBias: 'metallic', aspectBias: 'tall' },
  { name: 'Socket Head Cap Screw M8x25', category: 'Fasteners',
    likelySkus: ['DIN 912 M8x25-12.9', 'ISO 4762 M8x25', 'Unbrako M8x25'],
    specs: [{ label: 'Thread', value: 'M8 x 1.25' }, { label: 'Length', value: '25 mm' }, { label: 'Grade', value: '12.9' }, { label: 'Drive', value: 'Hex socket' }],
    confidence: 0.89, colorBias: 'dark', aspectBias: 'tall' },
  { name: 'Hex Nut M10', category: 'Fasteners',
    likelySkus: ['DIN 934 M10-8', 'ISO 4032 M10', 'ASTM A563 M10'],
    specs: [{ label: 'Thread', value: 'M10 x 1.5' }, { label: 'Grade', value: '8' }, { label: 'Finish', value: 'Zinc plated' }],
    confidence: 0.9, colorBias: 'metallic', aspectBias: 'square' },
  { name: 'Flat Washer M10', category: 'Fasteners',
    likelySkus: ['DIN 125 M10-ZP', 'ISO 7089 M10', 'ANSI B18.22.1 M10'],
    specs: [{ label: 'ID', value: '10.5 mm' }, { label: 'OD', value: '20 mm' }, { label: 'Thickness', value: '2 mm' }],
    confidence: 0.87, colorBias: 'metallic', aspectBias: 'square' },

  // Pneumatics / Hydraulics
  { name: 'Pneumatic Solenoid Valve 5/2 24V', category: 'Pneumatics',
    likelySkus: ['SMC VQ2100-5', 'Festo MEH-3-24V', 'Parker B4DB13'],
    specs: [{ label: 'Ports', value: '5/2-way' }, { label: 'Voltage', value: '24V DC' }, { label: 'Port size', value: '1/4" NPT' }],
    confidence: 0.84, colorBias: 'dark' },
  { name: 'Air Cylinder 32mm Bore', category: 'Pneumatics',
    likelySkus: ['SMC CDM2B32-100', 'Festo DNC-32-100', 'Parker P1D-S032'],
    specs: [{ label: 'Bore', value: '32 mm' }, { label: 'Stroke', value: '100 mm' }, { label: 'Rod', value: '12 mm' }],
    confidence: 0.82, colorBias: 'metallic', aspectBias: 'wide' },
  { name: 'Hydraulic Pressure Gauge', category: 'Hydraulics',
    likelySkus: ['Wika 213.53', 'Enerpac G2535L', 'Noshok 25-510'],
    specs: [{ label: 'Range', value: '0-5000 psi' }, { label: 'Dial', value: '2.5"' }, { label: 'Connection', value: '1/4" NPT' }],
    confidence: 0.86, colorBias: 'any', aspectBias: 'square' },
  { name: 'Hydraulic Hose 1/2" x 36"', category: 'Hydraulics',
    likelySkus: ['Parker 421-8 36"', 'Gates 4G-8 36"', 'Eaton H243-08 36"'],
    specs: [{ label: 'ID', value: '1/2"' }, { label: 'Length', value: '36"' }, { label: 'Pressure', value: '4000 psi' }, { label: 'Ends', value: 'JIC 37°' }],
    confidence: 0.85, colorBias: 'dark', aspectBias: 'wide' },

  // Electrical
  { name: 'Optical Safety Sensor', category: 'Electrical',
    likelySkus: ['Banner QS18', 'Sick WL4S', 'Omron E3Z-D61'],
    specs: [{ label: 'Range', value: '0-2 m' }, { label: 'Output', value: 'PNP NO/NC' }, { label: 'Voltage', value: '10-30V DC' }],
    confidence: 0.83, colorBias: 'dark' },
  { name: 'Contactor 3-Pole 25A', category: 'Electrical',
    likelySkus: ['Allen-Bradley 100-C23', 'Siemens 3RT2026', 'Schneider LC1D25'],
    specs: [{ label: 'Current', value: '25 A' }, { label: 'Coil', value: '24V AC' }, { label: 'Poles', value: '3' }],
    confidence: 0.85, colorBias: 'dark' },
  { name: 'Limit Switch Roller Lever', category: 'Electrical',
    likelySkus: ['Honeywell BZE6-2RN', 'Omron WLCA2', 'Schneider XCKJ10541H29'],
    specs: [{ label: 'Contacts', value: 'SPDT' }, { label: 'Action', value: 'Roller lever' }, { label: 'Rating', value: '10 A 250V AC' }],
    confidence: 0.82, colorBias: 'any' },

  // Power Transmission
  { name: 'Roller Chain ANSI 50', category: 'Power Transmission',
    likelySkus: ['Tsubaki 50-1R', 'Diamond 50-1R', 'Rexnord 50-1R'],
    specs: [{ label: 'Pitch', value: '5/8"' }, { label: 'Strand', value: 'Single' }, { label: 'Length', value: '10 ft' }],
    confidence: 0.88, colorBias: 'metallic', aspectBias: 'wide' },
  { name: 'V-Belt A-Section 45"', category: 'Power Transmission',
    likelySkus: ['Gates A45', 'Optibelt A45', 'Dayton 1A45'],
    specs: [{ label: 'Section', value: 'A (1/2")' }, { label: 'Outside length', value: '47"' }, { label: 'Angle', value: '40°' }],
    confidence: 0.86, colorBias: 'dark', aspectBias: 'wide' },
  { name: 'Jaw Coupling L110', category: 'Power Transmission',
    likelySkus: ['Lovejoy L110', 'Martin L110', 'Dodge L110'],
    specs: [{ label: 'Bore A', value: '1.00"' }, { label: 'Bore B', value: '1.00"' }, { label: 'Spider', value: 'NBR' }],
    confidence: 0.84, colorBias: 'metallic', aspectBias: 'square' },

  // Tools
  { name: '1/2" Carbide End Mill 4-Flute', category: 'Tools',
    likelySkus: ['Kennametal KCS10', 'Niagara C820', 'OSG HY-PRO'],
    specs: [{ label: 'Diameter', value: '1/2"' }, { label: 'Flutes', value: '4' }, { label: 'Length', value: '3"' }, { label: 'Coating', value: 'TiAlN' }],
    confidence: 0.83, colorBias: 'metallic', aspectBias: 'tall' },
  { name: 'Digital Caliper 6"', category: 'Tools',
    likelySkus: ['Mitutoyo 500-196-30', 'Starrett 798A-6/150', 'Fowler 54-101-777'],
    specs: [{ label: 'Range', value: '0-6" / 0-150mm' }, { label: 'Resolution', value: '0.0005"' }, { label: 'Accuracy', value: '±0.001"' }],
    confidence: 0.87, colorBias: 'metallic', aspectBias: 'wide' },

  // Safety
  { name: 'Cut-Resistant Glove Level A5', category: 'Safety',
    likelySkus: ['Ansell HyFlex 11-541', 'MCR 9673', 'Showa S-TEX 581'],
    specs: [{ label: 'Level', value: 'ANSI A5' }, { label: 'Coating', value: 'PU palm' }, { label: 'Size', value: 'L' }],
    confidence: 0.82, colorBias: 'bright' },
  { name: 'Safety Glasses Clear Lens', category: 'Safety',
    likelySkus: ['3M SecureFit 400', 'Uvex S1600', 'Pyramex Intruder'],
    specs: [{ label: 'Lens', value: 'Clear anti-fog' }, { label: 'Standard', value: 'ANSI Z87.1' }],
    confidence: 0.81, colorBias: 'bright' },
  { name: 'High-Visibility Vest Class 2', category: 'Safety',
    likelySkus: ['Ergodyne 8210HL', 'Radians SV22', 'Occunomix LUX-SSCLC2Z'],
    specs: [{ label: 'Class', value: 'ANSI Class 2' }, { label: 'Color', value: 'Lime' }, { label: 'Size', value: 'L' }],
    confidence: 0.84, colorBias: 'bright' },

  // Sanitation / Chemicals
  { name: 'Industrial Degreaser 5 gal', category: 'Sanitation',
    likelySkus: ['Simple Green Industrial 13405', 'Zep ZUCIT5', 'Krud Kutter 5GAL'],
    specs: [{ label: 'Size', value: '5 gal' }, { label: 'Type', value: 'Citrus-based' }, { label: 'Biodegradable', value: 'Yes' }],
    confidence: 0.85, colorBias: 'bright', aspectBias: 'tall' },
  { name: 'Threadlocker Blue 50ml', category: 'Sanitation',
    likelySkus: ['Loctite 243', 'Würth WL242', 'Permatex 24240'],
    specs: [{ label: 'Strength', value: 'Medium' }, { label: 'Temp', value: '-55 to 150°C' }, { label: 'Size', value: '50 ml' }],
    confidence: 0.87, colorBias: 'bright' },
  { name: 'Nitrile Disposable Glove', category: 'Sanitation',
    likelySkus: ['Ansell TNT 92-605', 'SAS Raven 66518', 'Microflex MK-296'],
    specs: [{ label: 'Material', value: 'Nitrile' }, { label: 'Thickness', value: '6 mil' }, { label: 'Size', value: 'M' }, { label: 'Pack', value: '100 ct' }],
    confidence: 0.8, colorBias: 'any' },
];

const extractBase64 = (dataUrl: string): { mimeType: string; data: string } => {
  const [header, data] = dataUrl.split(',');
  const mimeMatch = header.match(/data:([^;]+);base64/);
  return { mimeType: mimeMatch?.[1] ?? 'image/jpeg', data };
};

interface ImageFeatures {
  hash: number;
  avgR: number;
  avgG: number;
  avgB: number;
  brightness: number;
  saturation: number;
  aspect: 'tall' | 'wide' | 'square';
  colorBias: 'metallic' | 'dark' | 'bright';
}

async function extractFeatures(dataUrl: string): Promise<ImageFeatures> {
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => {
      const size = 32;
      const canvas = document.createElement('canvas');
      canvas.width = size;
      canvas.height = size;
      const ctx = canvas.getContext('2d');
      if (!ctx) {
        resolve({ hash: 0, avgR: 128, avgG: 128, avgB: 128, brightness: 0.5, saturation: 0, aspect: 'square', colorBias: 'metallic' });
        return;
      }
      ctx.drawImage(img, 0, 0, size, size);
      const data = ctx.getImageData(0, 0, size, size).data;

      let hash = 0;
      let sumR = 0, sumG = 0, sumB = 0;
      let sumSat = 0;
      let pixels = 0;

      for (let i = 0; i < data.length; i += 4) {
        const r = data[i], g = data[i + 1], b = data[i + 2];
        hash = ((hash << 5) - hash + r + g + b) | 0;
        sumR += r; sumG += g; sumB += b;
        const max = Math.max(r, g, b), min = Math.min(r, g, b);
        sumSat += max === 0 ? 0 : (max - min) / max;
        pixels++;
      }

      const avgR = sumR / pixels;
      const avgG = sumG / pixels;
      const avgB = sumB / pixels;
      const brightness = (avgR + avgG + avgB) / (3 * 255);
      const saturation = sumSat / pixels;

      const aspectRatio = img.naturalWidth / img.naturalHeight;
      const aspect: 'tall' | 'wide' | 'square' =
        aspectRatio > 1.3 ? 'wide' : aspectRatio < 0.77 ? 'tall' : 'square';

      let colorBias: 'metallic' | 'dark' | 'bright';
      if (brightness < 0.3) colorBias = 'dark';
      else if (saturation > 0.35 && brightness > 0.5) colorBias = 'bright';
      else colorBias = 'metallic';

      resolve({ hash: Math.abs(hash), avgR, avgG, avgB, brightness, saturation, aspect, colorBias });
    };
    img.onerror = () => resolve({ hash: 0, avgR: 128, avgG: 128, avgB: 128, brightness: 0.5, saturation: 0, aspect: 'square', colorBias: 'metallic' });
    img.src = dataUrl;
  });
}

function pickDeterministic(features: ImageFeatures, hint?: string): IdentifiedPart {
  const hintLower = (hint ?? '').toLowerCase();

  // Candidate pool: prefer color/aspect match, fall back to whole catalog
  let pool = CATALOG.filter((c) => {
    if (c.colorBias && c.colorBias !== 'any' && c.colorBias !== features.colorBias) return false;
    if (c.aspectBias && c.aspectBias !== features.aspect) return false;
    return true;
  });

  if (hintLower) {
    const biased = pool.filter((c) =>
      c.name.toLowerCase().includes(hintLower) ||
      c.category.toLowerCase().includes(hintLower) ||
      c.likelySkus.some((s) => s.toLowerCase().includes(hintLower))
    );
    if (biased.length) pool = biased;
  }

  if (pool.length === 0) pool = CATALOG.filter((c) => !c.colorBias || c.colorBias === 'any' || c.colorBias === features.colorBias);
  if (pool.length === 0) pool = CATALOG;

  const pick = pool[features.hash % pool.length];
  const { colorBias, aspectBias, ...clean } = pick;
  return { ...clean, notes: hint };
}

export async function identifyPart(imageDataUrl: string, hint?: string): Promise<IdentificationResult> {
  const features = await extractFeatures(imageDataUrl);
  const apiKey = (process.env as any).API_KEY || (process.env as any).GEMINI_API_KEY;

  if (!apiKey || apiKey === 'undefined' || apiKey === '') {
    await new Promise((r) => setTimeout(r, 700));
    return {
      part: pickDeterministic(features, hint),
      status: 'demo',
      message: 'Running in demo mode. Set GEMINI_API_KEY in .env.local to enable Gemini 2.5 Flash vision.',
    };
  }

  try {
    const { GoogleGenAI, Type } = await import('@google/genai');
    const ai = new GoogleGenAI({ apiKey });
    const { mimeType, data } = extractBase64(imageDataUrl);

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: [
        {
          role: 'user',
          parts: [
            { inlineData: { mimeType, data } },
            {
              text:
                `You are an industrial MRO parts identifier. Look at this photo carefully and identify the specific part shown. ` +
                `Return a concise name (e.g. "Deep Groove Ball Bearing 25mm"), a category (Bearings, Fasteners, Hydraulics, Pneumatics, ` +
                `Electrical, Safety, Sanitation, Power Transmission, Tools, Other), 2-4 likely SKUs from major catalogs ` +
                `(SKF, NSK, NTN, Timken, Dodge, Fastenal, Würth, Grainger, SMC, Festo, Parker, Motion, Lovejoy, Tsubaki, Gates), and 3-5 key specs. ` +
                `Confidence should be 0-1 reflecting how certain you are. Only identify what you can actually see. ` +
                (hint ? `Additional buyer note: ${hint}` : ''),
            },
          ],
        },
      ],
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            name: { type: Type.STRING },
            category: { type: Type.STRING },
            likelySkus: { type: Type.ARRAY, items: { type: Type.STRING } },
            specs: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  label: { type: Type.STRING },
                  value: { type: Type.STRING },
                },
                required: ['label', 'value'],
              },
            },
            confidence: { type: Type.NUMBER },
          },
          required: ['name', 'category', 'likelySkus', 'specs', 'confidence'],
        },
      },
    });

    const text = response.text || '';
    const parsed = JSON.parse(text) as IdentifiedPart;
    return { part: { ...parsed, notes: hint }, status: 'live' };
  } catch (err) {
    console.warn('Gemini identification failed, using deterministic fallback:', err);
    return {
      part: pickDeterministic(features, hint),
      status: 'error',
      message: `Gemini call failed: ${err instanceof Error ? err.message : 'Unknown error'}. Falling back to demo catalog.`,
    };
  }
}
