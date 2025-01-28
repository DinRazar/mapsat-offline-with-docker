const express = require('express');
const fs = require('fs'); // Импортируем модуль fs
const xlsx = require('xlsx');
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path');
const { spawn } = require('child_process');
const app = express();
const PORT = 3000;

app.use(cors()); // Разрешаем CORS для взаимодействия с клиентом
app.use(express.static(path.join(__dirname)));
app.use(bodyParser.json());

// Чтение данных из Excel и конвертация в JSON

app.get('/data', (req, res) => {
    const workbook = xlsx.readFile('sput.xlsx');
    const sheetName = workbook.SheetNames[0]; // Используем первый лист
    const worksheet = workbook.Sheets[sheetName];
    const jsonData = xlsx.utils.sheet_to_json(worksheet); // Конвертируем в JSON
    res.json(jsonData); // Отправляем JSON на клиент

});

// Эндпоинт для получения высоты
app.post('/api/getElevation', (req, res) => {
    const { latitude, longitude } = req.body;

    // Запуск Python-скрипта с координатами
    const pythonProcess = spawn('python', ['script.py', latitude, longitude]);

    pythonProcess.stdout.on('data', (data) => {
        const elevation = parseFloat(data.toString());
        res.json({ elevation });
    });

    pythonProcess.stderr.on('data', (data) => {
        console.error(`Ошибка: ${data}`);
        res.status(500).send('Ошибка при обработке запроса');
    });
});

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'))
});

app.listen(PORT, () => console.log(`Server is running on http://localhost:${PORT}`));