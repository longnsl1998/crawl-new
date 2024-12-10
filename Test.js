import { Injectable } from '@nestjs/common';
import * as ExcelJS from 'exceljs';
import * as fs from 'fs';

@Injectable()
export class ExcelMergeService {
  async mergeWithImages(file1Path: string, file2Path: string, outputPath: string) {
    const workbook1 = new ExcelJS.Workbook();
    const workbook2 = new ExcelJS.Workbook();
    await workbook1.xlsx.readFile(file1Path);
    await workbook2.xlsx.readFile(file2Path);

    const newWorkbook = new ExcelJS.Workbook();
    const newSheet = newWorkbook.addWorksheet('Merged');

    const sheet1 = workbook1.getWorksheet(1);
    const sheet2 = workbook2.getWorksheet(1);

    // Sao chép dữ liệu từ sheet1
    sheet1.eachRow((row, rowNumber) => {
      const newRow = newSheet.getRow(rowNumber);
      row.eachCell((cell, colNumber) => {
        newRow.getCell(colNumber).value = cell.value;
        newRow.getCell(colNumber).style = { ...cell.style };
      });
    });

    // Nối sheet2 vào sau sheet1
    const startRowForSheet2 = sheet1.rowCount + 2;
    sheet2.eachRow((row, rowNumber) => {
      const newRow = newSheet.getRow(startRowForSheet2 + rowNumber - 1);
      row.eachCell((cell, colNumber) => {
        newRow.getCell(colNumber).value = cell.value;
        newRow.getCell(colNumber).style = { ...cell.style };
      });
    });

    // Sao chép ảnh từ sheet1
    for (const { imageId, range } of sheet1.getImages()) {
      const oldImage = workbook1.getImage(imageId);
      // Tạo ảnh mới trong newWorkbook
      const newImageId = newWorkbook.addImage({
        buffer: oldImage.buffer,
        extension: oldImage.extension
      });
      // Thêm ảnh vào sheet mới, cùng vị trí như sheet cũ
      newSheet.addImage(newImageId, range);
    }

    // Sao chép ảnh từ sheet2
    // Lưu ý vị trí ảnh sẽ bị lệch nếu sheet2 được nối sau sheet1.
    // Bạn cần chỉnh `range` (tl, br) theo offset nếu muốn đặt ảnh đúng vị trí tương đối.
    for (const { imageId, range } of sheet2.getImages()) {
      const oldImage = workbook2.getImage(imageId);
      const newImageId = newWorkbook.addImage({
        buffer: oldImage.buffer,
        extension: oldImage.extension
      });

      // Điều chỉnh vị trí ảnh cho sheet2 nếu cần. Ví dụ: dịch xuống startRowForSheet2 - 1 hàng.
      // Nếu range là { tl: { col, row }, br: { col, row } }, ta cộng thêm offset vào row:
      const adjustedRange = {
        tl: { col: range.tl.col, row: range.tl.row + (startRowForSheet2 - 1) },
        br: { col: range.br.col, row: range.br.row + (startRowForSheet2 - 1) }
      };

      newSheet.addImage(newImageId, adjustedRange);
    }

    await newWorkbook.xlsx.writeFile(outputPath);
  }
}
