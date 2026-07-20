/* Marrelay — shared site behaviour: scroll reveal, FAQ, lead form */
(function(){
  'use strict';

  /* ---------- scroll reveal ---------- */
  function initReveal(){
    var els = document.querySelectorAll('[data-reveal], [data-reveal-stagger]');
    if(!('IntersectionObserver' in window) || !els.length){
      els.forEach(function(el){ el.classList.add('in'); });
      return;
    }
    var io = new IntersectionObserver(function(entries){
      entries.forEach(function(e){
        if(e.isIntersecting){ e.target.classList.add('in'); io.unobserve(e.target); }
      });
    }, { threshold:0.12, rootMargin:'0px 0px -8% 0px' });
    els.forEach(function(el){ io.observe(el); });
  }

  /* ---------- FAQ accordion ---------- */
  function initFaq(){
    document.querySelectorAll('.faq-item').forEach(function(item){
      var q = item.querySelector('.q');
      if(!q) return;
      q.addEventListener('click', function(){
        var wasOpen = item.classList.contains('open');
        var group = item.closest('.faq-list') || document;
        group.querySelectorAll('.faq-item').forEach(function(i){ i.classList.remove('open'); });
        if(!wasOpen) item.classList.add('open');
      });
    });
  }

  /* ---------- chip groups (multi + single) ---------- */
  function initChips(){
    document.querySelectorAll('.chips').forEach(function(group){
      var multi = group.getAttribute('data-multi') === 'true';
      group.querySelectorAll('input').forEach(function(input){
        input.addEventListener('change', function(){ syncChips(group, multi); });
      });
      group.querySelectorAll('label').forEach(function(label){
        label.addEventListener('click', function(){
          setTimeout(function(){ syncChips(group, multi); }, 0);
        });
      });
      syncChips(group, multi);
    });
  }
  function syncChips(group, multi){
    group.querySelectorAll('label').forEach(function(label){
      var input = label.querySelector('input');
      if(input && input.checked) label.classList.add('checked');
      else label.classList.remove('checked');
    });
  }

  /* ---------- lead form ---------- */
  function initLeadForm(){
    document.querySelectorAll('.lead-form').forEach(function(form){
      var btn = form.querySelector('.form-submit');
      if(!btn) return;
      form.addEventListener('submit', function(e){
        e.preventDefault();
        if(!validate(form)) return;
        var success = form.querySelector('.form-success');
        form.classList.add('done');
        if(success){
          success.classList.add('show');
          // personalise
          var nameEl = form.querySelector('[name="name"]');
          var hi = success.querySelector('[data-name-slot]');
          if(nameEl && hi){
            var first = (nameEl.value || '').trim().split(' ')[0];
            if(first) hi.textContent = first;
          }
        }
        if(typeof success.scrollIntoView === 'function'){
          // intentionally NOT using scrollIntoView per guidance — gentle window scroll instead
          var top = form.getBoundingClientRect().top + window.pageYOffset - 120;
          window.scrollTo({ top: top, behavior:'smooth' });
        }
      });
      // live-clear invalid
      form.querySelectorAll('input, select, textarea').forEach(function(el){
        el.addEventListener('input', function(){
          var f = el.closest('.field');
          if(f) f.classList.remove('invalid');
        });
        el.addEventListener('change', function(){
          var f = el.closest('.field');
          if(f) f.classList.remove('invalid');
        });
      });
    });
  }
  function validate(form){
    var ok = true;
    form.querySelectorAll('.field[data-required]').forEach(function(field){
      var control = field.querySelector('input, select, textarea');
      var valid = true;
      if(field.querySelector('.chips')){
        valid = !!field.querySelector('.chips input:checked');
      } else if(control){
        valid = control.value.trim() !== '';
        if(valid && control.type === 'email'){
          valid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(control.value.trim());
        }
      }
      if(!valid){ field.classList.add('invalid'); ok = false; }
      else field.classList.remove('invalid');
    });
    if(!ok){
      var firstBad = form.querySelector('.field.invalid');
      if(firstBad){
        var top = firstBad.getBoundingClientRect().top + window.pageYOffset - 140;
        window.scrollTo({ top: top, behavior:'smooth' });
      }
    }
    return ok;
  }

  /* ---------- prefill service from query string ---------- */
  function initServicePrefill(){
    var params = new URLSearchParams(window.location.search);
    var svc = params.get('service');
    if(!svc) return;
    document.querySelectorAll('.chips[data-group="service"]').forEach(function(group){
      var input = group.querySelector('input[value="'+svc+'"]');
      if(input){ input.checked = true; syncChips(group, group.getAttribute('data-multi')==='true'); }
    });
  }

  /* ---------- mobile nav: slide-in drawer ---------- */
  function initNav(){
    var nav = document.querySelector('nav.main');
    if(!nav || nav.__mnav) return;
    nav.__mnav = true;
    var navCta = nav.querySelector('.nav-cta');
    var links = nav.querySelector('.nav-links');
    if(!navCta || !links) return;

    var arrowSVG = '<svg viewBox="0 0 14 14" fill="none" stroke="currentColor" stroke-width="1.7"><path d="M3 11 L11 3 M5 3 H11 V9"/></svg>';

    // hamburger button in the bar
    var btn = document.createElement('button');
    btn.className = 'nav-toggle';
    btn.type = 'button';
    btn.setAttribute('aria-label', 'Open menu');
    btn.setAttribute('aria-expanded', 'false');
    btn.innerHTML = '<span></span><span></span><span></span>';
    navCta.appendChild(btn);

    // drawer
    var drawer = document.createElement('aside');
    drawer.className = 'm-nav';
    drawer.setAttribute('aria-hidden', 'true');
    drawer.setAttribute('aria-label', 'Site menu');

    var top = document.createElement('div');
    top.className = 'm-nav-top';
    top.innerHTML = '<span class="m-brand"><span class="lm"><img src="assets/martek-mark.png" alt="Marrelay"></span><span class="bt">Menu</span></span>' +
      '<button class="m-close" type="button" aria-label="Close menu"><svg viewBox="0 0 18 18" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M4 4 L14 14 M14 4 L4 14" stroke-linecap="round"/></svg></button>';

    var list = document.createElement('nav');
    list.className = 'm-links';
    // clone the main service links
    links.querySelectorAll('a').forEach(function(a){
      var row = document.createElement('a');
      row.href = a.getAttribute('href');
      if(a.classList.contains('active')) row.classList.add('active');
      row.innerHTML = '<span>' + a.innerHTML + '</span><span class="ar">' + arrowSVG + '</span>';
      list.appendChild(row);
    });
    // add Pricing (from the ghost button) as a row
    var ghost = navCta.querySelector('.btn-ghost');
    if(ghost){
      var prow = document.createElement('a');
      prow.href = ghost.getAttribute('href');
      prow.innerHTML = '<span>Pricing</span><span class="ar">' + arrowSVG + '</span>';
      list.appendChild(prow);
    }

    // footer: primary CTA + email
    var primary = navCta.querySelector('.btn-primary');
    var ctaHref = primary ? primary.getAttribute('href') : 'contact.html';
    var foot = document.createElement('div');
    foot.className = 'm-foot';
    foot.innerHTML = '<a href="' + ctaHref + '" class="btn btn-primary">Book a call ' + arrowSVG + '</a>' +
      '<p class="m-mail">or email <a href="mailto:hello@marrelay.com">hello@marrelay.com</a></p>';

    var dots = document.createElement('div'); dots.className = 'dotline';
    drawer.appendChild(dots);
    drawer.appendChild(top);
    drawer.appendChild(list);
    drawer.appendChild(foot);

    var backdrop = document.createElement('div');
    backdrop.className = 'm-backdrop';

    document.body.appendChild(backdrop);
    document.body.appendChild(drawer);

    function open(){
      document.body.classList.add('m-open');
      btn.setAttribute('aria-expanded', 'true');
      drawer.setAttribute('aria-hidden', 'false');
    }
    function close(){
      document.body.classList.remove('m-open');
      btn.setAttribute('aria-expanded', 'false');
      drawer.setAttribute('aria-hidden', 'true');
    }
    btn.addEventListener('click', function(){
      document.body.classList.contains('m-open') ? close() : open();
    });
    top.querySelector('.m-close').addEventListener('click', close);
    backdrop.addEventListener('click', close);
    list.querySelectorAll('a').forEach(function(a){ a.addEventListener('click', close); });
    foot.querySelector('.btn').addEventListener('click', close);
    document.addEventListener('keydown', function(e){ if(e.key === 'Escape') close(); });
    window.addEventListener('resize', function(){ if(window.innerWidth > 980) close(); });
  }

  function init(){
    initNav();
    initReveal();
    initFaq();
    initChips();
    initLeadForm();
    initServicePrefill();
  }
  if(document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();
