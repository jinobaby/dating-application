document.querySelectorAll('.photo-input').forEach(function(input, idx) {
  input.addEventListener('change', function(e) {
    const file = e.target.files[0];
    const preview = document.getElementById('photo-preview-' + idx);
    const plus = e.target.parentElement.querySelector('.plus-icon');
    if (file) {
      const reader = new FileReader();
      reader.onload = function(ev) {
        preview.src = ev.target.result;
        preview.style.display = 'block';
        plus.style.display = 'none';
      };
      reader.readAsDataURL(file);
    } else {
      preview.src = '';
      preview.style.display = 'none';
      plus.style.display = '';
    }
  });
});