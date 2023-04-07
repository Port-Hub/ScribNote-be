import pdfkit = require('pdfkit');
import * as fs from 'fs';

const createPdf = (content: string) => {
    const path = "public\\notes\\Notes-"+Date.now()+".pdf";
    const doc = new pdfkit();
    doc.pipe(fs.createWriteStream(path));
    doc.text(content);
    doc.end();
    return path;
}

export default createPdf;