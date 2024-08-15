const ExcelJS = require('exceljs');
const fetch = require('node-fetch');
const fs = require('fs');
const path = require('path');

async function downloadImage(url, filepath) {
  const response = await fetch(url);
  const buffer = await response.buffer();
  fs.writeFileSync(filepath, buffer);
}

async function createExcelReport(data) {
  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet('Report');

  // Merge cells for the top header
  worksheet.mergeCells('B1:C1');
  worksheet.mergeCells('B2:B3');
  worksheet.mergeCells('C2:C3');

  worksheet.mergeCells('D2:F2');
  
  // Format cells
  worksheet.getCell('B1').value = 'Report';
  worksheet.getCell('B1').alignment = { horizontal: 'center', vertical: 'middle' };

  // Add header text
  worksheet.getCell('B2').value = data.input.row_images['C Minh_selfie.png'];
  worksheet.getCell('C2').value = data.input.col_images['5c9598a4-ab42-498b-bb4d-88620a5dbc8a.jfif'];

  // Download images
  const rowImageFile = path.join(__dirname, 'C_Minh_selfie.png');
  const colImageFile = path.join(__dirname, '5c9598a4-ab42-498b-bb4d-88620a5dbc8a.jfif');
  await downloadImage(data.input.row_images['C Minh_selfie.png'], rowImageFile);
  await downloadImage(data.input.col_images['5c9598a4-ab42-498b-bb4d-88620a5dbc8a.jfif'], colImageFile);

  // Add images to cells
  const rowImageId = workbook.addImage({
    filename: rowImageFile,
    extension: 'png',
  });
  const colImageId = workbook.addImage({
    filename: colImageFile,
    extension: 'jpeg',
  });

  worksheet.addImage(rowImageId, 'B2:B3');
  worksheet.addImage(colImageId, 'C2:C3');

  // Add result value and style
  worksheet.mergeCells('D3:F3');
  worksheet.getCell('D3').value = `${(data.output.data.result[0][0] * 100).toFixed(2)} %`;
  worksheet.getCell('D3').alignment = { horizontal: 'center', vertical: 'middle' };
  worksheet.getCell('D3').fill = {
    type: 'pattern',
    pattern: 'solid',
    fgColor: { argb: 'FFFF0000' }, // Red background
  };
  worksheet.getCell('D3').font = {
    color: { argb: 'FFFFFFFF' }, // White text
    bold: true,
    size: 14,
  };

  // Save workbook to file
  await workbook.xlsx.writeFile('Report.xlsx');

  console.log('Excel report created successfully!');
}

// Sample input data
const inputData = {
  "input": {
    "col_images": {
      "5c9598a4-ab42-498b-bb4d-88620a5dbc8a.jfif": "http://10.32.59.246/api/customer/face-check/14-08-2024/20240814_133048_5c9598a4-ab42-498b-bb4d-88620a5dbc8a.jfif"
    },
    "row_images": {
      "C Minh_selfie.png": "http://10.32.59.246/api/customer/face-check/14-08-2024/20240814_133048_C_Minh_selfie.png"
    }
  },
  "output": {
    "code": "KYC-00000",
    "data": {
      "label": [["FAIL"]],
      "cosine": [[0.10184450447559357]],
      "result": [[0.11]],
      "duration": {
        "extract": 0.65,
        "preprocess": 0.53
      },
      "exception": {},
      "col_header": ["5c9598a4-ab42-498b-bb4d-88620a5dbc8a.jfif"],
      "image_type": {
        "col": ["SELFIE"],
        "row": ["SELFIE"]
      },
      "request_id": "FACE-CHECK-768e010f-ec63-448c-ad15-f247087adda6",
      "row_header": ["C Minh_selfie.png"],
      "thresholds": [0.6, 0.8],
      "total_time": 1.18
    }
  }
};

createExcelReport(inputData);
        
