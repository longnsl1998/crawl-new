const ExcelJS = require('exceljs');
const fs = require('fs');

async function createExcelWithBinaryImage() {
    // Tạo một workbook và worksheet mới
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Sheet 1');

    // Đọc ảnh dưới dạng nhị phân
    const imageBuffer = fs.readFileSync('path/to/your/image.png');

    // Thêm ảnh vào workbook dưới dạng binary
    const imageId = workbook.addImage({
        buffer: imageBuffer, // Binary buffer
        extension: 'png',    // Định dạng ảnh
    });

    // Chèn ảnh vào ô (ví dụ: A1)
    worksheet.addImage(imageId, {
        tl: { col: 0, row: 0 }, // Top-left
        ext: { width: 200, height: 200 }, // Kích thước ảnh (tính bằng pixel)
    });

    // Lưu workbook vào file
    await workbook.xlsx.writeFile('output_with_binary_image.xlsx');
    console.log('File Excel đã được tạo thành công với ảnh nhị phân!');
}

createExcelWithBinaryImage();
