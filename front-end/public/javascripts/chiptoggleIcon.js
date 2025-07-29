document.addEventListener('DOMContentLoaded', function () {
  function updateChipSVGIcons() {
    document.querySelectorAll('.hobby-chip').forEach(label => {
      const input = label.querySelector('input[type="checkbox"], input[type="radio"]');
      const plusIcon = label.querySelector('.plus-icon');
      const closeIcon = label.querySelector('.close-icon');
      if (!input || !plusIcon || !closeIcon) return;

      if (input.type === 'radio') {
        // For radio, only one in the group can be selected
        const group = input.name;
        const radios = document.querySelectorAll(`input[type="radio"][name="${group}"]`);
        radios.forEach(radio => {
          const radioLabel = radio.closest('.hobby-chip');
          const plus = radioLabel && radioLabel.querySelector('.plus-icon');
          const close = radioLabel && radioLabel.querySelector('.close-icon');
          if (plus && close) {
            if (radio.checked) {
              plus.style.display = 'none';
              close.style.display = '';
            } else {
              plus.style.display = '';
              close.style.display = 'none';
            }
          }
        });
      } else {
        // For checkbox, toggle individually
        if (input.checked) {
          plusIcon.style.display = 'none';
          closeIcon.style.display = '';
        } else {
          plusIcon.style.display = '';
          closeIcon.style.display = 'none';
        }
      }
    });
  }

  document.addEventListener('change', function (e) {
    if (
      e.target.matches('input[type="checkbox"]') ||
      e.target.matches('input[type="radio"]')
    ) {
      updateChipSVGIcons();
    }
  });

  // Initial state
  updateChipSVGIcons();
});