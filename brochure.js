/* ACP shade card: ask Name + Mobile, send to MD Industries' Google Form (Sheet + email), then open the PDF. */
(function () {
  var FORM = 'https://docs.google.com/forms/d/e/1FAIpQLSezB3pLVdMpn2GTQlnd0f1-F3ltQbs81P8ZwIQ01pcr3ROooA/formResponse';
  var F_NAME = 'entry.1135174496', F_MOBILE = 'entry.1413203011', F_PAGE = 'entry.1246603321';
  var PDF = 'brochure/MD-Industries-ACP-Shade-Card-Vol6.pdf';

  var dlg = document.getElementById('lead-dialog');
  var form = document.getElementById('lead-form');
  var done = document.getElementById('lead-done');
  if (!dlg || !form) return;
  var nameEl = form.querySelector('[name=name]');
  var mobEl = form.querySelector('[name=mobile]');
  var nameErr = document.getElementById('lead-name-err');
  var mobErr = document.getElementById('lead-mob-err');

  function openPdf() {
    var a = document.createElement('a');
    a.href = PDF;
    a.setAttribute('download', 'MD-Industries-ACP-Shade-Card.pdf');
    a.rel = 'noopener';
    document.body.appendChild(a);
    a.click();
    a.remove();
  }
  function show() {
    form.hidden = false; done.hidden = true;
    nameErr.textContent = ''; mobErr.textContent = '';
    if (typeof dlg.showModal === 'function') dlg.showModal(); else dlg.setAttribute('open', '');
    setTimeout(function () { nameEl.focus(); }, 50);
  }
  function hide() { if (dlg.close) dlg.close(); else dlg.removeAttribute('open'); }

  document.querySelectorAll('[data-brochure]').forEach(function (el) {
    el.addEventListener('click', function (e) { e.preventDefault(); show(); });
  });
  dlg.querySelectorAll('[data-close]').forEach(function (el) { el.addEventListener('click', hide); });
  dlg.addEventListener('click', function (e) { if (e.target === dlg) hide(); });

  mobEl.addEventListener('input', function () {
    var v = mobEl.value.replace(/\D/g, '');
    if (v.length > 10 && (v.indexOf('91') === 0 || v.indexOf('0') === 0)) v = v.slice(-10);
    mobEl.value = v.slice(0, 10);
    mobErr.textContent = '';
  });
  nameEl.addEventListener('input', function () { nameErr.textContent = ''; });

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    var name = nameEl.value.trim().replace(/\s+/g, ' ');
    var mobile = mobEl.value.replace(/\D/g, '');
    var ok = true;
    if (name.length < 2) { nameErr.textContent = 'Apna naam likhein / Please enter your name'; ok = false; }
    if (!/^[6-9]\d{9}$/.test(mobile)) { mobErr.textContent = 'Sahi 10 digit mobile number likhein (6, 7, 8 ya 9 se shuru)'; ok = false; }
    if (!ok) { (name.length < 2 ? nameEl : mobEl).focus(); return; }

    var body = new URLSearchParams();
    body.append(F_NAME, name);
    body.append(F_MOBILE, mobile);
    body.append(F_PAGE, location.hostname + location.pathname);
    try {
      fetch(FORM, { method: 'POST', mode: 'no-cors', keepalive: true, body: body });
    } catch (err) {
      try { navigator.sendBeacon(FORM, body); } catch (e2) {}
    }
    form.hidden = true; done.hidden = false;
    openPdf();
  });
})();
