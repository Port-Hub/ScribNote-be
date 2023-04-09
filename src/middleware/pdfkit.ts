import { createWriteStream } from 'fs';
import pdfkit = require('pdfkit');

const createPdf: (content: string) => string = (content) => {
    const path: string = "public\\notes\\Notes-"+Date.now()+".pdf";
    const doc: PDFKit.PDFDocument = new pdfkit();
    doc.pipe(createWriteStream(path));
    doc.text(content);
    doc.end();
    return path;
}

export default createPdf;