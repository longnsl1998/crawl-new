from PIL import Image, ImageFilter
import numpy as np

def increase_image_size(input_image_path, output_image_path, target_size_mb=50):
    # Mở ảnh gốc
    img = Image.open(input_image_path)

    # Tăng kích thước ảnh (upsampling)
    width, height = img.size
    scale_factor = 10  # Tăng kích thước ảnh lên 10 lần
    new_size = (width * scale_factor, height * scale_factor)
    img = img.resize(new_size, Image.LANCZOS)

    # Thêm nhiễu (noise) vào ảnh để tăng dung lượng tệp
    noise = np.random.randint(0, 50, (new_size[1], new_size[0], 3), dtype=np.uint8)
    img_array = np.array(img)
    img_array = np.clip(img_array + noise, 0, 255)
    img = Image.fromarray(img_array.astype('uint8'))

    # Lưu ảnh dưới dạng PNG không nén để tăng kích thước tệp
    img.save(output_image_path, format='PNG')

    # Kiểm tra kích thước tệp đầu ra
    output_size_mb = (output_image_path.stat().st_size / (1024 * 1024))
    print(f"Kích thước tệp đầu ra: {output_size_mb:.2f} MB")

    # Lặp lại việc thêm dữ liệu hoặc thay đổi độ nén cho đến khi đạt kích thước mong muốn
    while output_size_mb < target_size_mb:
        # Tiếp tục thêm nhiễu và lưu lại
        img_array = np.array(img)
        noise = np.random.randint(0, 50, img_array.shape, dtype=np.uint8)
        img_array = np.clip(img_array + noise, 0, 255)
        img = Image.fromarray(img_array.astype('uint8'))
        
        # Lưu lại ảnh
        img.save(output_image_path, format='PNG')

        # Cập nhật kích thước tệp
        output_size_mb = (output_image_path.stat().st_size / (1024 * 1024))
        print(f"Kích thước tệp hiện tại: {output_size_mb:.2f} MB")

# Đường dẫn tới ảnh gốc và tệp đầu ra
input_image_path = 'your_small_image.jpg'
output_image_path = 'output_large_image.png'

# Gọi hàm để tạo ảnh
increase_image_size(input_image_path, output_image_path)
