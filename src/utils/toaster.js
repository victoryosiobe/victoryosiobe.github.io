function showToast(message, type = 'info') {
  const container = document.getElementById('toast-container');
  const toast = document.createElement('div');
  const theme = type === 'success' ? 'green' :
    type === 'error' ? 'red' :
    type === 'error' ? 'red' :
    type === 'warning' ? 'yellow' :
    'gray'
  
  toast.className = `
    relative flex items-center gap-2 px-3 py-2 bg-black/50 border-2 border-${theme}-500/40 rounded-xl shadow-lg
    text-white text-sm select-none
  `;
  toast.innerHTML = `
    <span class="flex-1">${message}</span>
    <button class="text-white text-lg font-bold opacity-70 hover:opacity-100">×</button>
  `;
  
  // Set initial styles for entrance animation
  toast.style.opacity = 0;
  toast.style.transform = 'translateY(-20px)';
  
  container.appendChild(toast);
  requestAnimationFrame(() => {
    toast.style.opacity = 1;
    toast.style.transition = 'transform 0.3s ease-out';
    toast.style.transform = 'translateY(0)';
  });
  
  // Auto-remove after 5s
  let autoRemove = setTimeout(() => fadeOut(toast), 5000);
  
  // Close button (desktop)
  toast.querySelector('button').addEventListener('click', () => fadeOut(toast));
  
  // ===== Drag logic (mobile + desktop) =====
  let startX = 0,
    startY = 0,
    currentX = 0,
    currentY = 0,
    dragging = false,
    animating = false,
    animationId = null,
    dragThres = 70;
  
  const onStart = (x, y) => {
    startX = x;
    startY = y;
    
    dragging = true;
    clearTimeout(autoRemove);
  };
  
  const onMove = (x, y) => {
    if (!dragging) return;
    currentX = x - startX;
    currentY = y - startY;
    
    if (!animating) {
      animating = true;
      animationId = requestAnimationFrame(update);
    }
  };
  
  const onEnd = () => {
    if (!dragging) return;
    if (animationId) {
      cancelAnimationFrame(animationId);
      animationId = null;
    }
    animating = false;
    dragging = false;
    
    if (Math.abs(currentX) > dragThres) {
      fadeOut(toast);
      return
    }
    if (Math.abs(currentY) > dragThres) {
      fadeOut(toast);
      return
    }
    
    toast.style.transform = 'translateX(0px) translateY(0px)'; // Reset fully;
    toast.style.opacity = 1;
    currentX = 0; // Reset for potential re-drag
    currentY = 0; //here, too
    autoRemove = setTimeout(() => fadeOut(toast), 3000);
    
  };
  
  const update = () => {
    toast.style.transform = `translateX(${currentX}px) translateY(${currentY}px)`;
    toast.style.opacity = `${Math.max(0, 1 - Math.abs(currentX + currentY) / dragThres)}`;
    animating = false;
    if (dragging) {
      animating = true;
      animationId = requestAnimationFrame(update);
    }
  };
  
  // Touch events
  toast.addEventListener('touchstart', e => onStart(e.touches[0].clientX, e.touches[0].clientY));
  toast.addEventListener('touchmove', e => onMove(e.touches[0].clientX, e.touches[0].clientY));
  toast.addEventListener('touchend', onEnd);
  
  // Mouse events (desktop)
  toast.addEventListener('mousedown', e => onStart(e.clientX, e.clientY));
  window.addEventListener('mousemove', e => onMove(e.clientX, e.clientY));
  window.addEventListener('mouseup', onEnd);
  
  function fadeOut(el) {
    el.style.opacity = 0;
    el.style.transform = `translateX(${currentX}px) translateY(${currentY}px)`; // Preserve X, Y for smoother dismiss if dragged
    setTimeout(() => el.remove(), 300);
  }
}