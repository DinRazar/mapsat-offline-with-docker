# import sys
# import rasterio

# def get_elevation(lat, lng):
#     # Открытие TIF-файла
#     with rasterio.open('tiffs/supertiff2.tif') as src:
#         # Проверка границ растра
#         bounds = src.bounds
#         print(f"Границы растра: {bounds}")  # Отладочная строка

#         # Проверка, находятся ли lat/lng в пределах границ
#         if not (bounds.left <= lng <= bounds.right and bounds.bottom <= lat <= bounds.top):
#             print("Предоставленные широта и долгота выходят за границы растра. Выполнение прекращено.")
#             return  # Прекращаем выполнение функции, если координаты вне границ

#         # Преобразование координат в индексы
#         row, col = src.index(lng, lat)
#         print(f"Строка: {row}, Столбец: {col}")  # Отладочная строка

#         # Чтение значения высоты
#         elevation_array = src.read(1)
        
#         # Проверка, действительны ли индексы строки и столбца
#         if row < 0 or row >= elevation_array.shape[0] or col < 0 or col >= elevation_array.shape[1]:
#             print("Индекс строки или столбца выходит за пределы. Выполнение прекращено.")
#             return  # Прекращаем выполнение функции, если индексы вне границ

#         elevation = elevation_array[row, col]
#         return elevation

# if __name__ == "__main__":
#     latitude = float(sys.argv[1])
#     longitude = float(sys.argv[2])
#     elevation = get_elevation(latitude, longitude)
    
#     if elevation is not None:
#         print(elevation)  # Вывод высоты в стандартный вывод, если значение получено

# import rasterio
# import sys

# def get_elevation_from_geotiff(lat, lng, geotiff_path):
#     with rasterio.open(geotiff_path) as src:
#         # Преобразование координат в индексы пикселей
#         row, col = src.index(lng, lat)  # Используем lng (долгота) и lat (широта)
        
#         # Чтение значения высоты
#         elevation = src.read(1)[row, col]  # Читаем первый слой
#         return elevation

# if __name__ == "__main__":
#     latitude = float(sys.argv[1])  # Широта
#     longitude = float(sys.argv[2])  # Долгота
    
#     # Укажите путь к вашему GeoTIFF файлу
#     geotiff_path = 'tiffs/supertiff2.tif'
    
#     try:
#         elevation = get_elevation_from_geotiff(latitude, longitude, geotiff_path)
#         print(elevation)  # Возвращаем высоту в stdout
#     except Exception as e:
#         print(f"Ошибка при получении высоты: {e}", file=sys.stderr)





# import rasterio

# def get_elevation(geotiff_path, x, y):
#     with rasterio.open(geotiff_path) as dataset:
#         row, col = dataset.index(x, y)

#         # Читаем данные высоты
#         elevation = dataset.read(1) 
#         # Получаем значение высоты по индексам
#         return elevation[row, col]

# geotiff_path = 'C:\\Users\Рабочее место №6\\Desktop\\mapsat-offline-with-docker\\maincode\\tiffs\\supertiff.tif'
# x = 37.712021
# y = 55.774867

# elevation_value = get_elevation(geotiff_path, x, y)
# print(f'Высота в точке ({x}, {y}): {elevation_value}')

import rasterio
import sys

def get_elevation_from_geotiff(lat, lng, geotiff_path):
    with rasterio.open(geotiff_path) as src:
        # Получаем границы GeoTIFF файла
        bounds = src.bounds
        
        # Проверяем, попадают ли координаты в границы
        if not (bounds.left <= lng <= bounds.right and bounds.bottom <= lat <= bounds.top):
            # print("Координаты не попадают в область GeoTIFF файла.", file=sys.stderr)
            sys.exit(1)  # Прекращаем выполнение программы
        
        # Преобразование координат в индексы пикселей
        row, col = src.index(lng, lat)  # Используем lng (долгота) и lat (широта)
        
        # Чтение значения высоты
        elevation = src.read(1)[row, col]  # Читаем первый слой
        return elevation

if __name__ == "__main__":
    latitude = float(sys.argv[1])  # Широта
    longitude = float(sys.argv[2])  # Долгота
    
    # Укажите путь к вашему GeoTIFF файлу
    # geotiff_path = 'tiffs/supertiff2.tif'
    geotiff_path = 'tiffs/11.tif'

    try:
        elevation = get_elevation_from_geotiff(latitude, longitude, geotiff_path)
        print(elevation)  # Возвращаем высоту в stdout
    except Exception as e:
        print(f"Ошибка при получении высоты: {e}", file=sys.stderr)
