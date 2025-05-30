// Parse moreHobbies from server
const searchInput = document.getElementById('hobby-search');
const searchResults = document.getElementById('search-results');
const chipsContainer = document.getElementById('hobby-chips-container');
const form = document.querySelector('.membership-form');

// Prevent duplicate selection
function isAlreadySelected(hobby) {
  return !!document.querySelector('input[name="hobbies"][value="' + hobby + '"]');
}

// Limit selection to exactly 5
function updateCheckboxLimits() {
  const allCheckboxes = document.querySelectorAll('input[name="hobbies"]');
  const checked = Array.from(allCheckboxes).filter(cb => cb.checked);
  allCheckboxes.forEach(cb => {
    cb.disabled = !cb.checked && checked.length >= 5;
  });
}

// Listen for changes on all hobby checkboxes (including dynamic ones)
document.addEventListener('change', function(e) {
  if (e.target.name === 'hobbies') {
    updateCheckboxLimits();
  }
});

// Prevent form submission if not exactly 5 selected
form.addEventListener('submit', function(e) {
  const checked = document.querySelectorAll('input[name="hobbies"]:checked');
  if (checked.length !== 5) {
    e.preventDefault();
    alert('Please select exactly 5 interests.');
  }
});

// Search functionality
searchInput.addEventListener('input', function() {
  const query = this.value.trim().toLowerCase();
  searchResults.innerHTML = '';
  if (query.length === 0) return;

  // Filter moreHobbies by search, exclude already shown/selected
  const matches = moreHobbies.filter(hobby =>
    hobby.toLowerCase().includes(query) && !isAlreadySelected(hobby)
  ).slice(0, 10); // limit results

  matches.forEach(hobby => {
    const label = document.createElement('label');
    label.className = 'hobby-chip';
    label.innerHTML = `
      <input type="checkbox" name="hobbies" value="${hobby}" style="display: none;" />
      <span style="margin-right: 8px;">🔎</span> ${hobby}
    `;
    searchResults.appendChild(label);
  });
});

// Initial call to set limits on page load
updateCheckboxLimits();