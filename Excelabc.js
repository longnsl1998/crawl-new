import { Injectable } from '@nestjs/common';
import * as ExcelJS from 'exceljs';
import * as fs from 'fs';

@Injectable()
export class ExcelMergeService {
  async mergeExcelFiles(file1Path: string, file2Path: string, outputPath: string) {
    const workbook1 = new ExcelJS.Workbook();
    const workbook2 = new ExcelJS.Workbook();
    await workbook1.xlsx.readFile(file1Path);
    await workbook2.xlsx.readFile(file2Path);

    const newWorkbook = new ExcelJS.Workbook();

    // Giả sử ta muốn gộp các sheet tương ứng hoặc gộp dữ liệu từ 2 file vào 1 sheet.
    // Ở đây, đơn giản lấy sheet1 từ file1, sheet1 từ file2, gộp vào một sheet mới tên "Merged"
    const newSheet = newWorkbook.addWorksheet('Merged');

    // Lấy sheet đầu tiên từ mỗi workbook
    const sheet1 = workbook1.getWorksheet(1);
    const sheet2 = workbook2.getWorksheet(1);

    // Sao chép dữ liệu từ sheet1
    sheet1.eachRow((row, rowNumber) => {
      const newRow = newSheet.getRow(rowNumber);
      row.eachCell((cell, colNumber) => {
        newRow.getCell(colNumber).value = cell.value;
        // Sao chép style nếu cần thiết
        newRow.getCell(colNumber).style = { ...cell.style };
      });
    });

    // Xác định điểm bắt đầu nối sheet2. Ví dụ nối ngay sau sheet1
    const startRowForSheet2 = sheet1.rowCount + 2;

    sheet2.eachRow((row, rowNumber) => {
      const newRow = newSheet.getRow(startRowForSheet2 + rowNumber - 1);
      row.eachCell((cell, colNumber) => {
        newRow.getCell(colNumber).value = cell.value;
        newRow.getCell(colNumber).style = { ...cell.style };
      });
    });

    // Tiếp theo là phần xử lý ảnh.
    // ExcelJS cho phép thêm ảnh bằng addImage:
    // const imageId = newWorkbook.addImage({
    //   base64: 'data:image/png;base64,...',
    //   extension: 'png',
    // });
    // newSheet.addImage(imageId, 'A1:D5'); // ví dụ

    // Tuy nhiên, để lấy ảnh từ workbook cũ:
    // Nếu workbook cũ có ảnh, ExcelJS v4+ có thể lưu thông tin media trong workbook.model.media.
    // Bạn có thể duyệt workbook1.model.media và workbook2.model.media để lấy buffer ảnh:
    // Pseudocode:
    // for (const media of workbook1.model.media) {
    //   if (media.type === 'image') {
    //     const imageId = newWorkbook.addImage({
    //       buffer: media.buffer,
    //       extension: media.extension
    //     });
    //     // Cần biết vị trí ảnh trong sheet cũ. Thông tin này nằm trong workbook1.model
    //     // Mỗi image có `range` hoặc `anchor`, cần dò vị trí cũ để đặt vào newSheet tương ứng.
    //     // Giả sử đã biết range, ta đặt lại:
    //     newSheet.addImage(imageId, {
    //       tl: { col: 0, row: 0 },
    //       br: { col: 3, row: 3 }
    //     });
    //   }
    // }

    // Tương tự cho workbook2.

    await newWorkbook.xlsx.writeFile(outputPath);
  }
}
