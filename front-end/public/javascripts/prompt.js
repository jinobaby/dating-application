document.addEventListener('DOMContentLoaded', function () {
  // --- Category Tab Switching ---
  document.querySelectorAll('.prompt-tab').forEach(tab => {
    tab.addEventListener('click', function () {
      const category = this.dataset.category;
      const url = new URL(window.location.href);
      url.searchParams.set('category', category);
      window.location.href = url.toString();
    });
  });

  // --- Prompt Answer Modal Logic ---
  const modal = document.getElementById('prompt-answer-modal');
  const answerInput = document.getElementById('prompt-answer-input');
  const charCount = document.getElementById('char-count');
  const saveBtn = document.getElementById('save-answer-btn');
  const promptsList = document.getElementById('selected-prompts-list');
  const promptsHidden = document.getElementById('prompts-hidden');
  const promptLimitMsg = document.getElementById('prompt-limit-msg');
  let currentQuestion = '';
  let currentCategory = '';
  let selectedPrompts = [];

  // Load from hidden input if editing
  try {
    selectedPrompts = JSON.parse(promptsHidden.value) || [];
  } catch { selectedPrompts = []; }

  // Open modal on answer button click
  document.querySelectorAll('.answer-btn').forEach(btn => {
    btn.addEventListener('click', function (e) {
      e.stopPropagation();
      if (selectedPrompts.length >= 3) {
        promptLimitMsg.style.display = 'block';
        return;
      }
      const row = this.closest('.prompt-question-row');
      currentQuestion = row.dataset.question;
      currentCategory = document.querySelector('.prompt-tab.active').textContent.trim();
      document.getElementById('prompt-question-title').textContent = currentQuestion;
      answerInput.value = '';
      charCount.textContent = '0';
      modal.style.display = 'flex';
      answerInput.focus();
    });
  });

  // Character count
  answerInput && answerInput.addEventListener('input', function () {
    charCount.textContent = this.value.length;
  });

  // Save answer
  saveBtn && saveBtn.addEventListener('click', function () {
    const answer = answerInput.value.trim();
    if (!answer) return;
    if (selectedPrompts.length >= 3) {
      promptLimitMsg.style.display = 'block';
      modal.style.display = 'none';
      return;
    }
    selectedPrompts.push({
      category: currentCategory,
      question: currentQuestion,
      answer
    });
    updatePromptsList();
    modal.style.display = 'none';
    promptsHidden.value = JSON.stringify(selectedPrompts);
    promptLimitMsg.style.display = selectedPrompts.length >= 3 ? 'block' : 'none';
  });

  // Remove prompt
  function updatePromptsList() {
    promptsList.innerHTML = '';
    selectedPrompts.forEach((item, idx) => {
      const li = document.createElement('li');
      li.innerHTML = `<span><b>${item.category}:</b> ${item.question}<br><i>${item.answer}</i></span>
        <button type="button" class="remove-prompt-btn" data-idx="${idx}">&times;</button>`;
      promptsList.appendChild(li);
    });
    promptsHidden.value = JSON.stringify(selectedPrompts);
    document.querySelectorAll('.remove-prompt-btn').forEach(btn => {
      btn.onclick = function () {
        selectedPrompts.splice(Number(this.dataset.idx), 1);
        updatePromptsList();
        promptLimitMsg.style.display = selectedPrompts.length >= 3 ? 'block' : 'none';
      };
    });
  }
  updatePromptsList();

  // Close modal on outside click
  modal && modal.addEventListener('click', function (e) {
    if (e.target === modal) modal.style.display = 'none';
  });
});