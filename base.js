document.addEventListener('DOMContentLoaded', () => {
  // Események adatai
  const events = [
    { title: 'Tankcsapda Koncert', date: '2027. május 15.', description: 'Acoustic & Electric Show az Arénában.' },
    { title: 'Halott Pénz', date: '2027. június 20.', description: 'Hatalmas nyári arénashow és fesztiválhangulat.' },
    { title: 'Azahriah Live', date: '2027. július 10.', description: 'A legújabb album élő bemutatója.' },
    { title: 'Majka & A Őrkutyák', date: '2027. augusztus 05.', description: 'Látványos szuperkoncert Veszprémben.' },
    { title: 'Dzsúdló', date: '2027. május 23.', description: 'Robbanásszerű energiák és dallamos pop-hiphop dallamok a veszprémi közönségnek.'},
    { title: 'Krúbi', date: '2027. június 12.', description: 'Kritikus szövegek, extravagáns show és felejthetetlen vizuális élmény.'},
    { title: 'Sisi', date: '2027. június 27.', description: 'A hazai underground hiphop legújabb hulláma és vagány, dögös ritmusok.'},
    { title: 'Charlie', date: '2027. július 11.', description: 'A legendás rekedtes hang, örökzöld rock- és jazz slágerek egy különleges estén.'},
    { title: 'Pogany Indulo', date: '2027. augusztus 19.', description: 'Nyers, őszinte old-school rap és elképesztő arénahangulat a vár tövében.'},
    { title: 'Parno Graszt', date: '2027. szeptember 04.', description: 'Hamisítatlan tradíció, kitörő életöröm és fergeteges oláh cigány zene.'}

    
  ];

  let currentView = 'card'; // 'card' vagy 'table'
  let filterText = '';

  const eventsContainer = document.getElementById('eventsContainer');
  const searchInput = document.getElementById('searchInput');
  const cardViewBtn = document.getElementById('cardViewBtn');
  const tableViewBtn = document.getElementById('tableViewBtn');

  // --- RENDERELÉS FUNKCIÓ ---
  function render() {
    // Adatok szűrése gépelés alapján
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
      // KÁRTYÁS NÉZET GENERÁLÁSA
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
          <button class="btn-primary buy-btn">Jegyvásárlás</button>
        `;
        eventsContainer.appendChild(card);
      });

    } else {
      // TÁBLÁZATOS NÉZET GENERÁLÁSA
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
              <td><button class="btn-primary buy-btn">Jegyvásárlás</button></td>
            </tr>
          `).join('')}
        </tbody>
      `;
      eventsContainer.appendChild(table);
    }
  }

  // --- ESEMÉNYKEZELŐK ---
  searchInput.addEventListener('input', (e) => {
    filterText = e.target.value.toLowerCase().trim();
    render();
  });

  cardViewBtn.addEventListener('click', () => {
    currentView = 'card';
    cardViewBtn.classList.add('active');
    tableViewBtn.classList.remove('active');
    render();
  });

  tableViewBtn.addEventListener('click', () => {
    currentView = 'table';
    tableViewBtn.classList.add('active');
    cardViewBtn.classList.remove('active');
    render();
  });

  // Kezdő megjelenítés
  render();
});