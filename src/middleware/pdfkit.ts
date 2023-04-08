import { createWriteStream } from 'fs';
import pdfkit = require('pdfkit');

const createPdf = (content: string) => {
    const path = "public\\notes\\Notes-"+Date.now()+".pdf";
    const doc = new pdfkit();
    doc.pipe(createWriteStream(path));
    doc.text(content);
    doc.end();
    return path;
}

export default createPdf;