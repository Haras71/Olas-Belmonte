document.addEventListener('DOMContentLoaded', function () {
    let currentSlide = 0;
    let slides = [];
    let currentDate = new Date();

    const daysOfWeek = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sab'];
    const monthsOfYear = ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'];

    function showSlide(index) {
        slides.forEach(slide => slide.classList.remove('active'));
        slides[index].classList.add('active');
    }

    function changeSlide(direction) {
        currentSlide = (currentSlide + direction + slides.length) % slides.length;
        showSlide(currentSlide);
    }

    function loadImages() {
        fetch('conteudos/images.json')
            .then(response => response.json())
            .then(data => {
                const slider = document.getElementById('slider');
                if (slider) {
                    data.forEach((src, index) => {
                        const img = document.createElement('img');
                        img.src = src;
                        img.alt = `Image ${index + 1}`;
                        if (index === 0) {
                            img.classList.add('active');
                        }
                        slider.insertBefore(img, slider.firstChild);
                        slides.push(img);
                    });

                    // Automatically change slides every 3 seconds
                    setInterval(() => {
                        changeSlide(1);
                    }, 5000);
                }
            })
            .catch(error => console.error('Error loading images:', error));
    }

    function loadEvents() {
        fetch('conteudos/events.json')
            .then(response => response.json())
            .then(events => {
                renderCalendar(events);
                renderEventList(events);
            })
            .catch(error => console.error('Error loading events:', error));
    }

   
    function renderCalendar(events) {
        const calendar = document.getElementById('calendar');
        const calendarMonthYear = document.getElementById('calendar-month-year');
        if (calendar && calendarMonthYear) {
            calendar.innerHTML = '';
            const calendarTable = document.createElement('table');
            calendarTable.className = 'calendar';

            const headerRow = document.createElement('tr');
            daysOfWeek.forEach(day => {
                const th = document.createElement('th');
                th.textContent = day;
                headerRow.appendChild(th);
            });
            calendarTable.appendChild(headerRow);

            calendarMonthYear.textContent = `${monthsOfYear[currentDate.getMonth()]} ${currentDate.getFullYear()}`;

            const firstDayIndex = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1).getDay();
            const lastDay = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).getDate();

            let currentDay = 1;
            let firstDayFlag = firstDayIndex;  // Use a flag to manage the first row of the calendar
            let row = document.createElement('tr');

            // Add empty cells before the first day of the month
            for (let i = 0; i < firstDayFlag; i++) {
                row.appendChild(document.createElement('td'));
            }

            // Fill in the calendar with days
            while (currentDay <= lastDay) {
                for (let i = firstDayFlag; i < 7; i++) {
                    if (currentDay > lastDay) break;
                    const cell = document.createElement('td');
                    cell.innerHTML = `<span>${currentDay}</span>`;

                    const event = events.find(e => {
                        const eventDate = new Date(e.date);
                        return eventDate.getDate() === currentDay && eventDate.getMonth() === currentDate.getMonth();
                    });
                    if (event) {
                        cell.classList.add('event-day');  // Add class to highlight event day
                    }

                    row.appendChild(cell);
                    currentDay++;
                }
                calendarTable.appendChild(row);
                row = document.createElement('tr');
                firstDayFlag = 0;  // Reset the flag for subsequent rows
            }

            calendar.appendChild(calendarTable);
        }
    }

    function renderEventList(events) {
        const eventList = document.getElementById('event-list');
        if (eventList) {
            eventList.innerHTML = '';

            events.forEach(event => {
                const eventDate = new Date(event.date);
                if (eventDate.getMonth() === currentDate.getMonth() && eventDate.getFullYear() === currentDate.getFullYear()) {
                    const eventItem = document.createElement('div');
                    eventItem.className = 'event-item';

                    const eventDay = document.createElement('strong');
                    eventDay.className = 'event-date';
                    eventDay.innerHTML = `<i class="fas fa-calendar-alt"></i> ${eventDate.getDate()} ${monthsOfYear[eventDate.getMonth()]}`;
                    eventItem.appendChild(eventDay);

                    const eventTitle = document.createElement('h3');
                    eventTitle.textContent = event.title;
                    eventItem.appendChild(eventTitle);

                    const eventDesc = document.createElement('p');
                    eventDesc.textContent = event.description;
                    eventItem.appendChild(eventDesc);

                    eventList.appendChild(eventItem);
                }
            });
        }
    }

    function changeMonth(direction) {
        currentDate.setMonth(currentDate.getMonth() + direction);
        loadEvents();
    }

    // Load history content from text file
    fetch('conteudos/history.txt')
    .then(response => response.text())
    .then(data => {
        const historyText = document.getElementById('history-text');
        if (historyText) {
            const lines = data.split('\n');
            const firstLine = `<b>${lines[0]}</b>`;
            const remainingText = lines.slice(1).map(line => `<p>${line}</p>`).join('');
            const formattedText = `${firstLine}${remainingText}`;
            historyText.innerHTML = formattedText;
        }
    })
    .catch(error => console.error('Error loading history content:', error));



    // Load images from JSON file
    loadImages();

    // Load events from JSON file
    loadEvents();

    // Make changeSlide and changeMonth functions globally accessible
    window.changeSlide = changeSlide;
    window.changeMonth = changeMonth;


});
