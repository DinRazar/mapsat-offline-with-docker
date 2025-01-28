document.addEventListener('DOMContentLoaded', () => {
    const dataStandardSelect = document.getElementById('dataStandard');
    const dataSpeedSelect = document.getElementById('dataSpeed');
    const dataModulationSelect = document.getElementById('dataModulation');

    // Опции для кодовой скорости
    const speedOptions = {
        standard1: [
            { value: 'speed1', text: '1/2' },
            { value: 'speed2', text: '2/3' },
            { value: 'speed3', text: '3/4' },
            { value: 'speed4', text: '5/6' },
            { value: 'speed5', text: '7/8' },
        ],
        standard2: [
            { value: 'speed6', text: '1/4' },
            { value: 'speed7', text: '1/3' },
            { value: 'speed8', text: '2/5' },
            { value: 'speed9', text: '1/2' },
            { value: 'speed10', text: '3/5' },
            { value: 'speed11', text: '2/3' },
            { value: 'speed12', text: '3/4' },
            { value: 'speed13', text: '4/5' },
            { value: 'speed14', text: '5/6' },
            { value: 'speed15', text: '8/9' },
            { value: 'speed16', text: '9/10' },
        ],
    };

    // Опции для типа модуляции
    const modulationOptions = {
        standard1: [
            { value: 'modulation1', text: 'QPSK' }
        ],
        standard2: [
            { value: 'modulation2', text: 'QPSK' },
            { value: 'modulation3', text: '8-PSK' },
            { value: 'modulation4', text: '16APSK' },
            { value: 'modulation5', text: '32ASK' },
        ],
    };
    // Обработчик события изменения выбора в первом селекте
    dataStandardSelect.addEventListener('change', function() {
        // Очищаем второй и третий селекты
        dataSpeedSelect.innerHTML = '<option value="" disabled selected hidden> Кодовая скорость </option>';
        dataModulationSelect.innerHTML = '<option value="" disabled selected hidden> Тип модуляции </option>';

        // Получаем выбранное значение
        const selectedStandard = this.value;

        // Проверяем, есть ли опции для выбранного стандарта
        if (speedOptions[selectedStandard]) {
            speedOptions[selectedStandard].forEach(option => {
                const newOption = document.createElement('option');
                newOption.value = option.value;
                newOption.textContent = option.text;
                dataSpeedSelect.appendChild(newOption);
            });
        }

        if (modulationOptions[selectedStandard]) {
            modulationOptions[selectedStandard].forEach(option => {
                const newOption = document.createElement('option');
                newOption.value = option.value;
                newOption.textContent = option.text;
                dataModulationSelect.appendChild(newOption);
            });
        }
    });
});