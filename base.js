document.addEventListener('DOMContentLoaded', () => {
  const searchInput = document.getElementById('searchInput');
  const eventCards = document.querySelectorAll('.event-card');
  const eventsContainer = document.getElementById('eventsContainer');
  const cardViewBtn = document.getElementById('cardViewBtn');
  const listViewBtn = document.getElementById('listViewBtn');

  // 1. KERESŐ ÉS SZŰRŐ FUNKCIÓ
  searchInput.addEventListener('input', (e) => {
    const filterText = e.target.value.toLowerCase().trim();

    eventCards.forEach(card => {
      const cardContent = card.textContent.toLowerCase();
      if (cardContent.includes(filterText)) {
        card.classList.remove('hidden');
      } else {
        card.classList.add('hidden');
      }
    });
  });

  // 2. NÉZETVÁLTÓ FUNKCIÓ (KÁRTYA / LISTA)
  cardViewBtn.addEventListener('click', () => {
    eventsContainer.classList.remove('list-view');
    eventsContainer.classList.add('grid-view');
    cardViewBtn.classList.add('active');
    listViewBtn.classList.remove('active');
  });

  listViewBtn.addEventListener('click', () => {
    eventsContainer.classList.remove('grid-view');
    eventsContainer.classList.add('list-view');
    listViewBtn.classList.add('active');
    cardViewBtn.classList.remove('active');
  });
});