import fs from 'fs';
import path from 'path';
import { fromFile } from 'geotiff';

async function extractHeightsFromTiff(tiffFilePath) {
    try {
        const tiff = await fromFile(tiffFilePath);
        const image = await tiff.getImage();
        const rasterData = await image.readRasters();

        if (!rasterData || rasterData.length === 0) {
            throw new Error('Не удалось извлечь данные высоты из TIFF файла.');
        }

        return rasterData[0];
    } catch (error) {
        console.error('Ошибка при извлечении высот:', error);
        throw error;
    }
}
async function processTiffFilesInDirectory(directoryPath) {
    try {
        const files = await fs.promises.readdir(directoryPath);
        const tiffFiles = files.filter(file => file.endsWith('.tif') || file.endsWith('.tiff'));

        const batchSize = 5; // Количество файлов для обработки за раз
        for (let i = 0; i < tiffFiles.length; i += batchSize) {
            const batch = tiffFiles.slice(i, i + batchSize);
            await Promise.all(batch.map(async(file) => {
                const filePath = path.join(directoryPath, file);
                console.log(`Обработка файла: ${filePath}`);

                try {
                    const heights = await extractHeightsFromTiff(filePath);
                    if (heights.length === 0) {
                        console.error(`Массив высот пуст для файла ${file}.`);
                        return;
                    }

                    const maxHeight = Math.max(...heights);
                    const minHeight = Math.min(...heights);
                    console.log(`Файл: ${file} - Максимальная высота: ${maxHeight}, Минимальная высота: ${minHeight}`);
                } catch (error) {
                    console.error(`Ошибка при обработке файла ${file}:`, error);
                }
            }));
        }
    } catch (error) {
        console.error('Ошибка при чтении директории:', error);
    }
}


async function main() {
    const directoryPath = 'C:\\Users\\Рабочее место №6\\Desktop\\mapsat-offline-with-docker\\maincode\\elevation'; // Путь к папке с TIFF файлами
    await processTiffFilesInDirectory(directoryPath);
}

// Запуск основной функции
main().catch(error => console.error('Ошибка при запуске main:', error));