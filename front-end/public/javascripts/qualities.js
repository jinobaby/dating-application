  // Limit selection to 3
  document.addEventListener('change', function(e) {
    if (e.target.name === 'qualities') {
      const allCheckboxes = document.querySelectorAll('input[name="qualities"]');
      const checked = Array.from(allCheckboxes).filter(cb => cb.checked);
      allCheckboxes.forEach(cb => {
        cb.disabled = !cb.checked && checked.length >= 3;
      });
    }
  });
