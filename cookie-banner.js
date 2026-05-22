/**
 * cookie-banner.js — Méthode DCG UE5
 * Bandeau de consentement CNIL conforme + chargement conditionnel GA4
 * À inclure sur TOUTES les pages du site, AVANT le script GA4
 * GA4 ID : G-F51TDGR55K
 */

(function () {
  const GA_ID = 'G-F51TDGR55K';
  const STORAGE_KEY = 'dcg_cookie_consent';

  // ── Lire le consentement stocké ──
  function getConsent() {
    try { return localStorage.getItem(STORAGE_KEY); } catch { return null; }
  }
  function setConsent(val) {
    try { localStorage.setItem(STORAGE_KEY, val); } catch {}
  }

  // ── Charger GA4 ──
  function loadGA() {
    if (document.getElementById('ga4-script')) return;
    const s = document.createElement('script');
    s.id = 'ga4-script';
    s.async = true;
    s.src = 'https://www.googletagmanager.com/gtag/js?id=' + GA_ID;
    document.head.appendChild(s);
    window.dataLayer = window.dataLayer || [];
    function gtag() { dataLayer.push(arguments); }
    window.gtag = gtag;
    gtag('js', new Date());
    gtag('config', GA_ID, { anonymize_ip: true });
  }

  // ── Créer le bandeau ──
  function createBanner() {
    const banner = document.createElement('div');
    banner.id = 'cookie-banner';
    banner.setAttribute('role', 'dialog');
    banner.setAttribute('aria-label', 'Gestion des cookies');
    banner.innerHTML = `
      <div class="cb-inner">
        <p class="cb-text">
          Ce site utilise Google Analytics pour mesurer son audience.
          Vos données sont traitées de manière anonymisée.
          <a href="mentions-legales.html#politique-confidentialite" target="_blank">En savoir plus</a>
        </p>
        <div class="cb-actions">
          <button id="cb-refuse" class="cb-btn cb-btn--refuse">Refuser</button>
          <button id="cb-accept" class="cb-btn cb-btn--accept">Accepter</button>
        </div>
      </div>
    `;

    const style = document.createElement('style');
    style.textContent = `
      #cookie-banner {
        position: fixed;
        bottom: 0; left: 0; right: 0;
        z-index: 9999;
        background: #1a1a2e;
        border-top: 2px solid #c9a84c;
        padding: 16px clamp(1rem, 4vw, 3rem);
        font-family: 'DM Sans', sans-serif;
        font-size: 0.82rem;
        color: rgba(245,240,232,0.8);
        animation: cbSlideUp 0.35s ease;
      }
      @keyframes cbSlideUp {
        from { transform: translateY(100%); opacity: 0; }
        to   { transform: translateY(0);    opacity: 1; }
      }
      .cb-inner {
        max-width: 900px;
        margin: 0 auto;
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 20px;
        flex-wrap: wrap;
      }
      .cb-text {
        flex: 1;
        line-height: 1.55;
        min-width: 220px;
        margin: 0;
      }
      .cb-text a {
        color: #c9a84c;
        text-decoration: underline;
        text-underline-offset: 2px;
      }
      .cb-actions {
        display: flex;
        gap: 10px;
        flex-shrink: 0;
      }
      .cb-btn {
        padding: 8px 20px;
        border: 1px solid rgba(201,168,76,0.4);
        font-family: 'DM Sans', sans-serif;
        font-size: 0.78rem;
        font-weight: 500;
        cursor: pointer;
        letter-spacing: 0.04em;
        transition: all 0.2s;
        border-radius: 0;
      }
      .cb-btn--refuse {
        background: transparent;
        color: rgba(245,240,232,0.55);
        border-color: rgba(245,240,232,0.2);
      }
      .cb-btn--refuse:hover {
        background: rgba(245,240,232,0.06);
        color: rgba(245,240,232,0.9);
      }
      .cb-btn--accept {
        background: #c9a84c;
        color: #1a1a2e;
        border-color: #c9a84c;
      }
      .cb-btn--accept:hover {
        background: #d4b660;
        border-color: #d4b660;
      }
      @media (max-width: 480px) {
        .cb-inner { flex-direction: column; align-items: flex-start; }
        .cb-actions { width: 100%; }
        .cb-btn { flex: 1; text-align: center; }
      }
    `;

    document.head.appendChild(style);
    document.body.appendChild(banner);

    document.getElementById('cb-accept').addEventListener('click', function () {
      setConsent('accepted');
      banner.remove();
      loadGA();
    });
    document.getElementById('cb-refuse').addEventListener('click', function () {
      setConsent('refused');
      banner.remove();
    });
  }

  // ── Exposer une fonction pour changer d'avis (lien footer) ──
  window.resetCookieConsent = function () {
    try { localStorage.removeItem(STORAGE_KEY); } catch {}
    createBanner();
  };

  // ── Init ──
  function init() {
    const consent = getConsent();
    if (consent === 'accepted') {
      loadGA();
    } else if (consent === 'refused') {
      // rien
    } else {
      // pas encore de choix → afficher le bandeau
      createBanner();
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
