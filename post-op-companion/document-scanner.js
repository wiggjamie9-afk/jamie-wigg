// Document scanning and OCR mock
class DocumentScanner {
  constructor() {
    this.documents = [];
  }

  async scanDocument(file) {
    try {
      console.log('Scanning document:', file.name);

      // In production, use:
      // - Google Vision API for OCR
      // - PDFKit for PDF extraction
      // - AWS Textract for medical documents

      // For now, return mock structure
      return {
        type: file.type.includes('pdf') ? 'pdf' : 'image',
        name: file.name,
        content: 'Document content would be extracted here',
        extractedLabValues: {
          protein: '6.5 g/dL',
          iron: '45 µg/dL',
          b12: '450 pg/mL',
          calcium: '8.5 mg/dL',
          albumin: '3.8 g/dL',
        },
        confidence: 0.85,
      };
    } catch (err) {
      console.error('Document scan failed:', err);
      return null;
    }
  }

  extractLabValues(ocrText) {
    // Parse OCR'd text for lab values
    const labPattern = {
      protein: /Protein[:\s]+(\d+\.?\d*)/i,
      iron: /Iron[:\s]+(\d+\.?\d*)/i,
      b12: /B12[:\s]+(\d+\.?\d*)/i,
      calcium: /Calcium[:\s]+(\d+\.?\d*)/i,
    };

    const values = {};
    Object.entries(labPattern).forEach(([key, pattern]) => {
      const match = ocrText.match(pattern);
      if (match) values[key] = match[1];
    });

    return values;
  }
}

const documentScanner = new DocumentScanner();
