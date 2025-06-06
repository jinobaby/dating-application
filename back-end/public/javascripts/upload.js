for (let i = 1; i <= 6; i++) {
  const input = document.getElementById(`image${i}`);
  const preview = document.getElementById(`preview${i}`);
  if (input && preview) {
    input.addEventListener('change', function (event) {
      const file = event.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = function (e) {
          preview.src = e.target.result;
          preview.style.display = 'block';
        };
        reader.readAsDataURL(file);
      } else {
        preview.style.display = 'none';
      }
    });
  }
}