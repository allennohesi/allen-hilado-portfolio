document.addEventListener('DOMContentLoaded', () => {
  // 1. Theme Toggle (Dark / Light)
  const themeToggle = document.getElementById('themeToggle');
  const htmlEl = document.documentElement;

  themeToggle.addEventListener('click', () => {
    if (htmlEl.classList.contains('dark')) {
      htmlEl.classList.remove('dark');
      htmlEl.classList.add('light');
    } else {
      htmlEl.classList.remove('light');
      htmlEl.classList.add('dark');
    }
  });

  // 2. Print / Save CV Button
  const printBtn = document.getElementById('printResumeBtn');
  if (printBtn) {
    printBtn.addEventListener('click', () => {
      window.print();
    });
  }

  // 3. Interactive Terminal Tabs
  const termTabs = document.querySelectorAll('.term-tab');
  const termPanes = document.querySelectorAll('.term-pane');

  termTabs.forEach((tab) => {
    tab.addEventListener('click', () => {
      const target = tab.getAttribute('data-tab');
      termTabs.forEach((t) => t.classList.remove('active'));
      termPanes.forEach((p) => p.classList.remove('active'));

      tab.classList.add('active');
      const activePane = document.getElementById(`tab-${target}`);
      if (activePane) activePane.classList.add('active');
    });
  });

  // 4. Experience Domain Filter
  const expFilterBtns = document.querySelectorAll('.exp-filter-btn');
  const expDomainBoxes = document.querySelectorAll('.exp-domain-box');

  expFilterBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      const filter = btn.getAttribute('data-exp-filter');
      expFilterBtns.forEach((b) => b.classList.remove('active'));
      btn.classList.add('active');

      expDomainBoxes.forEach((box) => {
        const domain = box.getAttribute('data-domain');
        if (filter === 'all' || domain === filter) {
          box.style.display = 'block';
        } else {
          box.style.display = 'none';
        }
      });
    });
  });

  // 5. Technical Skills Category Tabs & Live Search
  const skillTabs = document.querySelectorAll('.skill-tab');
  const skillCards = document.querySelectorAll('.skill-category-card');
  const skillSearch = document.getElementById('skillSearch');
  const allSkillBadges = document.querySelectorAll('.s-badge');

  let activeCategory = 'all';

  function filterSkills() {
    const query = (skillSearch.value || '').trim().toLowerCase();

    skillCards.forEach((card) => {
      const cat = card.getAttribute('data-category');
      const matchesCat = activeCategory === 'all' || cat === activeCategory;

      const badges = card.querySelectorAll('.s-badge');
      let anyBadgeMatches = false;

      badges.forEach((badge) => {
        const text = badge.textContent.toLowerCase();
        if (!query) {
          badge.classList.remove('highlight-match');
          badge.style.display = 'inline-block';
          anyBadgeMatches = true;
        } else if (text.includes(query)) {
          badge.classList.add('highlight-match');
          badge.style.display = 'inline-block';
          anyBadgeMatches = true;
        } else {
          badge.classList.remove('highlight-match');
          badge.style.display = 'none';
        }
      });

      if (matchesCat && anyBadgeMatches) {
        card.style.display = 'block';
      } else {
        card.style.display = 'none';
      }
    });
  }

  skillTabs.forEach((tab) => {
    tab.addEventListener('click', () => {
      activeCategory = tab.getAttribute('data-skill-cat');
      skillTabs.forEach((t) => t.classList.remove('active'));
      tab.classList.add('active');
      filterSkills();
    });
  });

  if (skillSearch) {
    skillSearch.addEventListener('input', filterSkills);
  }

  // 6. Copy to Clipboard with Toast
  const copyBtns = document.querySelectorAll('.copy-btn');
  const toast = document.getElementById('toast');
  let toastTimeout;

  function showToast(msg) {
    toast.textContent = msg;
    toast.classList.add('show');
    clearTimeout(toastTimeout);
    toastTimeout = setTimeout(() => {
      toast.classList.remove('show');
    }, 2400);
  }

  copyBtns.forEach((btn) => {
    btn.addEventListener('click', async () => {
      const value = btn.getAttribute('data-copy');
      try {
        await navigator.clipboard.writeText(value);
        showToast(`Copied: ${value}`);
      } catch {
        showToast(`Copied to clipboard!`);
      }
    });
  });

  // 7. Direct Recruiter Email Composer
  const inquiryForm = document.getElementById('inquiryForm');
  if (inquiryForm) {
    inquiryForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const name = document.getElementById('recruiterName').value.trim();
      const role = document.getElementById('roleType').value;
      const msg = document.getElementById('roleMessage').value.trim();

      const subject = encodeURIComponent(`Opportunity: ${role} — Inquiry from ${name}`);
      const body = encodeURIComponent(
        `Hi Allen,\n\n${msg || `We came across your portfolio and were impressed by your 7+ years of experience administering 28 on-premises applications and building enterprise systems at DSWD Field Office Caraga.`}\n\nBest regards,\n${name}`
      );

      window.location.href = `mailto:allenefrenotazahilado@gmail.com?subject=${subject}&body=${body}`;
    });
  }

  // 8. Project Output Screenshot Lightbox Modal
  const lightboxModal = document.getElementById('lightboxModal');
  const lightboxImg = document.getElementById('lightboxImg');
  const lightboxCaption = document.getElementById('lightboxCaption');
  const lightboxClose = document.getElementById('lightboxClose');
  const lightboxBackdrop = document.getElementById('lightboxBackdrop');
  const shotCards = document.querySelectorAll('.output-shot-card');

  function openLightbox(src, caption) {
    if (!lightboxModal || !lightboxImg) return;
    lightboxImg.src = src;
    if (lightboxCaption) lightboxCaption.textContent = caption || '';
    lightboxModal.removeAttribute('hidden');
    document.body.style.overflow = 'hidden';
  }

  function closeLightbox() {
    if (!lightboxModal) return;
    lightboxModal.setAttribute('hidden', '');
    if (lightboxImg) lightboxImg.src = '';
    document.body.style.overflow = '';
  }

  shotCards.forEach((card) => {
    card.addEventListener('click', () => {
      const src = card.getAttribute('data-lightbox-src');
      const caption = card.getAttribute('data-lightbox-caption');
      if (src) openLightbox(src, caption);
    });
  });

  if (lightboxClose) lightboxClose.addEventListener('click', closeLightbox);
  if (lightboxBackdrop) lightboxBackdrop.addEventListener('click', closeLightbox);
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && lightboxModal && !lightboxModal.hasAttribute('hidden')) {
      closeLightbox();
    }
  });
});
