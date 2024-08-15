const ExcelJS = require('exceljs');

async function createExcelWithMergedHeaders() {
  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet('Sheet1');

  // Tạo header hàng 1
  worksheet.mergeCells('B1:E1');
  worksheet.getCell('B1').value = 'Thông tin tại BO';
  worksheet.getCell('B1').alignment = { horizontal: 'center', vertical: 'middle' };
  
  worksheet.mergeCells('F1:H1');
  worksheet.getCell('F1').value = 'Thông tin tại VSDC';
  worksheet.getCell('F1').alignment = { horizontal: 'center', vertical: 'middle' };

  // Tạo header hàng 2
  worksheet.getCell('A2').value = 'TKCK';
  worksheet.getCell('B2').value = 'Họ và tên KH';
  worksheet.getCell('C2').value = 'Số CMND/CCCD';
  worksheet.getCell('D2').value = 'Ngày cấp';
  worksheet.getCell('E2').value = 'Phòng ban';

  worksheet.getCell('F2').value = 'Họ và tên KH';
  worksheet.getCell('G2').value = 'Số CMND/CCCD';
  worksheet.getCell('H2').value = 'Ngày cấp';

  // Định dạng cột
  worksheet.columns = [
    { key: 'A', width: 10 },
    { key: 'B', width: 20 },
    { key: 'C', width: 20 },
    { key: 'D', width: 15 },
    { key: 'E', width: 15 },
    { key: 'F', width: 20 },
    { key: 'G', width: 20 },
    { key: 'H', width: 15 }
  ];

  // Lưu file
  await workbook.xlsx.writeFile('MergedHeaderExcel.xlsx');
  console.log('Excel file created successfully!');
}

createExcelWithMergedHeaders();
