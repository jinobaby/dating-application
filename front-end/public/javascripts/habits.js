  // Invert chip color for selected radio (works for both groups)
  document.addEventListener('change', function(e) {
    if (e.target.type === 'radio') {
      const group = e.target.name;
      document.querySelectorAll('input[name="' + group + '"]').forEach(input => {
        input.parentElement.classList.toggle('selected', input.checked);
      });
    }
  });
  