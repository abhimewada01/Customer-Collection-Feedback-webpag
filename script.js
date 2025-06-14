(() => {
  const ratingButtons = document.querySelectorAll('.star-rating button');
  const feedbackForm = document.getElementById('feedbackForm');
  const feedbackList = document.getElementById('feedbackList');
  const averageScoreEl = document.getElementById('averageScore');
  const averageStarsEl = document.getElementById('averageStars');
  const commentInput = document.getElementById('comment');

  let selectedRating = 0;
  let feedbacks = [];

  function updateStarsUI() {
    ratingButtons.forEach(btn => {
      const val = Number(btn.dataset.value);
      btn.classList.remove('selected');
      btn.setAttribute('aria-checked', val === selectedRating ? 'true' : 'false');
      btn.tabIndex = (val === selectedRating || (selectedRating === 0 && val === 1)) ? 0 : -1;
      if (val <= selectedRating) {
        btn.classList.add('selected');
      }
    });
  }

  ratingButtons.forEach((btn) => {
    btn.addEventListener('click', () => {
      selectedRating = Number(btn.dataset.value);
      updateStarsUI();
    });
    btn.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowRight' || e.key === 'ArrowUp') {
        e.preventDefault();
        let next = Number(btn.dataset.value) + 1;
        if (next > 5) next = 1;
        ratingButtons[next - 1].focus();
      } else if (e.key === 'ArrowLeft' || e.key === 'ArrowDown') {
        e.preventDefault();
        let prev = Number(btn.dataset.value) - 1;
        if (prev < 1) prev = 5;
        ratingButtons[prev - 1].focus();
      } else if (e.key === ' ' || e.key === 'Enter') {
        btn.click();
      }
    });
  });

  feedbackForm.addEventListener('submit', (event) => {
    event.preventDefault();
    const comment = commentInput.value.trim();
    if (selectedRating > 0 || comment) {
      feedbacks.push({ rating: selectedRating, comment });
      renderFeedbackList();
      updateAverageRating();
      feedbackForm.reset();
      selectedRating = 0;
      updateStarsUI();
    }
  });

  function renderFeedbackList() {
    if (feedbacks.length === 0) {
      feedbackList.innerHTML = `<div class="no-feedback-msg">No feedback yet. Be the first to leave a review!</div>`;
      return;
    }
    feedbackList.innerHTML = feedbacks.map(feedback => `
      <div class="feedback-item" tabindex="0">
        <div class="feedback-header">
          <div class="feedback-stars">
            ${renderStars(feedback.rating)}
          </div>
        </div>
        <div class="feedback-comment">${feedback.comment ? escapeHTML(feedback.comment) : '<span style="color:#ff69b4;font-style:italic;">(No comment)</span>'}</div>
      </div>
    `).join('');
  }

  function renderStars(rating) {
    let stars = '';
    for (let i = 1; i <= 5; i++) {
      stars += `<svg aria-hidden="true" viewBox="0 0 24 24" fill="${i <= rating ? '#ff69b4' : '#fff3'}" width="30" height="30"><path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"></path></svg>`;
    }
    return stars;
  }

  function updateAverageRating() {
    const ratings = feedbacks.filter(f => f.rating > 0).map(f => f.rating);
    const avg = ratings.length ? (ratings.reduce((a, b) => a + b, 0) / ratings.length) : 0;
    averageScoreEl.textContent = avg.toFixed(1);
    averageStarsEl.innerHTML = renderStars(Math.round(avg));
  }

  function escapeHTML(str) {
    return str.replace(/[&<>"']/g, function (m) {
      return ({
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#39;'
      })[m];
    });
  }

  // Initial render
  renderFeedbackList();
  updateAverageRating();
  updateStarsUI();
})();