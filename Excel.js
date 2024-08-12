const ExcelJS = require('exceljs');

async function processExcelFile(filePath) {
    const workbook = new ExcelJS.Workbook();
    await workbook.xlsx.readFile(filePath);
    const worksheet = workbook.getWorksheet(1); // Lấy sheet đầu tiên

    let rowBuffer = [];
    const batchSize = 100;

    worksheet.eachRow((row, rowNumber) => {
        rowBuffer.push(row.values);

        if (rowBuffer.length === batchSize) {
            // Xử lý nhóm 100 dòng
            processBatch(rowBuffer);
            rowBuffer = []; // Xóa bộ đệm sau khi xử lý
        }
    });

    // Xử lý bất kỳ dòng nào còn lại chưa được xử lý
    if (rowBuffer.length > 0) {
        processBatch(rowBuffer);
    }

    console.log('File processed successfully.');
}

function processBatch(rows) {
    // Hàm xử lý dữ liệu theo từng lô 100 dòng
    console.log(`Processing ${rows.length} rows...`);
    // Xử lý dữ liệu ở đây
    // Ví dụ: in ra các giá trị trong từng dòng
    rows.forEach((row, index) => {
        console.log(`Row ${index + 1}: ${row}`);
    });
}

// Đường dẫn tới file Excel
const filePath = 'path/to/your/excel/file.xlsx';

processExcelFile(filePath).catch(err => console.error(err));
