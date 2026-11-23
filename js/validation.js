const orderForm = document.getElementById('order-form');

if (orderForm) {
  const nameInput = document.getElementById('order-name');
  const emailInput = document.getElementById('order-email');
  const phoneInput = document.getElementById('order-phone');
  const agreementInput = document.getElementById('order-agreement');
  const submitBtn = orderForm.querySelector('button[type="submit"]');

  const nameError = document.getElementById('name-error');
  const emailError = document.getElementById('email-error');
  const phoneError = document.getElementById('phone-error');
  const agreementError = document.getElementById('agreement-error');
  const successMessage = document.getElementById('success-message');

  function setFieldError(input, errorEl, message) {
    if (!input || !errorEl) return;
    errorEl.textContent = message;
    errorEl.style.display = message ? 'block' : 'none';
    if (message) {
      input.setAttribute('aria-invalid', 'true');
      if (errorEl.id) input.setAttribute('aria-describedby', errorEl.id);
    } else {
      input.removeAttribute('aria-invalid');
    }
  }

  function normalizeDigits(raw) {
    const digits = raw.replace(/\D/g, '');
    if (!digits) return '';
    if (digits.startsWith('8')) return `7${digits.slice(1, 11)}`;
    if (digits.startsWith('7')) return digits.slice(0, 11);
    return `7${digits.slice(0, 10)}`;
  }

  function formatPhone(raw) {
    const digits = normalizeDigits(raw);
    if (!digits) return '';
    const rest = digits.slice(1);
    let out = '+7';
    if (rest.length > 0) out += ` (${rest.slice(0, 3)}`;
    if (rest.length >= 3) out += ')';
    if (rest.length > 3) out += ` ${rest.slice(3, 6)}`;
    if (rest.length > 6) out += `-${rest.slice(6, 8)}`;
    if (rest.length > 8) out += `-${rest.slice(8, 10)}`;
    return out;
  }

  function validateName() {
    if (!nameInput) return true;
    const val = nameInput.value.trim();
    if (val.length < 2) {
      setFieldError(nameInput, nameError, 'Введите имя (минимум 2 символа).');
      return false;
    }
    setFieldError(nameInput, nameError, '');
    return true;
  }

  function validateEmail() {
    if (!emailInput) return true;
    const val = emailInput.value.trim();
    const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRe.test(val)) {
      setFieldError(emailInput, emailError, 'Введите корректный e-mail.');
      return false;
    }
    setFieldError(emailInput, emailError, '');
    return true;
  }

  function validatePhone() {
    if (!phoneInput) return true;
    const digits = normalizeDigits(phoneInput.value);
    if (digits.length !== 11 || !digits.startsWith('7')) {
      setFieldError(phoneInput, phoneError, 'Введите корректный телефон в формате +7 (900) 000-00-00.');
      return false;
    }
    setFieldError(phoneInput, phoneError, '');
    return true;
  }

  function validateAgreement() {
    if (!agreementInput) return true;
    if (!agreementInput.checked) {
      setFieldError(agreementInput, agreementError, 'Необходимо согласие на обработку персональных данных.');
      return false;
    }
    setFieldError(agreementInput, agreementError, '');
    return true;
  }

  if (phoneInput) {
    phoneInput.addEventListener('input', () => {
      const caret = phoneInput.selectionStart ?? phoneInput.value.length;
      const digitsLeft = phoneInput.value.slice(0, caret).replace(/\D/g, '').length;
      const formatted = formatPhone(phoneInput.value);
      phoneInput.value = formatted;

      let pos = formatted.length;
      let seen = 0;
      for (let i = 0; i < formatted.length; i += 1) {
        if (/\d/.test(formatted[i])) {
          seen += 1;
          if (seen >= digitsLeft) {
            pos = i + 1;
            break;
          }
        }
      }
      phoneInput.setSelectionRange(pos, pos);
      validatePhone();
    });
  }

  if (nameInput) nameInput.addEventListener('input', validateName);
  if (emailInput) emailInput.addEventListener('input', validateEmail);
  if (agreementInput) agreementInput.addEventListener('change', validateAgreement);

  orderForm.addEventListener('submit', (event) => {
    event.preventDefault();
    if (successMessage) successMessage.hidden = true;

    const validName = validateName();
    const validEmail = validateEmail();
    const validPhone = validatePhone();
    const validAgreement = validateAgreement();

    if (!validName || !validEmail || !validPhone || !validAgreement) {
      return;
    }

    if (submitBtn) submitBtn.disabled = true;

    const applicantName = nameInput ? nameInput.value.trim() : 'покупатель';

    window.setTimeout(() => {
      if (successMessage) {
        successMessage.textContent = `Заявка подготовлена для ${applicantName}! Данные не отправлены на сервер (учебная имитация).`;
        successMessage.hidden = false;
      }
      if (submitBtn) submitBtn.disabled = false;
      orderForm.reset();
    }, 400);
  });
}