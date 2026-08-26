// Campus Lost & Found Radar - Simple Interactive Logic

document.addEventListener('DOMContentLoaded', () => {
  // 1. Interactive Modal Toggle
  const modal = document.getElementById('report-modal');
  const reportBtn = document.getElementById('report-btn');
  const closeModalBtn = document.getElementById('close-modal-btn');
  const reportForm = document.getElementById('report-form');

  // Open Modal
  reportBtn.addEventListener('click', () => {
    modal.classList.remove('hidden');
  });

  // Close Modal
  closeModalBtn.addEventListener('click', () => {
    modal.classList.add('hidden');
  });

  // Close Modal on Backdrop Click
  modal.addEventListener('click', (e) => {
    if (e.target === modal) {
      modal.classList.add('hidden');
    }
  });

  // Form Submit Handler
  reportForm.addEventListener('submit', (e) => {
    e.preventDefault();
    alert('Item submitted successfully! (Lab Demo)');
    modal.classList.add('hidden');
    reportForm.reset();
  });

  // 2. Simple Filter Functionality (All / Lost / Found)
  const filterSelect = document.getElementById('filter-select');
  const itemCards = document.querySelectorAll('.item-card');

  filterSelect.addEventListener('change', (e) => {
    const selectedFilter = e.target.value.toLowerCase();

    itemCards.forEach((card) => {
      const cardStatus = card.getAttribute('data-status').toLowerCase();

      if (selectedFilter === 'all' || cardStatus === selectedFilter) {
        card.classList.remove('hidden');
      } else {
        card.classList.add('hidden');
      }
    });
  });
});
