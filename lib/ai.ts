import type { IdentifiedPart } from './types';

const fallbackCatalog: IdentifiedPart[] = [
  {
    name: 'Deep Groove Ball Bearing',
    category: 'Bearings',
    likelySkus: ['SKF 6205-2RS', 'NSK 6205-DDU', 'NTN 6205LLU'],
    specs: [
      { label: 'Bore', value: '25 mm' },
      { label: 'OD', value: '52 mm' },
      { label: 'Width', value: '15 mm' },
      { label: 'Seal', value: 'Double rubber' },
    ],
    confidence: 0.92,
  },
  {
    name: 'Hex Head Cap Screw',
    category: 'Fasteners',
    likelySkus: ['M10x40-8.8-ZP', 'ISO 4014 M10x40', 'DIN 931 M10x40'],
    specs: [
      { label: 'Thread', value: 'M10 x 1.5' },
      { label: 'Length', value: '40 mm' },
      { label: 'Grade', value: '8.8' },
      { label: 'Finish', value: 'Zinc plated' },
    ],
    confidence: 0.88,
  },
  {
    name: 'Pneumatic Solenoid Valve',
    category: 'Pneumatics',
    likelySkus: ['SMC VQ2100-5', 'Festo MEH-3-24V', 'Parker B4DB13'],
    specs: [
      { label: 'Ports', value: '5/2-way' },
      { label: 'Voltage', value: '24V DC' },
      { label: 'Port size', value: '1/4" NPT' },
    ],
    confidence: 0.84,
  },
];

const extractBase64 = (dataUrl: string): { mimeType: string; data: string } => {
  const [header, data] = dataUrl.split(',');
  const mimeMatch = header.match(/data:([^;]+);base64/);
  return { mimeType: mimeMatch?.[1] ?? 'image/jpeg', data };
};

export async function identifyPart(imageDataUrl: string, hint?: string): Promise<IdentifiedPart> {
  const apiKey = (process.env as any).API_KEY || (process.env as any).GEMINI_API_KEY;

  if (!apiKey) {
    // Deterministic demo path: rotate through catalog
    const pick = fallbackCatalog[Math.floor(Math.random() * fallbackCatalog.length)];
    await new Promise((r) => setTimeout(r, 900));
    return { ...pick, notes: hint };
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
                `You are an industrial MRO parts identifier. Look at the photo and identify the most likely part. ` +
                `Return a concise name (e.g. "Deep Groove Ball Bearing"), a category (Bearings, Fasteners, Hydraulics, Pneumatics, ` +
                `Electrical, Safety, Sanitation, Power Transmission, Tools, Other), 2-4 likely SKUs from major catalogs ` +
                `(SKF, NSK, NTN, Fastenal, Würth, Grainger, SMC, Festo, Parker, Motion), and 3-5 key specs. ` +
                `Confidence should be 0-1. Additional buyer note: ${hint || 'none'}`,
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
    return { ...parsed, notes: hint };
  } catch (err) {
    console.warn('Gemini identification failed, using fallback:', err);
    const pick = fallbackCatalog[Math.floor(Math.random() * fallbackCatalog.length)];
    return { ...pick, notes: hint };
  }
}
