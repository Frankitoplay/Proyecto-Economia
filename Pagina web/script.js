(function () {
  'use strict';

  var nav = document.getElementById('nav');
  var burger = document.getElementById('burger');
  var menu = document.getElementById('menu');

  /* Sombra en la barra al hacer scroll */
  function onScroll() { nav.classList.toggle('scrolled', window.scrollY > 10); }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* Menú móvil */
  function setMenu(open) {
    menu.classList.toggle('open', open);
    burger.setAttribute('aria-expanded', open);
    burger.setAttribute('aria-label', open ? 'Cerrar menú' : 'Abrir menú');
  }
  burger.addEventListener('click', function () {
    setMenu(burger.getAttribute('aria-expanded') !== 'true');
  });
  menu.querySelectorAll('a').forEach(function (a) {
    a.addEventListener('click', function () { setMenu(false); });
  });

  /* Enlace activo según la sección visible */
  var links = menu.querySelectorAll('a[href^="#"]:not(.btn)');
  var sections = Array.prototype.map.call(links, function (a) {
    return document.querySelector(a.getAttribute('href'));
  });
  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (!e.isIntersecting) return;
        links.forEach(function (a) {
          a.classList.toggle('act', a.getAttribute('href') === '#' + e.target.id);
        });
      });
    }, { rootMargin: '-45% 0px -50% 0px' });
    sections.forEach(function (s) { if (s) io.observe(s); });
  }

  /* Demo de módulos: se suman y quitan según lo elegido */
  var chips = document.querySelectorAll('.chip');
  chips.forEach(function (chip) {
    chip.addEventListener('click', function () {
      var on = !chip.classList.contains('on');
      chip.classList.toggle('on', on);
      chip.setAttribute('aria-pressed', on);
      var mod = document.querySelector('.mod[data-mod="' + chip.dataset.mod + '"]');
      if (mod) mod.hidden = !on;
    });
  });

  /* Formulario de contacto: valida y abre el correo del usuario */
  var form = document.getElementById('form');
  var msg = document.getElementById('msg');
  var EMAIL = 'contacto@pymesystem.com.ar';

  function show(text, type) {
    msg.textContent = text;
    msg.className = 'msg ' + type;
  }

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    var f = form.elements, ok = true, first = null;
    ['nombre', 'email', 'mensaje'].forEach(function (n) {
      var el = f[n], v = el.value.trim();
      var valid = n === 'email' ? /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v) : v.length > 1;
      el.classList.toggle('err', !valid);
      if (!valid) { ok = false; first = first || el; }
    });
    if (!ok) {
      show('Completá los campos marcados con un nombre, un email válido y tu consulta.', 'bad');
      first.focus();
      return;
    }
    var subject = encodeURIComponent('Consulta de ' + f.nombre.value.trim());
    var body = encodeURIComponent(f.mensaje.value.trim() + '\n\nNombre: ' + f.nombre.value.trim() + '\nEmail: ' + f.email.value.trim());
    window.location.href = 'mailto:' + EMAIL + '?subject=' + subject + '&body=' + body;
    show('Abrimos tu correo con la consulta lista para enviar. ¡Gracias por escribirnos!', 'ok');
    form.reset();
  });

  /* Año del pie */
  document.getElementById('year').textContent = new Date().getFullYear();
})();
