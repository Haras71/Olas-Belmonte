document.addEventListener('DOMContentLoaded', () => {
    const eventForm = document.getElementById('event-form');
    const eventList = document.getElementById('event-list');
    let events = [];
    let currentDate = new Date();

    const daysOfWeek = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sab'];
    const monthsOfYear = ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'];

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
            let firstDayFlag = firstDayIndex;
            let row = document.createElement('tr');

            for (let i = 0; i < firstDayFlag; i++) {
                row.appendChild(document.createElement('td'));
            }

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
                        cell.classList.add('event-day');
                    }

                    row.appendChild(cell);
                    currentDay++;
                }
                calendarTable.appendChild(row);
                row = document.createElement('tr');
                firstDayFlag = 0;
            }

            calendar.appendChild(calendarTable);
        }
    }

    function renderEventList(events) {
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

                    // Add edit and delete buttons
                    const editButton = document.createElement('button');
                    editButton.textContent = 'Editar';
                    editButton.onclick = () => editEvent(event.id);
                    eventItem.appendChild(editButton);

                    const deleteButton = document.createElement('button');
                    deleteButton.textContent = 'Excluir';
                    deleteButton.onclick = () => deleteEvent(event.id);
                    eventItem.appendChild(deleteButton);

                    eventList.appendChild(eventItem);
                }
            });
        }
    }

    function changeMonth(direction) {
        currentDate.setMonth(currentDate.getMonth() + direction);
        loadEvents();
    }

    function saveEvents() {
        fetch('https://olas-ohrr.onrender.com:3000/events', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(events)
        })
        .then(response => response.text())
        .then(message => {
            console.log(message); // Log success message
            loadEvents(); // Reload events after saving
        })
        .catch(error => console.error('Error saving events:', error));
    }

    eventForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const eventId = document.getElementById('event-id').value;
        const eventDate = document.getElementById('event-date').value;
        const eventTitle = document.getElementById('event-name').value;
        const eventDescription = document.getElementById('event-description').value;

        if (eventId) {
            // Edit existing event
            const event = events.find(e => e.id == eventId);
            event.date = eventDate;
            event.title = eventTitle;
            event.description = eventDescription;
        } else {
            // Add new event
            const newEvent = {
                id: Date.now(),
                date: eventDate,
                title: eventTitle,
                description: eventDescription
            };
            events.push(newEvent);
        }
        saveEvents();
        renderEventList(events);
        renderCalendar(events);
        eventForm.reset();
    });

    function loadEvents() {
        fetch('https://olas-ohrr.onrender.com:3000/events')
            .then(response => response.json())
            .then(data => {
                events = data;
                renderEventList(events);
                renderCalendar(events);
            })
            .catch(error => console.error('Error loading events:', error));
    }

    function editEvent(id) {
        const eventToEdit = events.find(event => event.id === id);
        document.getElementById('event-id').value = eventToEdit.id;
        document.getElementById('event-date').value = eventToEdit.date;
        document.getElementById('event-name').value = eventToEdit.title;
        document.getElementById('event-description').value = eventToEdit.description;
    }

    function deleteEvent(id) {
        events = events.filter(event => event.id !== id);
        saveEvents();
        renderEventList(events);
        renderCalendar(events);
    }

    window.changeMonth = changeMonth;
    window.editEvent = editEvent;
    window.deleteEvent = deleteEvent;

    loadEvents();
});
