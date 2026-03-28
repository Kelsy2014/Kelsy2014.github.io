/**
 * Mobile navigation toggle.
 * @param {HTMLButtonElement} btn - The hamburger button.
 * @param {HTMLUListElement} menu - The nav links list.
 * @returns {void}
 */
function initMobileNav(btn, menu) {
  btn.addEventListener('click', () => {
    const isOpen = menu.classList.toggle('nav-open');
    btn.setAttribute('aria-expanded', String(isOpen));
    btn.setAttribute('aria-label', isOpen ? 'Close navigation menu' : 'Open navigation menu');
  });

  // Close menu when a nav link is followed
  menu.addEventListener('click', (e) => {
    if (e.target.closest('a')) {
      menu.classList.remove('nav-open');
      btn.setAttribute('aria-expanded', 'false');
      btn.setAttribute('aria-label', 'Open navigation menu');
    }
  });
}

/**
 * Smooth-scroll all anchor links that point to an on-page section.
 * @returns {void}
 */
function initSmoothScroll() {
  document.addEventListener('click', (e) => {
    const anchor = e.target.closest('a[href^="#"]');
    if (!anchor) return;
    const target = document.querySelector(anchor.getAttribute('href'));
    if (!target) return;
    e.preventDefault();
    target.scrollIntoView({ behavior: 'smooth', block: 'start' });
  });
}

/**
 * Contact form — submit to Formspree via fetch, validate required fields,
 * and replace the form with a confirmation message on success.
 * @param {HTMLFormElement} form - The contact form element.
 * @returns {void}
 */
function initContactForm(form) {
  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const firstName = /** @type {HTMLInputElement} */ (document.getElementById('first-name'));
    const email     = /** @type {HTMLInputElement} */ (document.getElementById('email'));
    const service   = /** @type {HTMLSelectElement} */ (document.getElementById('service'));

    if (!firstName.value.trim() || !email.value.trim() || !service.value) {
      firstName.reportValidity?.();
      email.reportValidity?.();
      service.reportValidity?.();
      return;
    }

    const btn = form.querySelector('.btn-submit');
    if (btn) btn.setAttribute('disabled', 'true');

    try {
      const res = await fetch(form.action, {
        method: 'POST',
        body: new FormData(form),
        headers: { Accept: 'application/json' },
      });

      if (!res.ok) throw new Error('Network response was not ok');

      const msg = document.createElement('div');
      msg.className = 'form-success';

      const heading = document.createElement('p');
      heading.className = 'form-success-heading';
      heading.textContent = 'Message sent!';

      const body = document.createElement('p');
      body.textContent = "Thanks for reaching out. I'll be in touch within 24–48 hours.";

      msg.appendChild(heading);
      msg.appendChild(body);
      form.replaceWith(msg);
    } catch {
      if (btn) btn.removeAttribute('disabled');
      const err = form.querySelector('.form-error') || document.createElement('p');
      err.className = 'form-error';
      err.textContent = 'Something went wrong — please try emailing directly.';
      if (!form.contains(err)) form.appendChild(err);
    }
  });
}

const btn  = /** @type {HTMLButtonElement|null} */ (document.getElementById('btn-menu'));
const menu = /** @type {HTMLUListElement|null}  */ (document.getElementById('nav-links'));
const form = /** @type {HTMLElement|null}        */ (document.getElementById('contact-form'));

if (btn && menu) initMobileNav(btn, menu);
initSmoothScroll();
if (form) initContactForm(form);
