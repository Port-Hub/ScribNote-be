import pdfkit = require('pdfkit');
import * as fs from 'fs';

const createPdf = (content: string) => {
    const doc = new pdfkit();
    doc.pipe(fs.createWriteStream('/public/notes/output.pdf'));
    doc.text(content);
    doc.end();
    return doc;
}

export default createPdf;