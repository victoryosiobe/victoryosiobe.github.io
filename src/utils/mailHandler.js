const form = document.getElementById('mail-form');

form.addEventListener('submit', async (e) => {
  e.preventDefault(); // stops page reload
  const formData = new FormData(form);
  showToast('Forwarded your message...', "info");
  form.reset();
  toggleMailSection("close"); //toggle close
  
  try {
    const response = await fetch('https://formspree.io/f/xgvpaqyq', {
      method: 'POST',
      body: formData,
      headers: {
        'Accept': 'application/json'
      }
    });
    const json = await response.json();
    
    if (response.ok) {
      showToast('Your Message has been recieved!', "success");
    } else {
      showToast('Failed to send message, retry it.', "error");
      fillFormFromFormData(form, formData);
      toggleMailSection("open"); //toggle open
      console.error(response);
    }
  } catch (err) {
    showToast('Something went wrong.', "error");
    fillFormFromFormData(form, formData);
    toggleMailSection("open"); //toggle open
    console.error(err);
  }
});

function fillFormFromFormData(form, formData) {
  for (const [name, value] of formData.entries()) {
    const field = form.elements[name];
    if (!field) continue;
    
    if (field.type === 'checkbox') {
      // Handle multiple checkboxes with the same name
      if (field.length) {
        Array.from(field).forEach(cb => cb.checked = cb.value === value);
      } else {
        field.checked = field.value === value;
      }
    } else if (field.type === 'radio') {
      Array.from(field).forEach(rb => rb.checked = rb.value === value);
    } else {
      field.value = value;
    }
  }
}