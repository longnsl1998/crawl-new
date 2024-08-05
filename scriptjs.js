const fs = require('fs');
const csv = require('csv-parser');
const Minio = require('minio');
const { PDFDocument } = require('pdf-lib');

// MinIO configuration
const minioClient = new Minio.Client({
  endPoint: 'YOUR_MINIO_ENDPOINT',
  port: YOUR_MINIO_PORT,
  useSSL: false, // or true if using https
  accessKey: 'YOUR_MINIO_ACCESS_KEY',
  secretKey: 'YOUR_MINIO_SECRET_KEY'
});

// Read CSV and process each row
fs.createReadStream('input.csv')
  .pipe(csv())
  .on('data', async (row) => {
    const { code, path, from_page, to_page, type } = row;
    
    try {
      // Download the PDF file from MinIO
      const filePath = `temp/${code}.pdf`;
      await downloadFileFromMinio(path, filePath);

      // Split the PDF file
      await splitPdf(filePath, parseInt(from_page), parseInt(to_page), `output/${code}_split.pdf`);
      
      console.log(`Processed: ${code}`);
    } catch (error) {
      console.error(`Failed to process ${code}:`, error);
    }
  })
  .on('end', () => {
    console.log('CSV file successfully processed');
  });

// Function to download file from MinIO
function downloadFileFromMinio(minioPath, downloadPath) {
  return new Promise((resolve, reject) => {
    const stream = minioClient.getObject('YOUR_BUCKET_NAME', minioPath, (err, dataStream) => {
      if (err) {
        return reject(err);
      }

      const file = fs.createWriteStream(downloadPath);
      dataStream.pipe(file);

      file.on('finish', resolve);
      file.on('error', reject);
    });
  });
}

// Function to split PDF
async function splitPdf(inputPath, fromPage, toPage, outputPath) {
  const existingPdfBytes = fs.readFileSync(inputPath);
  const pdfDoc = await PDFDocument.load(existingPdfBytes);
  
  const newPdfDoc = await PDFDocument.create();
  const copiedPages = await newPdfDoc.copyPages(pdfDoc, Array.from({length: toPage - fromPage + 1}, (_, i) => fromPage - 1 + i));
  
  copiedPages.forEach((page) => {
    newPdfDoc.addPage(page);
  });

  const pdfBytes = await newPdfDoc.save();
  fs.writeFileSync(outputPath, pdfBytes);
}
