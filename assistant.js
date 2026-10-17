/* Assistant de la boutique : répond avec les informations réelles du site (config.js, produits, zones de livraison).
   Aucune IA externe, aucun coût. Pour ajouter vos propres réponses, voir « faq » dans config.js. */
(function () {
  'use strict';
  var CFGA = window.SHOP || {};
  var SHOPNAME = CFGA.name || 'la boutique';
  var WA = String(CFGA.whatsapp || '').replace(/\D/g, '');
  var TEL = String(CFGA.phone || CFGA.whatsapp || '').replace(/\D/g, '');

  /* ---------- Styles ---------- */
  var css = [
    '.as-fab{position:fixed;right:14px;bottom:calc(14px + env(safe-area-inset-bottom));z-index:70;display:inline-flex;align-items:center;gap:8px;min-height:52px;padding:0 20px 0 16px;border:0;border-radius:999px;background:#FF9503;color:#111;font:700 16px "DM Sans",system-ui,sans-serif;cursor:pointer;box-shadow:0 8px 24px rgba(0,0,0,.35)}',
    '.as-fab svg{width:22px;height:22px}',
    '.as-fab:focus-visible,.as-x:focus-visible,.as-chip:focus-visible,.as-send:focus-visible,.as-in:focus-visible,.as-act:focus-visible{outline:3px solid #fff;outline-offset:2px;box-shadow:0 0 0 5px #111}',
    '.as-panel{position:fixed;right:12px;bottom:calc(76px + env(safe-area-inset-bottom));z-index:75;width:min(400px,calc(100vw - 24px));height:min(600px,calc(100vh - 110px));display:flex;flex-direction:column;background:#fff;color:#111;border-radius:22px;overflow:hidden;box-shadow:0 16px 48px rgba(0,0,0,.45);font:400 16px/1.45 "DM Sans",system-ui,sans-serif}',
    '.as-panel[hidden]{display:none}',
    '.as-head{display:flex;align-items:center;gap:12px;padding:14px 16px;background:linear-gradient(100deg,#000 0%,#160B00 38%,#B35200 78%,#FF9503 100%);color:#fff}',
    '.as-head img{width:42px;height:42px;border-radius:50%;background:#000;flex:none}',
    '.as-head div{flex:1;min-width:0}',
    '.as-head strong{display:block;font:800 18px "Bricolage Grotesque","DM Sans",sans-serif;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}',
    '.as-head span{font-size:13px;opacity:.9}',
    '.as-x{flex:none;width:44px;height:44px;border:0;border-radius:50%;background:rgba(255,255,255,.18);color:#fff;font-size:26px;line-height:1;cursor:pointer}',
    '.as-log{flex:1;overflow-y:auto;padding:14px;display:flex;flex-direction:column;gap:10px;background:#FAF8F5}',
    '.as-msg{max-width:88%;padding:10px 14px;border-radius:16px;white-space:pre-line;word-wrap:break-word}',
    '.as-bot{align-self:flex-start;background:#EFEDE8;border-bottom-left-radius:4px}',
    '.as-me{align-self:flex-end;background:#FF9503;color:#111;border-bottom-right-radius:4px;font-weight:500}',
    '.as-acts{display:flex;flex-wrap:wrap;gap:8px;margin-top:8px}',
    '.as-act{display:inline-flex;align-items:center;justify-content:center;min-height:44px;padding:0 16px;border-radius:999px;border:0;background:#111;color:#fff;font:700 14px "DM Sans",system-ui,sans-serif;text-decoration:none;cursor:pointer}',
    '.as-act.alt{background:#fff;color:#111;box-shadow:inset 0 0 0 2px #111}',
    '.as-act:disabled{opacity:.55;cursor:not-allowed}',
    '.as-card{align-self:flex-start;width:92%;background:#fff;border:1px solid #E6E1DA;border-radius:14px;padding:12px}',
    '.as-card b{display:block}',
    '.as-card small{display:block;color:#4A4A4A;font-size:14px}',
    '.as-tag{display:inline-block;margin-top:4px;padding:1px 10px;border-radius:999px;font-size:13px;font-weight:700;background:#DCEFE3;color:#14502F}',
    '.as-tag.off{background:#F7D9D3;color:#8A1C14}',
    '.as-chips{display:flex;gap:8px;overflow-x:auto;padding:10px 12px 4px;background:#fff;border-top:1px solid #E6E1DA;scrollbar-width:none}',
    '.as-chips::-webkit-scrollbar{display:none}',
    '.as-chip{flex:none;min-height:40px;padding:0 14px;border-radius:999px;border:1px solid #CFC8BE;background:#fff;color:#111;font:700 14px "DM Sans",system-ui,sans-serif;cursor:pointer}',
    '.as-form{display:flex;gap:8px;padding:10px 12px 12px;background:#fff}',
    '.as-in{flex:1;min-width:0;min-height:46px;padding:0 14px;border:1px solid #B9B2A8;border-radius:12px;font:inherit;color:#111;background:#fff}',
    '.as-send{flex:none;min-height:46px;padding:0 18px;border:0;border-radius:12px;background:#FF9503;color:#111;font:700 16px "DM Sans",system-ui,sans-serif;cursor:pointer}',
    '.as-dots{display:inline-flex;gap:4px}.as-dots i{width:7px;height:7px;border-radius:50%;background:#777;animation:asb 1s infinite}.as-dots i:nth-child(2){animation-delay:.15s}.as-dots i:nth-child(3){animation-delay:.3s}',
    '@keyframes asb{0%,80%,100%{opacity:.3}40%{opacity:1}}',
    '@media (prefers-reduced-motion:reduce){.as-dots i{animation:none}}',
    '@media (max-width:480px){.as-panel{right:8px;left:8px;width:auto;bottom:calc(74px + env(safe-area-inset-bottom));height:min(78vh,620px)}}'
  ].join('\n');
  var st = document.createElement('style'); st.textContent = css; document.head.appendChild(st);

  /* ---------- Outils ---------- */
  function el(tag, cls, text) { var e = document.createElement(tag); if (cls) e.className = cls; if (text != null) e.textContent = text; return e; }
  function norm(t) { return String(t || '').toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/[’']/g, ' '); }
  function stem(w) { return w.length > 3 ? w.replace(/(s|x)$/, '') : w; }
  var STOP = ('le la les de du des un une et ou pour je tu vous nous veux voudrais voulez cherche chercher avez avoir est ce que qui quoi quel quelle quels quelles ' +
    'combien prix coute cout cher pas en au aux sur dans avec mon ma mes ton ta tes votre vos il elle on y a ai suis svp stp bonjour salut merci ' +
    'vendez vendre acheter achat prendre trouver dispo disponible stock produit produits article articles voir montrer montre donne donner moi toi').split(' ');
  function tokens(t) { return norm(t).split(/[^a-z0-9]+/).filter(function (w) { return w.length >= 3 && STOP.indexOf(w) < 0; }).map(stem); }
  function has(text, words) { for (var i = 0; i < words.length; i++) if (text.indexOf(words[i]) >= 0) return true; return false; }
  function gnfS(n) { return Number(n).toLocaleString('fr-FR') + ' GNF'; }
  function products() { return (typeof state !== 'undefined' && state.products) || []; }
  function zones() { return (typeof state !== 'undefined' && state.zones) || {}; }

  /* ---------- Fenêtre ---------- */
  var fab = el('button', 'as-fab'); fab.type = 'button'; fab.setAttribute('aria-expanded', 'false'); fab.setAttribute('aria-controls', 'as-panel');
  fab.innerHTML = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M21 12a8 8 0 0 1-11.6 7.1L4 20l1-4.6A8 8 0 1 1 21 12z"/></svg>';
  fab.appendChild(el('span', '', 'Assistant'));
  var panel = el('div', 'as-panel'); panel.id = 'as-panel'; panel.hidden = true; panel.setAttribute('role', 'dialog'); panel.setAttribute('aria-label', 'Assistant ' + SHOPNAME);
  var head = el('div', 'as-head');
  var logo = el('img'); logo.src = 'logo-small.webp'; logo.alt = ''; logo.width = 42; logo.height = 42;
  var ht = el('div'); ht.appendChild(el('strong', '', 'Assistant ' + SHOPNAME)); ht.appendChild(el('span', '', 'Répond tout de suite'));
  var xb = el('button', 'as-x', '×'); xb.type = 'button'; xb.setAttribute('aria-label', 'Fermer l\'assistant');
  head.appendChild(logo); head.appendChild(ht); head.appendChild(xb);
  var log = el('div', 'as-log'); log.setAttribute('role', 'log'); log.setAttribute('aria-live', 'polite');
  var chips = el('div', 'as-chips');
  var form = el('form', 'as-form'); form.setAttribute('novalidate', '');
  var inp = el('input', 'as-in'); inp.type = 'text'; inp.maxLength = 200; inp.placeholder = 'Écrire un message…'; inp.setAttribute('aria-label', 'Votre message'); inp.autocomplete = 'off';
  var sb = el('button', 'as-send', 'Envoyer'); sb.type = 'submit';
  form.appendChild(inp); form.appendChild(sb);
  panel.appendChild(head); panel.appendChild(log); panel.appendChild(chips); panel.appendChild(form);
  document.body.appendChild(panel); document.body.appendChild(fab);

  function scroll() { log.scrollTop = log.scrollHeight; }
  function bot(text, actions) {
    var m = el('div', 'as-msg as-bot', text);
    if (actions && actions.length) {
      var box = el('div', 'as-acts');
      actions.forEach(function (a) { box.appendChild(a); });
      m.appendChild(box);
    }
    log.appendChild(m); scroll(); return m;
  }
  function me(text) { log.appendChild(el('div', 'as-msg as-me', text)); scroll(); }
  function link(label, href, alt, newTab) {
    var a = el('a', 'as-act' + (alt ? ' alt' : ''), label); a.href = href;
    if (newTab) { a.target = '_blank'; a.rel = 'noopener'; }
    return a;
  }
  function btn(label, fn, alt) { var b = el('button', 'as-act' + (alt ? ' alt' : ''), label); b.type = 'button'; b.addEventListener('click', fn); return b; }
  function waLink(label, msg) { return WA ? link(label || 'Écrire sur WhatsApp', 'https://wa.me/' + WA + (msg ? '?text=' + encodeURIComponent(msg) : ''), false, true) : null; }
  function contactActs(extraMsg) {
    var a = [];
    var w = waLink('Écrire sur WhatsApp', extraMsg); if (w) a.push(w);
    if (TEL) a.push(link('Appeler', 'tel:+' + TEL, true));
    return a;
  }
  function noInfo(what) {
    return bot('Je n\'ai pas encore ' + what + '. ' + (WA || TEL ? 'La boutique vous répondra directement :' : 'Revenez plus tard, ou contactez la boutique.'), contactActs());
  }
  function typing(cb) {
    var t = el('div', 'as-msg as-bot'); var d = el('span', 'as-dots'); d.appendChild(el('i')); d.appendChild(el('i')); d.appendChild(el('i')); t.appendChild(d);
    t.setAttribute('aria-label', 'L\'assistant écrit'); log.appendChild(t); scroll();
    setTimeout(function () { t.remove(); cb(); }, 450);
  }

  /* ---------- Réponses ---------- */
  var A = {};
  A.hello = function () {
    bot('Bonjour et bienvenue chez ' + SHOPNAME + ' ! Je peux vous renseigner sur les produits, les prix, la livraison, le paiement et votre commande. Touchez une question ci-dessous, ou écrivez un mot (par exemple « robe »).');
  };
  A.thanks = function () { bot('Avec plaisir ! Si vous avez une autre question, je suis là. Bon shopping chez ' + SHOPNAME + ' 😊'); };
  A.how = function () {
    bot('Pour commander, c\'est simple :\n1. Choisissez vos produits et touchez « Ajouter au panier ».\n2. Descendez à « Votre commande » : indiquez votre nom, votre téléphone, votre commune et un repère.\n3. Choisissez le paiement : à la livraison, Orange Money ou MTN.\n4. Touchez « Confirmer la commande » : vous recevez un numéro de commande (par exemple CMD-001).\n5. Envoyez-nous le message préparé sur WhatsApp, la boutique confirme et organise la livraison.',
      [link('Aller au panier', '#panier', true)]);
  };
  A.delivery = function (q) {
    var z = zones(), names = Object.keys(z);
    if (!names.length) { noInfo('la liste des communes livrées'); return; }
    var found = names.filter(function (n) { return norm(q).indexOf(norm(n)) >= 0; });
    if (found.length) {
      bot(found.map(function (n) { return 'Livraison à ' + n + ' : ' + gnfS(z[n]) + '.'; }).join('\n') + '\nLe délai exact vous est confirmé par la boutique après votre commande.', contactActs());
      return;
    }
    var lines = names.map(function (n) { return '• ' + n + ' : ' + gnfS(z[n]); });
    bot('Nous livrons par commune, à domicile. Frais de livraison :\n' + lines.join('\n') + '\nLe prix s\'ajoute automatiquement à votre total quand vous choisissez votre commune. Le délai exact vous est confirmé par la boutique après votre commande.');
  };
  A.pay = function () {
    bot('Trois façons de payer :\n• À la livraison, en espèces.\n• Orange Money.\n• MTN Mobile Money.\nPour Orange Money ou MTN, la boutique vous indique le numéro à utiliser après votre commande, et prépare la livraison après réception du paiement.');
  };
  A.wholesale = function () {
    var ps = products().filter(function (p) { return p.price_gros != null && p.min_gros; });
    var txt = 'Nous vendons au détail et en gros. Le prix de gros s\'applique automatiquement quand vous prenez assez de pièces du même produit. Le nombre de pièces dépend du produit.';
    if (ps.length) {
      var ex = ps[0];
      txt += '\nExemple : « ' + ex.name + ' » est à ' + gnfS(ex.price_detail) + ' au détail, et ' + gnfS(ex.price_gros) + ' l\'unité à partir de ' + ex.min_gros + ' pièces.';
    }
    bot(txt + '\nDites-moi un produit et je vous donne ses prix.');
  };
  A.hours = function () {
    if (CFGA.hours) bot('Horaires de la boutique : ' + CFGA.hours + '.\nLe site de commande reste ouvert à tout moment.', contactActs());
    else noInfo('les horaires');
  };
  A.address = function () {
    if (CFGA.address) {
      var acts = [];
      if (CFGA.facebook && /^https:\/\//.test(CFGA.facebook)) acts.push(link('Notre page Facebook', CFGA.facebook, true, true));
      bot('Notre adresse : ' + CFGA.address + '.', acts.concat(contactActs()));
    } else noInfo('l\'adresse');
  };
  A.contact = function () {
    if (!WA && !TEL) { noInfo('le numéro de la boutique'); return; }
    bot('Vous pouvez joindre la boutique' + (TEL ? ' au +' + TEL : '') + ' :', contactActs());
  };
  A.track = function () {
    bot('Pour suivre votre commande, entrez son numéro (par exemple CMD-001) et votre téléphone sur la page de suivi.', [link('Suivre ma commande', 'suivi.html')]);
  };
  A.change = function () {
    bot('Pour modifier ou annuler une commande, contactez la boutique le plus vite possible en donnant votre numéro de commande (par exemple CMD-001). Une commande déjà préparée ou livrée ne peut plus être modifiée.', contactActs('Bonjour, je souhaite modifier ou annuler ma commande ' ));
  };
  A.returns = function () { noInfo('la politique de retour et d\'échange'); };
  A.cart = function () {
    var ls = (typeof lines === 'function') ? lines() : [];
    if (!ls.length) { bot('Votre panier est vide pour le moment. Choisissez un produit et touchez « Ajouter au panier ».'); return; }
    var sub = ls.reduce(function (a, l) { return a + l.total; }, 0);
    bot('Dans votre panier :\n' + ls.map(function (l) { return '• ' + l.qty + ' × ' + l.p.name + ' : ' + gnfS(l.total); }).join('\n') + '\nSous-total : ' + gnfS(sub) + ' (hors livraison).', [link('Passer la commande', '#panier')]);
  };
  A.catalog = function () {
    var ps = products();
    if (!ps.length) { bot('Les produits se chargent. Réessayez dans un instant.'); return; }
    var cats = {}; ps.forEach(function (p) { if (p.category) cats[p.category] = (cats[p.category] || 0) + 1; });
    var names = Object.keys(cats);
    var m = bot('Nous avons ' + ps.length + ' produit' + (ps.length > 1 ? 's' : '') + (names.length ? ' dans ces catégories :' : '.'), names.map(function (c) {
      return btn(c + ' (' + cats[c] + ')', function () { me(c); typing(function () { showProducts(ps.filter(function (p) { return p.category === c; }), 'Voici les produits de la catégorie « ' + c + ' » :'); }); }, true);
    }));
    return m;
  };
  function productCard(p) {
    var c = el('div', 'as-card');
    c.appendChild(el('b', '', p.name));
    c.appendChild(el('small', '', 'Détail : ' + gnfS(p.price_detail)));
    c.appendChild(el('small', '', 'Gros dès ' + p.min_gros + ' pièces : ' + gnfS(p.price_gros)));
    var off = p.in_stock === false;
    c.appendChild(el('span', 'as-tag' + (off ? ' off' : ''), off ? 'En rupture de stock' : 'Disponible'));
    var acts = el('div', 'as-acts');
    var add1 = btn(off ? 'Indisponible' : 'Ajouter au panier', function () {
      if (typeof add === 'function') { add(p.id, 1); add1.textContent = 'Ajouté ✓'; }
    });
    add1.disabled = off; acts.appendChild(add1);
    if (p.images && p.images.length && typeof openLightbox === 'function') acts.appendChild(btn('Voir les photos', function () { openLightbox(p, 0); }, true));
    c.appendChild(acts);
    log.appendChild(c); scroll();
  }
  function showProducts(list, intro) {
    var top = list.slice(0, 4);
    bot(intro);
    top.forEach(productCard);
    if (list.length > top.length) bot('Il y a ' + (list.length - top.length) + ' autre(s) produit(s). Précisez votre recherche, ou parcourez la liste sur la page.', [link('Voir tous les produits', '#produits', true)]);
  }
  function searchProducts(q) {
    var tk = tokens(q); if (!tk.length) return [];
    var res = products().map(function (p) {
      var hay = norm(p.name + ' ' + (p.category || '') + ' ' + (p.description || ''));
      var hayT = hay.split(/[^a-z0-9]+/).map(stem);
      var s = 0; tk.forEach(function (t) { if (hayT.indexOf(t) >= 0) s += 2; else if (hay.indexOf(t) >= 0) s += 1; });
      return { p: p, s: s };
    }).filter(function (r) { return r.s > 0; });
    res.sort(function (a, b) { return b.s - a.s; });
    return res.map(function (r) { return r.p; });
  }

  /* ---------- Compréhension ---------- */
  var INTENTS = [
    { id: 'thanks', w: ['merci', 'thanks', 'barka', 'cool super', 'parfait'], f: A.thanks },
    { id: 'hello', w: ['bonjour', 'bonsoir', 'salut', 'hello', 'coucou', 'salam', 'assalam', 'bonne journee'], f: A.hello, short: true },
    { id: 'track', w: ['suivre', 'suivi', 'statut', 'ou est ma commande', 'ma commande est', 'colis', 'cmd-', 'cmd '], f: A.track },
    { id: 'change', w: ['annuler', 'annulation', 'modifier ma commande', 'changer ma commande', 'erreur dans ma commande'], f: A.change },
    { id: 'returns', w: ['retour', 'echange', 'echanger', 'rembours', 'garantie', 'defectueux', 'abime', 'casse'], f: A.returns },
    { id: 'hours', w: ['horaire', 'heure', 'ouvert', 'ouvre', 'ferme', 'fermeture', 'ouverture', 'dimanche', 'samedi'], f: A.hours },
    { id: 'address', w: ['adresse', 'localisation', 'situe', 'ou etes', 'ou se trouve', 'trouver la boutique', 'magasin', 'venir', 'quartier', 'facebook', 'itineraire'], f: A.address },
    { id: 'contact', w: ['contact', 'numero', 'telephone', 'appeler', 'appel', 'whatsapp', 'joindre', 'parler a', 'responsable', 'vendeur'], f: A.contact },
    { id: 'pay', w: ['paiement', 'payer', 'paye', 'orange', 'mtn', 'mobile money', 'especes', 'cash', 'reglement', 'avance', 'acompte'], f: A.pay },
    { id: 'wholesale', w: ['gros', 'grossiste', 'revendre', 'revendeur', 'detail', 'quantite', 'carton', 'lot'], f: A.wholesale },
    { id: 'delivery', w: ['livr', 'frais', 'commune', 'delai', 'domicile', 'expedi', 'envoi', 'envoyer', 'kaloum', 'ratoma', 'matoto', 'dixinn', 'matam'], f: A.delivery },
    { id: 'how', w: ['comment commander', 'comment acheter', 'comment passer', 'passer commande', 'passer une commande', 'comment ca marche', 'comment faire', 'etapes', 'commander'], f: A.how },
    { id: 'cart', w: ['mon panier', 'panier'], f: A.cart },
    { id: 'catalog', w: ['catalogue', 'categorie', 'quels produits', 'que vendez', 'vendez vous', 'vous vendez', 'liste des produits', 'tous les produits', 'qu est ce que vous'], f: A.catalog }
  ];
  function custom(q) {
    var f = Array.isArray(CFGA.faq) ? CFGA.faq : [];
    var n = norm(q);
    for (var i = 0; i < f.length; i++) {
      var ks = (f[i].k || []).map(norm);
      if (f[i].a && ks.length && has(n, ks)) return f[i];
    }
    return null;
  }
  function answer(q) {
    var n = norm(q), c = custom(q);
    if (c) { bot(String(c.a), contactActs()); return; }
    var best = null, bs = 0;
    INTENTS.forEach(function (it) {
      var s = 0; it.w.forEach(function (w) { if (n.indexOf(w) >= 0) s += w.length > 5 ? 2 : 1; });
      if (it.short && n.split(/\s+/).length > 4) s = 0;
      if (s > bs) { bs = s; best = it; }
    });
    var found = searchProducts(q);
    var priceWords = has(n, ['prix', 'combien', 'coute', 'tarif', 'dispo', 'stock', 'avez vous', 'vendez', 'cherche', 'voudrais', 'veux', 'photo']);
    if (found.length && (!best || priceWords || bs < 2)) { showProducts(found, found.length > 1 ? 'Voici ce que j\'ai trouvé :' : 'Voici ce produit :'); return; }
    if (best) { best.f(q); return; }
    bot('Je n\'ai pas bien compris, mais je peux vous aider sur : les produits et leurs prix, la livraison, le paiement, le prix de gros, votre commande ou les horaires. Écrivez un mot comme « robe » ou « livraison », ou touchez une question ci-dessous.', contactActs());
  }

  /* ---------- Boutons rapides ---------- */
  var QUICK = [
    ['Comment commander ?', 'comment commander'], ['Livraison', 'livraison'], ['Paiement', 'comment payer'], ['Prix de gros', 'prix de gros'],
    ['Nos produits', 'catalogue'], ['Horaires', 'horaires'], ['Adresse', 'adresse'], ['Suivre ma commande', 'suivre ma commande'], ['Contact', 'contact']
  ];
  QUICK.forEach(function (q) {
    var b = el('button', 'as-chip', q[0]); b.type = 'button';
    b.addEventListener('click', function () { ask(q[0], q[1]); });
    chips.appendChild(b);
  });

  var busy = false;
  function ask(shown, query) {
    if (busy) return;
    busy = true; me(shown);
    typing(function () { try { answer(query || shown); } finally { busy = false; } });
  }
  form.addEventListener('submit', function (e) {
    e.preventDefault();
    var v = inp.value.trim(); if (!v) return;
    inp.value = ''; ask(v);
  });

  /* ---------- Ouverture / fermeture ---------- */
  var started = false;
  function open() {
    panel.hidden = false; fab.setAttribute('aria-expanded', 'true'); fab.hidden = false;
    if (!started) { started = true; A.hello(); }
    setTimeout(function () { inp.focus(); }, 50);
  }
  function close() { panel.hidden = true; fab.setAttribute('aria-expanded', 'false'); fab.focus(); }
  fab.addEventListener('click', function () { if (panel.hidden) open(); else close(); });
  xb.addEventListener('click', close);
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape' && !panel.hidden && !document.getElementById('lb')) close(); });
})();
