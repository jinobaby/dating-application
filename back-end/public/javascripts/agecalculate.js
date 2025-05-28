document.querySelector('.membership-form').addEventListener('submit', function(e) {
  e.preventDefault();
  const day = parseInt(document.getElementById('day').value, 10);
  const month = parseInt(document.getElementById('month').value, 10);
  const year = parseInt(document.getElementById('year').value, 10);

  if (!day || !month || !year) {
    console.log('Please enter your complete birthday.');
    return;
  }

  const today = new Date();
  let age = today.getFullYear() - year;
  const m = today.getMonth() + 1 - month;
  const d = today.getDate() - day;
  if (m < 0 || (m === 0 && d < 0)) {
    age--;
  }

  // Show modal
  document.getElementById('ageModalText').innerHTML = `You're <b>${age}</b><br>Make sure this is your correct age as you can't change this later.`;
  document.getElementById('ageModal').style.display = 'flex';

  // Cancel button
  document.getElementById('cancelAge').onclick = function() {
    document.getElementById('ageModal').style.display = 'none';
  };

  // Confirm button
  document.getElementById('confirmAge').onclick = function() {
    document.getElementById('ageModal').style.display = 'none';
    e.target.submit();
  };
});
