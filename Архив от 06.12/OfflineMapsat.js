// Оффлайн версия
var map = L.map('map').setView([55.755811, 37.617617], 11);
L.tileLayer('data/Tiles/{z}/{x}/{y}.png', {
    maxZoom: 13,
    minZoom: 3,
    tileSize: 256,
    zoomOffset: 0,
    attribution: 'Тестовая карта'
}).addTo(map);

// отключение флага, что?
map.attributionControl.setPrefix(false)

let lastMarker; // переменная для маркера, создающегося по клику
let markerFromDB; // переменная для маркера из базы данных
let geodesic; // переменная для геодезической линии между lastMarker и markerFromDB
let thirdMarker; // переменная для маркера дрона
let thirdGeodesic; // переменная для геодезической линии между lastMarker и thirdMarker

// обработчик нажатия по карте
map.on('click', function(e) {
    const lat = e.latlng.lat;
    const lng = e.latlng.lng;

    // создание маркера 
    if (lastMarker) {
        map.removeLayer(lastMarker);
    }

    lastMarker = L.marker([lat, lng], {
        draggable: true
    }).addTo(map);
    lastMarker.on('drag', updateGeodesicAndCalculations);
    updateGeodesicAndCalculations();

});

// Получаем ссылку на главное меню и кнопку
// const menu = document.getElementById('menu');
// const menuToggle = document.getElementById('menuToggle');

// Обработчик для кнопки (открыть/закрыть меню)
// menuToggle.addEventListener('click', () => {
//     if (menu.style.display === 'none' || menu.style.display === '') {
//         menu.style.display = 'block';
//         menuToggle.textContent = 'Закрыть меню';
//     } else {
//         menu.style.display = 'none';
//         menuToggle.textContent = 'Открыть меню';
//     }
// });

// Данные подгружаются с сервера
fetch('http://localhost:3000/data')
    .then(response => response.json())
    .then(data => {
        const dropdown = document.getElementById('dataDropdown');
        data.forEach(item => {
            const option = document.createElement('option');
            option.value = item.id;
            option.textContent = item.Names;
            option.dataset.latitude = item.latitude;
            option.dataset.longitude = item.longitude;
            dropdown.appendChild(option);
        });

        dropdown.addEventListener('change', (event) => {
                const selectedOption = event.target.selectedOptions[0];
                const latitude = selectedOption.dataset.latitude;
                const longitude = selectedOption.dataset.longitude;

                if (markerFromDB) {
                    map.removeLayer(markerFromDB);
                }

                markerFromDB = L.marker([latitude, longitude]).addTo(map).bindPopup(selectedOption.textContent);
                updateGeodesicAndCalculations();

            })
            .catch(error => console.error('Ошибка загрузки данных:', error));

    });

// функция для создания геодезических линий
function updateGeodesicAndCalculations() {
    if (geodesic) {
        map.removeLayer(geodesic);
    }

    if (lastMarker && markerFromDB) {
        geodesic = L.geodesic([lastMarker.getLatLng(), markerFromDB.getLatLng()], { // между точкой (по клику) и из БД
            weight: 3,
            opacity: 1,
            color: 'blue',
            steps: 50
        }).addTo(map);

        // Выполнение расчетов
        performCalculations();
    }

}
// подсчёт угла места, угла поворота коныектора, истинного и магнитного азимутов

function performCalculations() {
    if (lastMarker && markerFromDB) {
        const lat1 = lastMarker.getLatLng().lat;
        const lon1 = lastMarker.getLatLng().lng;
        const satLat = markerFromDB.getLatLng().lat;
        const satLon = markerFromDB.getLatLng().lng;
        const toDegrees = (radians) => radians * (180 / Math.PI);
        const rad = Math.PI / 180;

        // Угол места
        const angle = Math.atan((Math.cos(lon1 * rad) * Math.cos(lat1 * rad) - 0.151) / Math.sqrt(1 - Math.pow(Math.cos(lon1 * rad), 2) * Math.pow(Math.cos(lat1 * rad), 2))) / rad;
        const elevationAngleText = `Угол места: ${angle.toFixed(2)}°`;

        // Угол поворота конвектора
        const convectorAngle = (Math.atan(Math.sin(lon1 * rad - satLon * rad) / Math.tan(lat1 * rad))) / rad;
        const convectorAngleText = `Угол поворота конвектора: ${convectorAngle.toFixed(2)}°`;

        // Истинный азимут
        const TrueAzimuth = Math.atan2(Math.sin((satLon - lon1) * rad) * Math.cos(satLat * rad), Math.cos(lat1 * rad) * Math.sin(satLat * rad) - Math.sin(lat1 * rad) * Math.cos(satLat * rad) * Math.cos((satLon - lon1) * rad));
        const TrueAzimuthD = (toDegrees(TrueAzimuth) + 360) % 360;
        const TrueAzimuthText = `Истинный азимут: ${TrueAzimuthD.toFixed(2)}°`;

        // Магнитный азимут
        const geomagData = geomag.field(lat1, lon1);
        const magneticDeclination = geomagData.declination;
        const MagneticAzimuth = (TrueAzimuthD - magneticDeclination + 360) % 360;
        const MagneticAzimuthText = `Магнитный азимут: ${MagneticAzimuth.toFixed(2)}°`;

        // Обновление результатов на странице
        const resultsContainer = document.getElementById('results');
        resultsContainer.innerHTML = `
                    <div class="result-item">${elevationAngleText}</div>
                    <div class="result-item">${convectorAngleText}</div>
                    <div class="result-item">${TrueAzimuthText}</div>
                    <div class="result-item">${MagneticAzimuthText}</div>
                `;
    } else {
        alert('Точки для расчета не выбраны.');
    }
};