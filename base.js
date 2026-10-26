document.addEventListener('DOMContentLoaded', () => {
  // ==========================================
  // 1. FŐOLDAL: Események listázása és keresés
  // ==========================================
  const eventsContainer = document.getElementById('eventsContainer');

  if (eventsContainer) {
    localStorage.removeItem('selectedEvent');

    const fallbackEvents = [
      { title: 'Tankcsapda Koncert', date: '2027. május 15.', description: 'Acoustic & Electric Show az Arénában.' },
      { title: 'Halott Pénz', date: '2027. június 20.', description: 'Hatalmas nyári arénashow és fesztiválhangulat.' },
      { title: 'Azahriah Live', date: '2027. július 10.', description: 'A legújabb album élő bemutatója.' },
      { title: 'Majka & A Őrkutyák', date: '2027. augusztus 05.', description: 'Látványos szuperkoncert Veszprémben.' },
      { title: 'Dzsúdló', date: '2027. május 23.', description: 'Robbanásszerű energiák és dallamos pop-hiphop dallamok a veszprémi közönségnek.' },
      { title: 'Krúbi', date: '2027. június 12.', description: 'Kritikus szövegek, extravagáns show és felejthetetlen vizuális élmény.' },
      { title: 'Sisi', date: '2027. június 27.', description: 'A hazai underground hiphop legújabb hulláma és vagány, dögös ritmusok.' },
      { title: 'Charlie', date: '2027. július 11.', description: 'A legendás rekedtes hang, örökzöld rock- és jazz slágerek egy különleges estén.' },
      { title: 'Pogany Indulo', date: '2027. augusztus 19.', description: 'Nyers, őszinte old-school rap és elképesztő arénahangulat a vár tövében.' },
      { title: 'Parno Graszt', date: '2027. szeptember 04.', description: 'Hamisítatlan tradíció, kitörő életöröm és fergeteges oláh cigány zene.' }
    ];

    let events = [];
    let currentView = 'card';
    let filterText = '';

    const searchInput = document.getElementById('searchInput');
    const cardViewBtn = document.getElementById('cardViewBtn');
    const tableViewBtn = document.getElementById('tableViewBtn');

    fetch('koncertek.json')
      .then(response => {
        if (!response.ok) throw new Error('Nem 200-as válasz');
        return response.json();
      })
      .then(data => {
        events = data;
        renderEvents();
      })
      .catch(() => {
        events = fallbackEvents;
        renderEvents();
      });

    function renderEvents() {
      const filteredEvents = events.filter(event => {
        const fullText = `${event.title} ${event.date} ${event.description}`.toLowerCase();
        return fullText.includes(filterText);
      });

      eventsContainer.innerHTML = '';

      if (filteredEvents.length === 0) {
        eventsContainer.innerHTML = '<p class="no-results">Nincs a keresésnek megfelelő esemény.</p>';
        return;
      }

      if (currentView === 'card') {
        eventsContainer.className = 'events-container grid-view';
        filteredEvents.forEach(event => {
          const card = document.createElement('div');
          card.className = 'event-card';
          card.innerHTML = `
            <div class="event-info">
              <h3>${event.title}</h3>
              <p class="date">${event.date}</p>
              <p class="description">${event.description}</p>
            </div>
            <button class="btn-primary buy-btn" onclick="localStorage.setItem('selectedEvent', '${event.title}'); window.location.href='foglalas.html'">Jegyvásárlás</button>
          `;
          eventsContainer.appendChild(card);
        });
      } else {
        eventsContainer.className = 'events-container table-view';
        const table = document.createElement('table');
        table.className = 'events-table';
        table.innerHTML = `
          <thead>
            <tr>
              <th>Esemény neve</th>
              <th>Dátum</th>
              <th>Leírás</th>
              <th>Művelet</th>
            </tr>
          </thead>
          <tbody>
            ${filteredEvents.map(event => `
              <tr>
                <td class="event-title-cell">${event.title}</td>
                <td class="event-date-cell">${event.date}</td>
                <td>${event.description}</td>
                <td><button class="btn-primary buy-btn" onclick="localStorage.setItem('selectedEvent', '${event.title}'); window.location.href='foglalas.html'">Jegyvásárlás</button></td>
              </tr>
            `).join('')}
          </tbody>
        `;
        eventsContainer.appendChild(table);
      }
    }

    if (searchInput) {
      searchInput.addEventListener('input', (e) => {
        filterText = e.target.value.toLowerCase().trim();
        renderEvents();
      });
    }

    if (cardViewBtn && tableViewBtn) {
      cardViewBtn.addEventListener('click', () => {
        currentView = 'card';
        cardViewBtn.classList.add('active');
        tableViewBtn.classList.remove('active');
        renderEvents();
      });

      tableViewBtn.addEventListener('click', () => {
        currentView = 'table';
        tableViewBtn.classList.add('active');
        cardViewBtn.classList.remove('active');
        renderEvents();
      });
    }
  }

  // ==========================================
  // 2. FOGLALÁS OLDAL: Ülőhelyek, állójegyek, számítás
  // ==========================================
  const seats = document.querySelectorAll('.seat');
  const kedvezmenySelect = document.getElementById('kedvezmeny');
  const totalPriceElement = document.getElementById('totalPrice');
  const darabInput = document.getElementById('darab');
  const standingDarabInput = document.getElementById('standingDarab');
  const selectedEventTitleSpan = document.getElementById('selectedEventTitle');

  if (seats.length > 0 || standingDarabInput) {
    const currentEvent = localStorage.getItem('selectedEvent');
    if (selectedEventTitleSpan) {
      selectedEventTitleSpan.textContent = currentEvent ? `- ${currentEvent}` : '(Nincs koncert kiválasztva)';
    }

    const discounts = {
      'Gyerekjegy 15%': 0.15,
      'Diákjegy 20%': 0.20,
      'Nyugdíjasjegy 20%': 0.20,
      'Csoportos jegy 15%': 0.15
    };

    const STANDING_PRICE = 10000;
    let selectedSeats = [];
    let currentNumericTotal = 0;

    seats.forEach(seat => {
      seat.addEventListener('click', () => {
        if (seat.classList.contains('occupied')) return;

        const seatId = seat.getAttribute('data-seat');
        const seatPrice = parseInt(seat.getAttribute('data-price')) || 0;

        if (seat.classList.contains('selected')) {
          seat.classList.remove('selected');
          selectedSeats = selectedSeats.filter(item => item.id !== seatId);
        } else {
          seat.classList.add('selected');
          selectedSeats.push({ id: seatId, basePrice: seatPrice });
        }

        updateTotalAndCount();
      });
    });

    if (standingDarabInput) {
      standingDarabInput.addEventListener('input', updateTotalAndCount);
    }

    if (kedvezmenySelect) {
      kedvezmenySelect.addEventListener('change', updateTotalAndCount);
    }

    function updateTotalAndCount() {
      const selectedDiscountText = kedvezmenySelect ? kedvezmenySelect.value : '';
      const discountRate = discounts[selectedDiscountText] || 0;
      const standingCount = standingDarabInput ? parseInt(standingDarabInput.value) || 0 : 0;

      const totalTickets = selectedSeats.length + standingCount;
      if (darabInput) {
        darabInput.value = totalTickets;
      }

      let total = 0;
      selectedSeats.forEach(seat => {
        total += seat.basePrice * (1 - discountRate);
      });

      total += (standingCount * STANDING_PRICE) * (1 - discountRate);
      currentNumericTotal = Math.round(total);

      if (totalPriceElement) {
        totalPriceElement.textContent = `${currentNumericTotal.toLocaleString('hu-HU')} Ft`;
      }
    }

    const submitBtn = document.querySelector('.kuldes button');
    if (submitBtn) {
      submitBtn.addEventListener('click', (e) => {
        e.preventDefault();

        const standingCount = standingDarabInput ? parseInt(standingDarabInput.value) || 0 : 0;

        if (selectedSeats.length === 0 && standingCount === 0) {
          alert('Kérjük, válasszon ki legalább egy ülőhelyet vagy adjon meg állójegyet!');
          return;
        }

        const nev = document.getElementById('nev')?.value;
        const email = document.getElementById('email')?.value;
        const telefonszam = document.getElementById('telefonszam')?.value;

        if (!nev || !email || !telefonszam) {
          alert('Kérjük, töltse ki az összes személyes adatot!');
          return;
        }

        // Tiszta formátumú adatok elmentése a kosárba
        const bookingData = {
          koncert: currentEvent,
          nev: nev,
          email: email,
          telefonszam: telefonszam,
          helyek: selectedSeats.map(s => s.id),
          allojegyekSzama: standingCount,
          kedvezmeny: kedvezmenySelect.value || 'Nincs',
          vegosszegSzam: currentNumericTotal
        };

        localStorage.setItem('kosar', JSON.stringify(bookingData));

        alert('A foglalás sikeresen a kosárba került!');
        window.location.href = 'kosar.html';
      });
    }
  }
});