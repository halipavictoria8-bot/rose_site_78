/* LA LANGUE : "fr" ou "en" (gardée dans le navigateur quand on clique sur En / Fr) */
var MQ_MOBILE = window.matchMedia ? matchMedia("(max-width: 760px), (pointer: coarse) and (max-width: 1000px) and (max-height: 520px)") : null;   // la même règle que la version mobile du CSS
window.MOBILE = function () { return MQ_MOBILE ? MQ_MOBILE.matches : innerWidth <= 760; };

/* PINCER AVEC DEUX DOIGTS = ZOOMER (accueil et carte, sur téléphone et tablette) */
function pincer(el, quandPince) {
  var doigts = {}, avant = null;
  function liste() { return Object.keys(doigts).map(function (k) { return doigts[k]; }); }
  el.addEventListener("pointerdown", function (e) {
    if (e.pointerType !== "touch") return;
    doigts[e.pointerId] = { x: e.clientX, y: e.clientY };
    if (liste().length === 2) { el.dataset.pince = "1"; avant = null; }
  });
  addEventListener("pointermove", function (e) {
    if (!doigts[e.pointerId]) return;
    doigts[e.pointerId] = { x: e.clientX, y: e.clientY };
    var L = liste();
    if (L.length < 2) return;
    var a = L[0], b = L[1], dist = Math.hypot(a.x - b.x, a.y - b.y), mx = (a.x + b.x) / 2, my = (a.y + b.y) / 2;
    if (avant) quandPince(dist / avant.dist, mx, my, mx - avant.mx, my - avant.my);
    avant = { dist: dist, mx: mx, my: my };
  });
  function fin(e) {
    delete doigts[e.pointerId];
    if (liste().length < 2) { avant = null; setTimeout(function () { if (liste().length < 2) el.dataset.pince = ""; }, 120); }
  }
  addEventListener("pointerup", fin);
  addEventListener("pointercancel", fin);
}

window.LANG = (function () { try { return localStorage.getItem("rose-langue") === "en" ? "en" : "fr"; } catch (e) { return "fr"; } })();
document.documentElement.lang = window.LANG;

/* =========================================================
   ROSE BOUCHER-EMOND — le JavaScript de tout le site (version 7)
   tout le site est dans index.html ; ce fichier affiche la bonne page selon l’adresse
   ========================================================= */



/* ============================================================
   LES TRAITS DE CRAYON (dessins)
   ============================================================ */
/* traits au crayon (svg) — générés, pas besoin d'y toucher */
window.CRAYONS = {"cercle": "<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 220 120\" preserveAspectRatio=\"none\" aria-hidden=\"true\">\n<defs>\n <filter id=\"cr-circle\" x=\"-5%\" y=\"-5%\" width=\"110%\" height=\"110%\">\n  <feTurbulence type=\"fractalNoise\" baseFrequency=\"0.035\" numOctaves=\"2\" seed=\"4\" result=\"warp\"/>\n  <feDisplacementMap in=\"SourceGraphic\" in2=\"warp\" scale=\"4\" xChannelSelector=\"R\" yChannelSelector=\"G\" result=\"w\"/>\n  <feTurbulence type=\"fractalNoise\" baseFrequency=\"0.7\" numOctaves=\"3\" seed=\"11\" result=\"grain\"/>\n  <feColorMatrix in=\"grain\" type=\"matrix\" values=\"0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  -4.2 0 0 0 3.05\" result=\"mask\"/>\n  <feComposite in=\"w\" in2=\"mask\" operator=\"in\" result=\"g\"/>\n  <feGaussianBlur in=\"g\" stdDeviation=\"0.25\"/>\n </filter>\n</defs>\n\n<g filter=\"url(#cr-circle)\">\n<path d=\"M194.0,42.6 L198.8,46.1 L202.4,50.6 L206.0,55.0 L208.9,59.9 L209.7,65.5 L207.7,70.7 L205.1,75.4 L201.4,79.7 L197.4,84.9 L191.2,89.0 L184.1,93.2 L175.9,97.0 L167.0,100.2 L157.5,102.3 L147.5,101.9 L137.7,101.8 L128.2,101.6 L118.7,101.4 L109.4,102.8 L99.9,103.3 L90.5,102.6 L81.0,101.4 L71.4,99.6 L62.0,97.5 L52.3,97.3 L43.5,94.6 L35.4,91.3 L28.2,87.9 L21.6,84.6 L17.0,80.0 L13.0,75.5 L13.0,69.9 L13.9,65.1 L14.9,60.4 L16.4,55.5 L20.3,51.7 L23.8,47.4 L28.4,44.0 L33.2,40.4 L37.6,36.2 L42.4,31.9 L48.2,28.2 L54.4,24.3 L61.2,20.0 L69.2,16.6 L78.5,15.1 L87.9,11.9 L93.0,10.3 L98.2,10.5 L103.5,10.0 L108.8,10.2 L114.2,10.5 L119.5,10.5 L124.5,12.7 L129.8,12.2 L139.6,13.9 L149.0,15.6 L157.1,19.2 L164.8,22.0 L171.6,25.4 L177.1,30.0 L182.8,33.4 L187.6,37.5 L191.3,42.3 L196.5,45.4 L201.2,49.0 L204.8,53.4 L206.3,58.8 L207.3,63.9 L208.2,68.9 L207.2,74.3 L204.9,79.8 L200.4,84.3\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"4.7\" stroke-linecap=\"round\" stroke-linejoin=\"round\"/>\n</g>\n</svg>", "fleche": "<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 180 50\" preserveAspectRatio=\"none\" aria-hidden=\"true\">\n<defs>\n <filter id=\"cr-arrow\" x=\"-5%\" y=\"-5%\" width=\"110%\" height=\"110%\">\n  <feTurbulence type=\"fractalNoise\" baseFrequency=\"0.035\" numOctaves=\"2\" seed=\"4\" result=\"warp\"/>\n  <feDisplacementMap in=\"SourceGraphic\" in2=\"warp\" scale=\"4\" xChannelSelector=\"R\" yChannelSelector=\"G\" result=\"w\"/>\n  <feTurbulence type=\"fractalNoise\" baseFrequency=\"0.7\" numOctaves=\"3\" seed=\"11\" result=\"grain\"/>\n  <feColorMatrix in=\"grain\" type=\"matrix\" values=\"0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  -4.2 0 0 0 3.05\" result=\"mask\"/>\n  <feComposite in=\"w\" in2=\"mask\" operator=\"in\" result=\"g\"/>\n  <feGaussianBlur in=\"g\" stdDeviation=\"0.25\"/>\n </filter>\n</defs>\n\n<g filter=\"url(#cr-arrow)\">\n<path d=\"M6.0,30.2 L11.4,30.3 L16.9,30.3 L22.3,30.5 L27.7,30.2 L33.2,30.2 L38.5,28.3 L43.8,27.6 L49.3,28.0 L54.7,27.6 L60.0,27.7 L65.0,26.8 L70.0,27.0 L75.0,26.7 L80.0,27.2 L85.0,27.7 L90.1,27.1 L95.1,27.1 L100.1,27.3 L105.0,28.8 L110.0,29.7 L115.0,29.3 L120.0,30.3 L124.9,28.9 L130.0,28.7 L134.9,27.4 L139.8,26.0 L144.9,26.5 L149.9,25.5 L154.8,24.5 L160.0,25.2 L165.1,25.3 L170.0,24.1\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"4.7\" stroke-linecap=\"round\" stroke-linejoin=\"round\"/>\n<path d=\"M6.1,30.9 L11.5,30.4 L16.9,30.1 L22.2,28.9 L27.7,29.4 L33.1,29.1 L38.5,29.4 L44.0,29.3 L49.3,28.0 L54.6,27.0 L60.0,25.8 L65.1,25.5 L70.1,25.1 L75.1,25.5 L80.1,26.4 L85.1,26.0 L90.1,27.1 L95.1,27.3 L100.1,27.5 L105.0,28.8 L110.0,29.1 L115.0,29.1 L120.0,29.6 L125.0,29.5 L129.9,28.0 L135.0,28.5 L139.9,26.9 L145.0,27.0 L150.1,27.1 L154.9,25.3 L160.0,25.4 L165.0,24.5 L170.0,24.1\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2.6\" stroke-linecap=\"round\" stroke-linejoin=\"round\"/>\n<path d=\"M150.4,9.3 L155.1,11.7 L159.6,14.3 L163.4,18.1 L168.0,20.5 L172.2,24.0 L166.9,26.7 L161.8,29.5 L157.3,33.1 L152.7,36.6 L147.9,39.8\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"4.7\" stroke-linecap=\"round\" stroke-linejoin=\"round\"/>\n</g>\n</svg>", "reliure": "<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 20 1200\" preserveAspectRatio=\"none\" aria-hidden=\"true\">\n<defs>\n <filter id=\"cr-gutter\" x=\"-5%\" y=\"-5%\" width=\"110%\" height=\"110%\">\n  <feTurbulence type=\"fractalNoise\" baseFrequency=\"0.035\" numOctaves=\"2\" seed=\"4\" result=\"warp\"/>\n  <feDisplacementMap in=\"SourceGraphic\" in2=\"warp\" scale=\"4\" xChannelSelector=\"R\" yChannelSelector=\"G\" result=\"w\"/>\n  <feTurbulence type=\"fractalNoise\" baseFrequency=\"0.7\" numOctaves=\"3\" seed=\"11\" result=\"grain\"/>\n  <feColorMatrix in=\"grain\" type=\"matrix\" values=\"0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  -4.2 0 0 0 3.05\" result=\"mask\"/>\n  <feComposite in=\"w\" in2=\"mask\" operator=\"in\" result=\"g\"/>\n  <feGaussianBlur in=\"g\" stdDeviation=\"0.25\"/>\n </filter>\n</defs>\n\n<g filter=\"url(#cr-gutter)\">\n<path d=\"M9.1,6.0 L8.3,11.0 L8.7,16.0 L9.8,21.0 L11.5,26.0 L10.6,31.0 L10.5,36.0 L9.6,41.0 L10.1,46.0 L9.2,51.0 L10.1,56.0 L9.1,61.0 L8.6,66.0 L9.2,71.0 L9.3,76.0 L8.9,81.0 L10.2,86.0 L9.9,91.0 L9.0,96.0 L10.0,101.0 L9.0,106.0 L8.7,111.0 L7.9,116.0 L9.0,121.0 L10.5,126.0 L9.4,131.0 L8.6,136.0 L9.1,141.0 L10.6,146.0 L11.4,151.0 L10.7,156.0 L11.2,161.0 L9.4,166.0 L9.3,171.0 L10.4,176.0 L9.8,181.0 L10.3,186.0 L8.8,191.0 L7.8,196.0 L8.3,201.0 L8.3,206.0 L8.1,211.0 L7.6,216.0 L6.7,221.0 L9.0,226.0 L9.7,231.0 L9.4,236.0 L10.2,241.0 L9.9,246.0 L11.2,251.0 L9.7,256.0 L9.7,261.0 L11.0,266.0 L10.2,271.0 L10.8,276.0 L11.5,281.0 L11.2,286.0 L12.1,291.0 L12.5,296.0 L10.7,301.0 L9.9,306.0 L11.5,311.0 L10.2,316.0 L11.7,321.0 L11.8,326.0 L10.1,331.0 L9.7,336.0 L10.4,341.0 L10.7,346.0 L10.9,351.0 L11.8,356.0 L9.8,361.0 L11.3,366.0 L11.2,371.0 L10.1,376.0 L10.4,381.0 L8.8,386.0 L9.9,391.0 L8.4,396.0 L7.5,401.0 L7.6,406.0 L7.0,411.0 L7.9,416.0 L7.4,421.0 L7.1,426.0 L7.7,431.0 L8.4,436.0 L8.1,441.0 L8.9,446.0 L10.5,451.0 L9.6,456.0 L10.4,461.0 L10.4,466.0 L9.4,471.0 L10.6,476.0 L12.0,481.0 L12.7,486.0 L11.7,491.0 L11.7,496.0 L12.1,501.0 L11.7,506.0 L9.9,511.0 L10.7,516.0 L10.8,521.0 L9.4,526.0 L9.2,531.0 L10.1,536.0 L10.2,541.0 L10.2,546.0 L11.3,551.0 L11.4,556.0 L11.6,561.0 L10.3,566.0 L10.8,571.0 L10.1,576.0 L8.5,581.0 L7.6,586.0 L8.6,591.0 L8.6,596.0 L9.5,601.0 L10.0,606.0 L10.0,611.0 L9.1,616.0 L7.9,621.0 L9.1,626.0 L10.9,631.0 L10.8,636.0 L12.0,641.0 L13.0,646.0 L11.4,651.0 L12.3,656.0 L11.0,661.0 L11.2,666.0 L9.5,671.0 L8.5,676.0 L10.3,681.0 L11.2,686.0 L9.5,691.0 L9.2,696.0 L9.7,701.0 L8.9,706.0 L8.1,711.0 L8.6,716.0 L9.1,721.0 L10.6,726.0 L10.9,731.0 L11.8,736.0 L10.9,741.0 L10.4,746.0 L11.4,751.0 L10.7,756.0 L11.8,761.0 L12.6,766.0 L11.5,771.0 L11.2,776.0 L9.6,781.0 L9.3,786.0 L8.8,791.0 L10.3,796.0 L9.2,801.0 L10.7,806.0 L10.2,811.0 L8.8,816.0 L7.8,821.0 L7.1,826.0 L8.0,831.0 L7.9,836.0 L7.5,841.0 L9.3,846.0 L8.0,851.0 L7.2,856.0 L8.1,861.0 L7.7,866.0 L8.4,871.0 L9.5,876.0 L9.0,881.0 L10.6,886.0 L9.5,891.0 L8.1,896.0 L9.3,901.0 L8.0,906.0 L9.9,911.0 L8.8,916.0 L9.8,921.0 L8.3,926.0 L9.0,931.0 L7.9,936.0 L9.9,941.0 L11.3,946.0 L9.9,951.0 L9.5,956.0 L9.5,961.0 L11.1,966.0 L11.9,971.0 L11.8,976.0 L12.8,981.0 L10.5,986.0 L9.5,991.0 L8.2,996.0 L8.0,1001.0 L9.0,1006.0 L10.6,1011.0 L9.7,1016.0 L11.0,1021.0 L10.6,1026.0 L10.6,1031.0 L10.5,1036.0 L11.7,1041.0 L12.6,1046.0 L11.9,1051.0 L12.9,1056.0 L12.1,1061.0 L12.7,1066.0 L12.7,1071.0 L13.2,1076.0 L12.2,1081.0 L12.0,1086.0 L12.4,1091.0 L12.7,1096.0 L11.8,1101.0 L10.0,1106.0 L10.3,1111.0 L11.3,1116.0 L11.6,1121.0 L12.0,1126.0 L11.3,1131.0 L10.0,1136.0 L9.8,1141.0 L10.9,1146.0 L11.2,1151.0 L11.3,1156.0 L11.1,1161.0 L11.2,1166.0 L9.3,1171.0 L9.3,1176.0 L9.0,1181.0 L8.5,1186.0\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"4.7\" stroke-linecap=\"round\" stroke-linejoin=\"round\"/>\n</g>\n</svg>", "coche": "<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 46 40\" preserveAspectRatio=\"none\" aria-hidden=\"true\">\n<defs>\n <filter id=\"cr-tick\" x=\"-5%\" y=\"-5%\" width=\"110%\" height=\"110%\">\n  <feTurbulence type=\"fractalNoise\" baseFrequency=\"0.035\" numOctaves=\"2\" seed=\"4\" result=\"warp\"/>\n  <feDisplacementMap in=\"SourceGraphic\" in2=\"warp\" scale=\"4\" xChannelSelector=\"R\" yChannelSelector=\"G\" result=\"w\"/>\n  <feTurbulence type=\"fractalNoise\" baseFrequency=\"0.7\" numOctaves=\"3\" seed=\"11\" result=\"grain\"/>\n  <feColorMatrix in=\"grain\" type=\"matrix\" values=\"0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  -4.2 0 0 0 3.05\" result=\"mask\"/>\n  <feComposite in=\"w\" in2=\"mask\" operator=\"in\" result=\"g\"/>\n  <feGaussianBlur in=\"g\" stdDeviation=\"0.25\"/>\n </filter>\n</defs>\n\n<g filter=\"url(#cr-tick)\">\n<path d=\"M6.2,21.8 L9.9,25.5 L12.9,29.8 L16.0,33.1 L18.9,29.6 L22.3,25.5 L25.4,21.2 L29.0,17.4 L32.1,13.1 L35.7,9.2 L38.8,5.0\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"5.0\" stroke-linecap=\"round\" stroke-linejoin=\"round\"/>\n</g>\n</svg>", "tiret": "<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 64 16\" preserveAspectRatio=\"none\" aria-hidden=\"true\">\n<defs>\n <filter id=\"cr-dash\" x=\"-5%\" y=\"-5%\" width=\"110%\" height=\"110%\">\n  <feTurbulence type=\"fractalNoise\" baseFrequency=\"0.035\" numOctaves=\"2\" seed=\"4\" result=\"warp\"/>\n  <feDisplacementMap in=\"SourceGraphic\" in2=\"warp\" scale=\"4\" xChannelSelector=\"R\" yChannelSelector=\"G\" result=\"w\"/>\n  <feTurbulence type=\"fractalNoise\" baseFrequency=\"0.7\" numOctaves=\"3\" seed=\"11\" result=\"grain\"/>\n  <feColorMatrix in=\"grain\" type=\"matrix\" values=\"0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  -4.2 0 0 0 3.05\" result=\"mask\"/>\n  <feComposite in=\"w\" in2=\"mask\" operator=\"in\" result=\"g\"/>\n  <feGaussianBlur in=\"g\" stdDeviation=\"0.25\"/>\n </filter>\n</defs>\n\n<g filter=\"url(#cr-dash)\">\n<path d=\"M4.0,7.6 L9.1,8.3 L14.2,7.5 L19.3,7.8 L24.4,7.1 L29.4,6.7 L34.5,7.6 L39.6,7.0 L44.7,7.2 L49.8,7.1 L54.9,7.0 L60.0,6.9\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"4.0\" stroke-linecap=\"round\" stroke-linejoin=\"round\"/>\n</g>\n</svg>", "poteaux": "<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 200 165\" preserveAspectRatio=\"none\" aria-hidden=\"true\">\n<defs>\n <filter id=\"cr-poles\" x=\"-5%\" y=\"-5%\" width=\"110%\" height=\"110%\">\n  <feTurbulence type=\"fractalNoise\" baseFrequency=\"0.035\" numOctaves=\"2\" seed=\"4\" result=\"warp\"/>\n  <feDisplacementMap in=\"SourceGraphic\" in2=\"warp\" scale=\"4\" xChannelSelector=\"R\" yChannelSelector=\"G\" result=\"w\"/>\n  <feTurbulence type=\"fractalNoise\" baseFrequency=\"0.7\" numOctaves=\"3\" seed=\"11\" result=\"grain\"/>\n  <feColorMatrix in=\"grain\" type=\"matrix\" values=\"0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  -4.2 0 0 0 3.05\" result=\"mask\"/>\n  <feComposite in=\"w\" in2=\"mask\" operator=\"in\" result=\"g\"/>\n  <feGaussianBlur in=\"g\" stdDeviation=\"0.25\"/>\n </filter>\n</defs>\n\n<g filter=\"url(#cr-poles)\">\n<path d=\"M29.9,150.0 L29.8,144.9 L29.4,139.8 L30.2,134.8 L29.5,129.7 L29.8,124.6 L30.7,119.5 L30.0,114.5 L30.3,109.4 L30.7,104.3 L30.0,99.2 L30.1,94.1 L30.7,89.1 L30.7,84.0 L31.2,78.9 L30.7,73.8 L30.5,68.8 L30.1,63.7 L30.5,58.6 L31.5,53.5 L31.7,48.5 L32.2,43.4 L31.9,38.3 L32.3,33.2 L31.6,28.2 L31.4,23.1 L31.9,18.0\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"5.0\" stroke-linecap=\"round\" stroke-linejoin=\"round\"/>\n<path d=\"M30.4,150.0 L30.2,144.9 L29.6,139.8 L29.4,134.8 L29.3,129.7 L29.2,124.6 L30.1,119.5 L29.8,114.5 L30.7,109.4 L31.3,104.3 L30.5,99.2 L30.5,94.1 L30.6,89.1 L30.0,84.0 L30.2,78.9 L31.2,73.8 L30.6,68.8 L31.0,63.7 L30.6,58.6 L31.0,53.5 L31.8,48.5 L31.3,43.4 L30.7,38.3 L30.4,33.2 L30.8,28.1 L30.4,23.1 L30.2,18.0\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2.7\" stroke-linecap=\"round\" stroke-linejoin=\"round\"/>\n<path d=\"M150.0,150.0 L150.7,144.9 L150.5,139.9 L150.3,134.8 L150.6,129.7 L150.0,124.6 L150.3,119.5 L149.9,114.5 L150.3,109.4 L151.2,104.3 L150.4,99.2 L150.7,94.2 L151.0,89.1 L150.5,84.0 L150.3,78.9 L151.4,73.8 L152.2,68.8 L151.4,63.7 L151.8,58.6 L152.5,53.6 L151.9,48.5 L152.1,43.4 L151.3,38.3 L151.3,33.2 L151.7,28.2 L152.0,23.1 L152.5,18.0\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"5.0\" stroke-linecap=\"round\" stroke-linejoin=\"round\"/>\n<path d=\"M149.3,150.0 L149.3,144.9 L150.2,139.8 L150.4,134.8 L150.3,129.7 L150.3,124.6 L151.1,119.5 L151.2,114.5 L150.3,109.4 L150.9,104.3 L150.7,99.2 L150.7,94.2 L150.3,89.1 L150.5,84.0 L150.4,78.9 L150.0,73.8 L150.6,68.8 L150.2,63.7 L151.0,58.6 L150.4,53.5 L151.2,48.5 L151.8,43.4 L151.9,38.3 L152.2,33.2 L151.8,28.2 L152.3,23.1 L152.1,18.0\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2.7\" stroke-linecap=\"round\" stroke-linejoin=\"round\"/>\n<path d=\"M32.2,39.6 L36.7,43.4 L41.8,46.2 L46.8,48.8 L51.4,52.0 L56.5,54.1 L61.4,56.4 L66.5,57.6 L71.2,59.5 L76.3,59.9 L81.2,59.7 L86.1,60.7 L90.9,59.7 L96.0,59.7 L101.1,59.1 L106.1,57.4 L110.7,54.5 L115.3,51.8 L120.1,49.2 L125.0,46.7 L130.1,44.5 L135.4,42.7 L140.2,40.0 L144.9,37.1 L149.9,35.1\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"4.0\" stroke-linecap=\"round\" stroke-linejoin=\"round\"/>\n<path d=\"M32.5,99.7 L35.4,104.5 L37.4,109.3 L41.9,111.3 L46.9,111.9 L51.8,112.9 L56.6,113.8 L61.5,114.1 L66.4,113.3 L71.5,112.9 L76.2,110.8 L81.3,109.4 L86.4,107.6 L91.5,105.7 L96.3,102.9 L100.8,99.6 L105.4,96.5 L110.4,94.2 L115.2,91.6 L120.3,89.9 L125.1,87.7 L130.3,87.1 L135.2,85.8 L140.1,84.8 L145.2,84.6 L150.1,85.4\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"4.0\" stroke-linecap=\"round\" stroke-linejoin=\"round\"/>\n<path d=\"M20.2,152.1 L22.8,143.9\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"3.4\" stroke-linecap=\"round\" stroke-linejoin=\"round\"/>\n<path d=\"M59.1,151.7 L62.3,143.7\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"3.4\" stroke-linecap=\"round\" stroke-linejoin=\"round\"/>\n<path d=\"M121.2,152.4 L124.0,144.4\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"3.4\" stroke-linecap=\"round\" stroke-linejoin=\"round\"/>\n<path d=\"M171.2,152.4 L172.6,143.9\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"3.4\" stroke-linecap=\"round\" stroke-linejoin=\"round\"/>\n<path d=\"M4.0,153.4 L9.1,154.1 L14.1,153.7 L19.2,153.3 L24.2,153.0 L29.3,153.9 L34.3,152.1 L39.4,152.4 L44.4,152.4 L49.5,151.6 L54.5,152.3 L59.6,152.7 L64.6,151.3 L69.7,152.0 L74.7,151.7 L79.8,151.6 L84.8,152.0 L89.9,150.6 L94.9,151.1 L100.0,150.8 L105.1,152.0 L110.1,151.1 L115.2,152.1 L120.2,152.5 L125.3,152.6 L130.3,153.3 L135.4,151.5 L140.4,151.7 L145.5,151.9 L150.5,152.2 L155.6,151.7 L160.6,150.3 L165.7,149.6 L170.7,150.3 L175.8,149.6 L180.8,148.7 L185.9,148.9 L190.9,149.3 L196.0,149.8\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"4.3\" stroke-linecap=\"round\" stroke-linejoin=\"round\"/>\n</g>\n</svg>", "souligne": "<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 300 30\" preserveAspectRatio=\"none\" aria-hidden=\"true\">\n<defs>\n <filter id=\"cr-underline\" x=\"-5%\" y=\"-5%\" width=\"110%\" height=\"110%\">\n  <feTurbulence type=\"fractalNoise\" baseFrequency=\"0.035\" numOctaves=\"2\" seed=\"4\" result=\"warp\"/>\n  <feDisplacementMap in=\"SourceGraphic\" in2=\"warp\" scale=\"4\" xChannelSelector=\"R\" yChannelSelector=\"G\" result=\"w\"/>\n  <feTurbulence type=\"fractalNoise\" baseFrequency=\"0.7\" numOctaves=\"3\" seed=\"11\" result=\"grain\"/>\n  <feColorMatrix in=\"grain\" type=\"matrix\" values=\"0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  -4.2 0 0 0 3.05\" result=\"mask\"/>\n  <feComposite in=\"w\" in2=\"mask\" operator=\"in\" result=\"g\"/>\n  <feGaussianBlur in=\"g\" stdDeviation=\"0.25\"/>\n </filter>\n</defs>\n\n<g filter=\"url(#cr-underline)\">\n<path d=\"M8.0,13.4 L13.1,13.4 L18.2,12.9 L23.4,13.1 L28.5,13.2 L33.6,11.8 L38.7,10.6 L43.8,11.7 L49.0,11.0 L54.1,10.4 L59.3,11.6 L64.4,11.3 L69.5,11.8 L74.7,11.3 L79.8,11.3 L84.9,10.0 L90.0,10.1 L95.0,11.1 L100.0,11.1 L105.0,11.6 L110.0,11.8 L115.0,10.6 L120.0,11.4 L125.0,11.6 L130.0,11.1 L135.0,10.1 L140.0,11.4 L145.0,11.5 L150.0,12.1 L155.0,13.1 L160.0,13.4 L164.9,14.2 L170.0,13.5 L175.0,14.0 L180.0,13.6 L184.9,14.5 L189.9,15.1 L195.0,13.7 L200.0,12.7 L205.1,11.8 L210.2,12.9 L215.3,12.4 L220.5,12.3 L225.5,11.5 L230.7,11.2 L235.8,10.7 L240.9,10.2 L246.0,10.2 L251.1,10.2 L256.3,10.9 L261.4,10.8 L266.5,11.3 L271.7,11.4 L276.8,11.7 L281.9,11.1 L287.0,9.4 L292.1,9.7\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"5.0\" stroke-linecap=\"round\" stroke-linejoin=\"round\"/>\n<path d=\"M8.1,15.1 L13.2,15.6 L18.3,15.0 L23.5,14.9 L28.5,13.5 L33.7,14.0 L38.8,13.6 L43.9,12.5 L49.0,11.2 L54.1,12.0 L59.3,12.8 L64.4,11.3 L69.5,11.7 L74.6,11.1 L79.7,9.9 L84.8,9.3 L90.0,9.9 L95.0,11.0 L100.0,9.8 L105.0,10.3 L110.0,9.4 L115.0,10.4 L120.0,10.2 L125.0,11.4 L130.0,12.6 L135.0,12.3 L139.9,13.4 L145.0,12.6 L150.0,11.4 L155.0,11.9 L160.0,10.8 L165.0,10.5 L170.0,10.8 L175.0,11.6 L180.0,11.1 L185.1,10.4 L190.0,12.0 L195.0,11.9 L200.0,13.4 L205.2,13.9 L210.3,13.1 L215.4,12.5 L220.5,12.2 L225.6,12.2 L230.7,12.0 L235.8,11.7 L240.9,11.5 L246.1,12.1 L251.2,11.5 L256.3,10.7 L261.4,10.8 L266.5,9.6 L271.5,8.8 L276.7,9.7 L281.8,9.3 L286.9,8.9 L292.0,7.3\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2.7\" stroke-linecap=\"round\" stroke-linejoin=\"round\"/>\n<path d=\"M30.0,21.8 L35.0,21.9 L40.0,20.8 L45.0,21.2 L50.0,21.4 L55.0,20.4 L60.0,20.8 L65.0,20.7 L70.0,21.1 L75.0,20.6 L80.0,21.0 L85.0,21.3 L90.0,20.0 L95.0,19.1 L100.0,19.7 L105.0,20.6 L110.0,19.9 L115.0,19.7 L120.0,19.8 L125.0,19.3 L130.0,19.0 L135.0,18.6 L140.0,18.4 L145.0,18.7 L150.0,18.3 L155.0,18.3 L160.0,19.2 L165.0,18.4 L170.0,18.8 L175.0,19.6 L180.0,19.3 L185.0,19.0 L190.0,19.9 L195.0,19.5 L200.0,19.1 L205.0,19.3 L210.0,20.1 L215.0,19.4 L220.0,19.4 L225.0,19.5 L230.0,20.6 L235.0,20.6 L240.0,21.5\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"3.4\" stroke-linecap=\"round\" stroke-linejoin=\"round\"/>\n</g>\n</svg>"};


/* ============================================================
   LA LISTE DES PROJETS (pour ajouter un projet, c’est ici)
   ============================================================ */
/* =========================================================
   projets.js — la liste des 9 projets
   pour ajouter un projet : remplir un bloc "à venir" plus bas
   (les 3 vues de l'accueil - grille, carte, liste - lisent tout ici)
   ========================================================= */


window.PROJETS = [

  /* du plus récent (en haut de la page Projets) au plus ancien */

  {
    no: "09",
    titre_en: "The Québec National Film Centre",
    sous_en: "",
    lignes_en: ["The Québec National", "Film Centre"],
    lignes: ["Le Centre national", "du film du Québec"],          // le titre sur deux lignes dans le cahier (page Projets)
    titre: "Le Centre national du film du Québec",
    sous: "",
    annee: "",
    page: "#/centre-national-du-film",
    couverture: "img/c-ext.jpg",
    entier: 1.18,                           // la couverture est montrée en entier
    images: [
      ["img/c-ext.jpg", 1.18],
      ["img/c-plan.jpg", 1.74, "plan"],
      ["img/c-croquis.jpg", 1.1, "plan"],
      ["img/c-poteaux.jpg", 1.38, "plan"],
      ["img/c-elevation-long.jpg", 2.86, "plan"],
      ["img/c-axo.jpg", 1.57, "plan"],
      ["img/c-coupe.jpg", 0.77, "plan"],
      ["img/c-elevation.jpg", 1.18],
      ["img/c-facade.jpg", 1.18],
      ["img/c-int-4.jpg", 1.18],
      ["img/c-int-1.jpg", 1.18],
      ["img/c-int-6.jpg", 0.98]
    ]
  },


  {
    no: "08",
    titre_en: "Video Exploration",
    sous_en: "",
    titre: "Exploration vidéo",
    sous: "",
    annee: "",
    page: "#/exploration-video",
    couverture: "img/v-image.jpg",
    entier: 1.78,                           // la couverture est montrée en entier
    images: [
      ["img/v-image.jpg", 1.78],
      ["img/v-dispositif.jpg", 0.75],
      ["img/v-processus.jpg", 0.75]
    ]
  },


  {
    no: "07",
    titre_en: "July 1st",
    sous_en: "La Crise de l’Objet",
    titre: "1er Juillet",
    sous: "La crise de l’objet",
    annee: "Hiver 2026",
    page: "#/1er-juillet",
    couverture: "img/o-diable-1.jpg",
    entier: 0.8,                           // la couverture est montrée en entier
    images: [
      ["img/o-diable-4.jpg", 0.8],
      ["img/o-diable-1.jpg", 0.8],
      ["img/o-diable-2.jpg", 0.8],
      ["img/o-croquis.jpg", 1.02, "plan"],
      ["img/o-diable-3.jpg", 0.8],
      ["img/o-atelier-1.jpg", 0.74],
      ["img/o-atelier-3.jpg", 0.87],
      ["img/o-atelier-4.jpg", 1.03],
      ["img/o-atelier-2.jpg", 0.83],
      ["img/o-rue.jpg", 0.86]
    ]
  },


  {
    no: "06",
    titre_en: "16 Manifesto Architectures",
    sous_en: "Studio 5",
    titre: "16 architectures manifestes",
    sous: "Atelier 5",
    annee: "Automne 2025",
    page: "#/16-architectures-manifestes",
    couverture: "img/m-expo-1.jpg",
    entier: 0.75,                           // la couverture est montrée en entier
    images: [
      ["img/m-expo-1.jpg", 0.75],
      ["img/m-expo-2.jpg", 1.0],
      ["img/m-manifeste.jpg", 1.4, "plan"],
      ["img/m-processus.jpg", 1.33, "plan"],
      ["img/m-planche.jpg", 2.31, "plan"],
      ["img/m-machine-1.jpg", 1.44],
      ["img/m-machine-2.jpg", 0.42],
      ["img/m-machine-5.jpg", 0.64],
      ["img/m-machine-3.jpg", 1.44],
      ["img/m-machine-4.jpg", 1.56],
      ["img/m-machine-6.jpg", 1.63]
    ]
  },


  {
    no: "05",
    titre_en: "Designing a Speculative Museum in the Namib Desert",
    sous_en: "Digital",
    lignes_en: ["Designing a Speculative Museum", "in the Namib Desert"],
    lignes: ["Conception d’un musée spéculatif dans", "le désert de Namib"],          // le titre sur deux lignes dans le cahier (page Projets)
    titre: "Conception d’un musée spéculatif dans le désert de Namib",
    sous: "Numérique",
    annee: "Automne 2025",
    page: "#/musee-namib",
    couverture: "img/n-rendu.jpg",
    entier: 1.78,                           // la couverture est montrée en entier
    images: [
      ["img/n-rendu.jpg", 1.78],
      ["img/n-narration.jpg", 0.7, "plan"],
      ["img/n-partition.jpg", 1.79, "plan"],
      ["img/n-site-axo.jpg", 2.0, "plan"],
      ["img/n-schema.jpg", 1.0, "plan"],
      ["img/n-albedome.jpg", 1.78, "plan"],
      ["img/n-chunk.jpg", 1.78],
      ["img/n-voxel.jpg", 1.83, "plan"],
      ["img/n-bloc.jpg", 0.99],
      ["img/n-texture-2.jpg", 0.99],
      ["img/n-modules.jpg", 4.49, "plan"],
      ["img/n-maquette.jpg", 1.5]
    ]
  },


  {
    no: "04",
    titre_en: "The Art of the Everyday",
    sous_en: "INSA Strasbourg",
    titre: "L’Art du quotidien",
    sous: "INSA Strasbourg",
    annee: "Hiver 2025",
    page: "#/art-du-quotidien",
    couverture: "img/s-coupe-persp.jpg",
    entier: 1.77,                           // la couverture est montrée en entier
    images: [
      ["img/s-coupe-persp.jpg", 1.77, "plan"],
      ["img/s-plan-site.jpg", 1.44, "plan"],
      ["img/s-coupe-paysage.jpg", 4.24, "plan"],
      ["img/s-rotonde.jpg", 0.78, "plan"],
      ["img/s-plan-ecole-rdc.jpg", 0.76, "plan"],
      ["img/s-plan-ecole-1.jpg", 0.63, "plan"],
      ["img/s-maisons.jpg", 1.15, "plan"],
      ["img/s-resto.jpg", 0.71, "plan"],
      ["img/s-production.jpg", 0.78, "plan"],
      ["img/s-coupe-atelier.jpg", 1.41, "plan"]
    ]
  },


  {
    no: "03",
    titre_en: "The Butterfly Effect",
    sous_en: "Digital Figuration",
    titre: "L’effet papillon",
    sous: "Figuration numérique",
    annee: "Hiver 2024",
    page: "#/effet-papillon",
    couverture: "img/f-maquette.jpg",
    entier: 1.36,                           // l'image principale est montrée en entier (largeur / hauteur)
    // vue liste : quelques images choisies, en rangées, jamais coupées ([image, largeur / hauteur])
    liste: [
      [["img/f-maquette.jpg", 1.36], ["img/f-bulle.jpg", 0.75]],
      [["img/f-motif.jpg", 1.37], ["img/f-subdivision.jpg", 1.36, "plan"]]
    ],
    images: [
      ["img/f-maquette.jpg", 1.36],
      ["img/f-elevation.jpg", 1.37, "plan"],
      ["img/f-subdivision.jpg", 1.36, "plan"],
      ["img/f-texture.jpg", 0.92],
      ["img/f-scenario.jpg", 1.18, "plan"],
      ["img/f-bulle.jpg", 0.75],
      ["img/f-motif.jpg", 1.37],
      ["img/f-membrane.jpg", 1.37],
      ["img/f-plan-bulles.jpg", 1.14, "plan"],
      ["img/f-espaces.jpg", 1.27, "plan"]
    ]
  },


  {
    no: "02",
    titre_en: "The Spatial Field",
    sous_en: "Studio 4",
    titre: "Le champ spatial",
    sous: "Atelier 4",
    annee: "Hiver 2024",
    page: "#/champ-spatial",
    p: 18,
    couverture: "img/a-vue-ext.jpg",
    // vue liste : la vue extérieure en entier, puis quelques images choisies (jamais coupées)
    liste: [
      [["img/a-vue-ext.jpg", 1.79]],
      [["img/a-int-gradins.jpg", 1.78], ["img/a-plan.jpg", 1.01, "plan"]]
    ],
    images: [
      ["img/a-vue-ext.jpg", 1.79],
      ["img/a-mapping.jpg", 1.78, "plan"],
      ["img/a-forces-vent.jpg", 1.77, "plan"],
      ["img/a-axo.jpg", 0.43, "plan"],
      ["img/a-int-gradins.jpg", 1.78],
      ["img/a-trame-corps.jpg", 1.13, "plan"],
      ["img/a-plan.jpg", 1.01, "plan"],
      ["img/a-int-repas.jpg", 1.78],
      ["img/a-poteau.jpg", 1.55, "plan"],
      ["img/a-forces-corps.jpg", 1.78, "plan"],
      ["img/a-coupe-tech.jpg", 1.95, "plan"],
      ["img/a-trame-poteaux.jpg", 1.86, "plan"],
      ["img/a-elevation.jpg", 2.95, "plan"],
      ["img/a-coupe-paysage.jpg", 5.58, "plan"]
    ]
  },


  {
    no: "01",
    titre_en: "Inspire",
    sous_en: "Wood",
    titre: "Inspire",
    sous: "Bois",
    annee: "Automne 2023",
    page: "#/inspire",
    p: 3,                                   // "page" du carnet dans la vue liste
    couverture: "img/b-objet-2.jpg",
    // [image, largeur / hauteur]  (le ratio sert à placer les images sur la carte)
    images: [
      ["img/b-objet-2.jpg", 0.75],
      ["img/b-objet-1.jpg", 0.73],
      ["img/b-cyano-1.jpg", 1.0],
      ["img/b-bain.jpg", 1.3],
      ["img/b-objet-3.jpg", 0.59],
      ["img/b-cyano-6.jpg", 1.03],
      ["img/b-mapping.jpg", 1.41, "plan"],
      ["img/b-cyano-3.jpg", 0.99],
      ["img/b-objet-4.jpg", 0.85],
      ["img/b-cyano-2.jpg", 1.0],
      ["img/b-cyano-7.jpg", 0.75],
      ["img/b-cyano-5.jpg", 1.02],
      ["img/b-cyano-4.jpg", 1.03]
    ]
  }

];


/* ============================================================
   OUTIL : poser les traits de crayon
   ============================================================ */
/* TRAITS AU CRAYON - chaque [data-crayon] reçoit son dessin (crayons.js) */

function dessinerCrayons(racine) {
  (racine || document).querySelectorAll("[data-crayon]").forEach(function (el) {
    if (!el.dataset.fait) {
      el.innerHTML = window.CRAYONS[el.dataset.crayon] || "";
      el.dataset.fait = 1;
    }
  });
}


/* ============================================================
   COMMUN À TOUTES LES PAGES : menu, chapitres, images en grand, À propos…
   ============================================================ */
function initCommun() {
dessinerCrayons();




/* MENU - un cercle au crayon se dessine autour du mot qu'on survole */

document.querySelectorAll(".menu a, .menu button").forEach(function (lien, n) {

  // une ellipse un peu tremblée qui dépasse son point de départ, comme à la main
  var d = "", depart = -0.6 + n * 0.4;
  for (var k = 0; k <= 40; k++) {
    var t = depart + (k / 40) * (Math.PI * 2 + 0.55);
    var r = 1 + Math.sin(t * 3 + n) * 0.04 + (k / 40) * 0.06;
    var x = 50 + Math.cos(t) * 48 * r;
    var y = 20 + Math.sin(t) * 18 * r - (k / 40) * 2;
    d += (k ? " L" : "M") + x.toFixed(1) + "," + y.toFixed(1);
  }

  lien.insertAdjacentHTML("beforeend",
    '<svg class="cercle-menu" viewBox="0 0 100 40" preserveAspectRatio="none" aria-hidden="true">' +
      '<path d="' + d + '" vector-effect="non-scaling-stroke"/>' +
    "</svg>");

  var p = lien.querySelector(".cercle-menu path");
  var L = p.getTotalLength();
  p.style.strokeDasharray = L;
  p.style.strokeDashoffset = L;

  // la page où on est : le cercle se dessine à l'arrivée
  if (lien.classList.contains("ici")) {
    lien.classList.remove("ici");
    lien.style.color = "var(--bleu)";
    setTimeout(function () { lien.classList.add("ici"); }, 350);
  }

});




/* EN / FR : on change de langue (la même page, traduite) */

var en = document.getElementById("en");

if (en) {
  en.addEventListener("click", function () { if (window.changerLangue) window.changerLangue(); });
}




/* TRANSITION DOUCE quand on change de page */

document.addEventListener("click", function (e) {
  var a = e.target.closest("a[href$='.html']");
  if (!a || e.metaKey || e.ctrlKey || a.target) return;
  e.preventDefault();
  document.body.classList.add("part");
  setTimeout(function () { location.href = a.getAttribute("href"); }, 400);
});

// retour en arrière : on réaffiche
window.addEventListener("pageshow", function () {
  document.body.classList.remove("part");
});




/* GRIBOUILLIS - un trait + un gribouillis au crayon par-dessus chaque chapitre
   (caché au début, il se dessine quand on a fini le chapitre) */

var graineGri = 3;
function hasardGri() {
  graineGri = (graineGri * 16807) % 2147483647;
  return (graineGri - 1) / 2147483646;
}

document.querySelectorAll(".biffe").forEach(function (b) {
  var w = b.offsetWidth + 18;

  // 1er trait : une longue ligne un peu montante
  var d1 = "M2," + (16 + hasardGri() * 3);
  for (var x = 0; x <= w; x += w / 6) {
    d1 += " L" + x.toFixed(1) + "," + (15 - x / w * 5 + (hasardGri() - 0.5) * 2.5).toFixed(1);
  }

  // 2e trait : le gribouillis qui fait des allers-retours serrés sur le mot
  var debut = w * 0.18, fin = w * (0.5 + hasardGri() * 0.2);
  var d2 = "M" + debut.toFixed(1) + ",17";
  for (var k = 1; k <= 14; k++) {
    var t = k / 14;
    var xx = debut + (fin - debut) * (k % 2 ? t : t * 0.55) + (hasardGri() - 0.5) * 8;
    var yy = (k % 2 ? 7 : 21) + (hasardGri() - 0.5) * 4;
    d2 += " L" + xx.toFixed(1) + "," + yy.toFixed(1);
  }

  b.insertAdjacentHTML("beforeend",
    '<svg viewBox="0 0 ' + w + ' 26" aria-hidden="true">' +
      '<path d="' + d1 + '" stroke-width="4.5"/>' +
      '<path d="' + d2 + '" stroke-width="2.6"/>' +
    "</svg>");

  // chaque trait est "rangé" (invisible) jusqu'à ce qu'on l'efface
  b.querySelectorAll("path").forEach(function (p) {
    var L = p.getTotalLength();
    p.style.strokeDasharray = L;
    p.style.strokeDashoffset = L;
  });
});




/* PAGE PROJET - le texte de gauche suit le chapitre qu'on regarde à droite */

var chapitres = document.querySelectorAll(".chapitre");
var texte = document.querySelector(".texte-chapitre .t");
var liens = document.querySelectorAll(".chapitres a");
var actuel = -1;

function montrerChapitre(i, direct) {
  if (i === actuel) return;
  actuel = i;

  var nouveau = chapitres[i].querySelector(".texte-mobile").innerHTML;
  var garder = !nouveau.trim();             // chapitre sans texte (ex. le mapping de Bois) : on garde le texte d'avant

  liens.forEach(function (l, j) {
    l.setAttribute("aria-current", j === i);
    l.classList.toggle("lu", j < i);        // les chapitres d'avant sont "effacés"
  });

  if (garder) return;
  // même texte que celui déjà affiché (ex. cyanotype ↔ mapping) : on ne refait pas l'effet
  if (nouveau.trim() === texte.innerHTML.trim()) return;
  if (direct) { texte.innerHTML = nouveau; return; }

  // petit fondu pendant que le texte change
  texte.classList.add("fondu");
  setTimeout(function () {
    texte.innerHTML = nouveau;
    texte.parentElement.scrollTop = 0;
    texte.classList.remove("fondu");
  }, 380);
}

if (chapitres.length && texte) {

  montrerChapitre(0, true);

  var obs = new IntersectionObserver(function (entrees) {
    entrees.forEach(function (e) {
      if (e.isIntersecting) montrerChapitre([].indexOf.call(chapitres, e.target));
    });
  }, { rootMargin: "-45% 0px -50% 0px" });

  chapitres.forEach(function (c) { obs.observe(c); });

  // tout en bas de la page : le dernier chapitre est fini aussi
  addEventListener("scroll", function () {
    if (!liens.length) return;
    var fini = innerHeight + scrollY >= document.body.scrollHeight - 40;
    liens[liens.length - 1].classList.toggle("lu", fini);
  });

  // clic sur un chapitre = on glisse jusqu'à lui
  liens.forEach(function (l, j) {
    l.addEventListener("click", function (e) {
      e.preventDefault();
      chapitres[j].scrollIntoView({ behavior: "smooth" });
    });
  });

}




/* VISIONNEUSE - clic sur une image pour la voir en grand,
   puis on se promène dans toutes les images du projet (gauche / droite) */

var visio = document.querySelector(".visio");

if (visio) {

  var visioImg = visio.querySelector("img");
  var toutes = [].slice.call(document.querySelectorAll("figure .im"));
  var pos = 0;

  function afficher(i, doux) {
    pos = (i + toutes.length) % toutes.length;     // après la dernière, on revient à la première
    var img = toutes[pos].querySelector("img");
    var poser = function () {
      visioImg.src = img.src;
      visioImg.alt = img.alt;
      visio.querySelector(".legende").textContent = img.alt;
      visio.querySelector(".compte").textContent = (pos + 1) + " / " + toutes.length;
      visioImg.classList.remove("change");
    };
    if (!doux) { poser(); return; }
    visioImg.classList.add("change");               // petit fondu entre deux images
    setTimeout(poser, 300);
  }

  function ouvrir(el) {
    afficher(toutes.indexOf(el));
    visio.classList.add("on");
    visio.querySelector(".fermer").focus();
  }

  function fermer() {
    visio.classList.remove("on");
    toutes[pos].focus();
  }

  toutes.forEach(function (el) {
    el.addEventListener("click", function () { ouvrir(el); });
    el.addEventListener("keydown", function (e) {
      if (e.key === "Enter" || e.key === " ") { e.preventDefault(); ouvrir(el); }
    });
  });

  visio.querySelector(".prec").addEventListener("click", function () { afficher(pos - 1, true); });
  visio.querySelector(".suiv").addEventListener("click", function () { afficher(pos + 1, true); });
  visio.querySelector(".fermer").addEventListener("click", fermer);

  // clavier : flèches pour avancer / reculer, Échap pour fermer
  document.addEventListener("keydown", function (e) {
    if (!visio.classList.contains("on")) return;
    if (e.key === "Escape") fermer();
    if (e.key === "ArrowRight") afficher(pos + 1, true);
    if (e.key === "ArrowLeft") afficher(pos - 1, true);
  });

}




/* À PROPOS - le CV apparaît doucement quand on y arrive */

var cv = document.getElementById("cv");

if (cv) {
  var obsCv = new IntersectionObserver(function (entrees) {
    if (entrees[0].isIntersecting) cv.classList.add("vu");
  }, { rootMargin: "0px 0px -35% 0px" });
  obsCv.observe(cv);
}


// la tache "bio" apparaît seulement quand on est descendu sur la page
if (document.body.classList.contains("apropos")) {
  addEventListener("scroll", function () {
    document.body.classList.toggle("descendu", scrollY > innerHeight * 0.4);
  });
}




/* PARTOUT - le menu de droite disparaît tout de suite quand on descend,
   et réapparaît peu à peu quand on remonte */
{
  var dernierY = scrollY;
  addEventListener("scroll", function () {
    var y = scrollY;
    if (y > dernierY && y > 10) document.body.classList.add("menu-cache");
    else if (y < dernierY - 2 || y <= 10) document.body.classList.remove("menu-cache");
    dernierY = y;
  }, { passive: true });
}




/* PAGES PROJET - un titre trop long pour la moitié gauche devient un peu plus petit
   (pour ne jamais passer sous la ligne pointillée) */
function ajusterTitre() {
  var t = document.querySelector(".projet-titre");
  if (!t) return;
  t.style.fontSize = "";
  var taille = parseFloat(getComputedStyle(t).fontSize);
  while (t.scrollWidth > t.clientWidth + 1 && taille > 30) {
    taille -= 2;
    t.style.fontSize = taille + "px";
  }
}
ajusterTitre();
addEventListener("resize", ajusterTitre);
if (document.fonts) document.fonts.ready.then(ajusterTitre);
}


/* ============================================================
   MENU : le trait de crayon sous les mots
   ============================================================ */
function initMenu() {
/* VERSION 7 : le trait de crayon, sous chaque mot du menu */
(function () {
  var trait = '<svg class="trait-menu" viewBox="0 0 200 10" preserveAspectRatio="none" aria-hidden="true"><path pathLength="1" d="M1.3,5.4 C1.6,5.4 2.5,5.2 3.1,5.2 C3.7,5.2 4.2,5.3 4.9,5.2 C5.6,5.2 6.6,5.0 7.4,4.9 C8.2,4.8 9.0,4.8 9.7,4.7 C10.4,4.6 10.8,4.3 11.5,4.2 C12.3,4.2 13.4,4.4 14.1,4.4 C14.9,4.4 15.5,4.3 16.1,4.2 C16.7,4.2 17.0,4.1 17.6,4.1 C18.2,4.1 19.1,4.0 19.9,4.1 C20.6,4.1 21.5,4.2 22.1,4.3 C22.8,4.4 23.0,4.5 23.6,4.6 C24.2,4.6 24.9,4.7 25.6,4.7 C26.4,4.7 27.2,4.5 27.9,4.5 C28.6,4.6 29.2,4.7 29.8,4.7 C30.5,4.7 31.0,4.6 31.7,4.6 C32.4,4.6 33.4,4.8 34.1,4.8 C34.8,4.9 35.2,4.7 35.9,4.7 C36.5,4.8 37.2,5.0 37.8,5.0 C38.4,5.0 38.9,4.9 39.5,4.8 C40.0,4.8 40.6,4.8 41.2,4.8 C41.8,4.8 42.2,4.8 42.8,4.7 C43.5,4.7 44.5,4.6 45.3,4.7 C46.0,4.8 46.8,5.1 47.4,5.2 C48.1,5.2 48.5,4.9 49.2,4.8 C49.8,4.7 50.5,4.8 51.3,4.8 C52.0,4.8 53.0,4.9 53.7,4.9 C54.3,4.9 54.4,4.7 55.1,4.8 C55.7,4.9 56.8,5.5 57.5,5.5 C58.3,5.6 58.8,5.3 59.4,5.2 C60.1,5.2 60.8,5.3 61.5,5.3 C62.2,5.2 62.7,5.0 63.4,4.9 C64.1,4.9 65.0,4.8 65.7,4.7 C66.4,4.6 66.9,4.3 67.6,4.3 C68.3,4.3 69.1,4.7 69.8,4.7 C70.6,4.8 71.2,4.6 71.9,4.5 C72.6,4.4 73.2,4.1 73.9,4.0 C74.5,4.0 74.9,4.4 75.6,4.3 C76.3,4.3 77.3,4.0 78.0,4.0 C78.7,3.9 79.2,4.1 79.8,4.2 C80.5,4.3 81.3,4.5 81.9,4.6 C82.6,4.7 83.0,4.8 83.7,4.9 C84.4,4.9 85.3,4.8 86.1,4.8 C86.8,4.8 87.5,4.8 88.2,4.7 C88.8,4.7 89.2,4.6 89.9,4.5 C90.6,4.5 91.7,4.4 92.3,4.5 C93.0,4.5 93.2,4.9 93.9,4.9 C94.5,5.0 95.6,4.9 96.4,4.9 C97.1,4.8 97.8,4.7 98.4,4.7 C99.0,4.7 99.5,4.8 100.1,4.8 C100.8,4.9 101.6,4.7 102.3,4.7 C103.0,4.7 103.5,4.7 104.2,4.9 C105.0,5.0 106.1,5.4 106.9,5.5 C107.7,5.6 108.4,5.3 109.0,5.5 C109.6,5.6 110.1,6.0 110.8,6.1 C111.4,6.2 112.3,6.2 112.9,6.2 C113.6,6.2 113.9,6.0 114.6,6.0 C115.2,6.0 116.2,6.4 116.9,6.4 C117.6,6.4 118.2,6.3 118.8,6.3 C119.4,6.3 119.7,6.4 120.4,6.4 C121.0,6.3 121.9,6.2 122.5,6.2 C123.2,6.1 123.6,6.1 124.2,6.1 C124.9,6.0 125.7,5.7 126.3,5.6 C127.0,5.6 127.7,6.0 128.2,5.9 C128.8,5.9 129.1,5.5 129.7,5.4 C130.4,5.3 131.3,5.5 132.0,5.4 C132.7,5.4 133.3,5.0 133.8,5.0 C134.4,5.0 134.9,5.5 135.6,5.5 C136.3,5.5 137.2,5.1 137.8,5.0 C138.4,4.9 138.7,4.9 139.2,4.9 C139.8,4.9 140.5,4.9 141.2,4.9 C141.9,5.0 142.6,5.2 143.4,5.1 C144.2,5.1 145.1,4.7 145.8,4.7 C146.6,4.6 147.2,4.8 147.9,4.8 C148.5,4.8 149.2,4.8 149.9,4.7 C150.5,4.7 151.0,4.5 151.6,4.5 C152.3,4.5 153.0,4.7 153.7,4.6 C154.4,4.5 155.0,4.0 155.7,4.0 C156.4,3.9 157.1,4.3 157.7,4.4 C158.4,4.5 159.1,4.5 159.7,4.5 C160.3,4.5 160.6,4.4 161.2,4.4 C161.8,4.5 162.6,4.7 163.3,4.7 C164.0,4.8 164.7,4.7 165.4,4.8 C166.1,4.8 166.8,4.8 167.4,4.8 C168.1,4.8 168.8,4.5 169.5,4.5 C170.1,4.5 170.7,4.8 171.4,4.9 C172.2,5.0 173.0,5.1 173.7,5.2 C174.4,5.2 174.7,5.5 175.4,5.5 C176.1,5.4 177.0,5.2 177.7,5.1 C178.4,5.1 178.9,5.1 179.6,5.2 C180.3,5.2 181.2,5.4 181.9,5.4 C182.7,5.4 183.2,5.2 184.0,5.2 C184.7,5.1 185.7,5.1 186.4,5.1 C187.2,5.2 187.6,5.4 188.5,5.4 C189.3,5.3 190.5,5.1 191.3,5.1 C192.0,5.1 192.4,5.5 193.0,5.4 C193.7,5.3 194.4,4.8 195.1,4.7 C195.7,4.7 196.4,5.2 197.2,5.2 C197.9,5.3 199.3,5.2 199.7,5.2"/><path pathLength="1" class="retour" d="M195.6,6.6 C195.2,6.6 194.0,6.5 193.4,6.5 C192.7,6.5 192.1,6.5 191.6,6.5 C191.0,6.5 190.6,6.5 190.0,6.5 C189.4,6.4 188.5,6.3 187.8,6.3 C187.1,6.3 186.5,6.4 185.8,6.5 C185.2,6.6 184.6,6.8 183.9,6.8 C183.2,6.8 182.2,6.5 181.4,6.5 C180.7,6.5 180.2,6.6 179.6,6.7 C179.0,6.8 178.4,6.9 177.8,6.9 C177.1,7.0 176.3,7.0 175.6,7.0 C174.9,7.0 174.3,7.0 173.7,7.0 C173.0,7.0 172.5,6.8 171.8,6.8 C171.1,6.7 170.2,6.9 169.6,6.9 C168.9,6.9 168.3,6.8 167.7,6.8 C167.1,6.9 166.6,7.3 166.0,7.3 C165.4,7.3 164.8,6.8 164.1,6.8 C163.4,6.8 162.5,7.1 161.8,7.1 C161.1,7.2 160.6,7.1 160.0,7.1 C159.4,7.2 158.9,7.2 158.3,7.3 C157.7,7.5 156.9,8.1 156.3,8.2 C155.7,8.3 155.4,8.0 154.8,8.0 C154.1,8.0 153.1,8.3 152.4,8.3 C151.7,8.2 151.4,7.7 150.7,7.6 C150.1,7.6 149.1,7.8 148.4,7.7 C147.7,7.7 147.2,7.5 146.5,7.4 C145.9,7.4 145.4,7.4 144.7,7.4 C143.9,7.4 143.0,7.6 142.2,7.6 C141.5,7.6 140.8,7.4 140.1,7.3 C139.5,7.2 138.8,7.2 138.1,7.1 C137.5,7.1 136.7,7.0 136.1,7.0 C135.5,7.1 135.1,7.2 134.4,7.2 C133.7,7.2 132.7,7.4 132.0,7.3 C131.2,7.2 130.5,7.0 129.8,6.9 C129.1,6.8 128.5,6.7 127.9,6.7 C127.2,6.7 126.5,7.0 125.8,7.0 C125.1,7.0 124.4,6.9 123.8,6.9 C123.2,6.8 123.1,6.8 122.4,6.8 C121.8,6.7 120.6,6.6 119.8,6.5 C119.1,6.5 118.4,6.5 117.8,6.5 C117.2,6.4 116.8,6.2 116.1,6.3 C115.4,6.3 114.3,6.6 113.5,6.7 C112.8,6.8 112.1,6.7 111.5,6.8 C110.9,6.9 110.3,7.3 109.7,7.4 C109.0,7.4 108.3,6.9 107.6,6.9 C107.0,6.9 106.5,7.4 105.9,7.4 C105.2,7.4 104.4,6.9 103.6,6.9 C102.9,6.9 102.0,7.2 101.3,7.2 C100.6,7.2 100.0,7.1 99.4,7.1 C98.8,7.1 98.1,7.4 97.5,7.4 C96.8,7.4 96.2,7.3 95.5,7.3 C94.8,7.2 93.7,7.0 93.0,7.1 C92.3,7.1 91.7,7.3 91.1,7.4 C90.6,7.4 90.3,7.5 89.7,7.5 C89.1,7.4 88.1,7.1 87.4,7.1 C86.8,7.1 86.5,7.4 85.9,7.4 C85.3,7.4 84.4,7.3 83.8,7.2 C83.1,7.2 82.6,7.2 81.9,7.2 C81.2,7.2 80.3,7.2 79.5,7.2 C78.8,7.2 78.2,7.4 77.6,7.3 C77.0,7.2 76.7,6.8 76.1,6.7 C75.4,6.6 74.3,6.8 73.6,6.8 C72.9,6.7 72.6,6.5 71.9,6.4 C71.2,6.4 70.3,6.4 69.5,6.4 C68.8,6.5 67.9,6.8 67.2,6.9 C66.6,7.0 66.2,7.1 65.5,7.1 C64.8,7.1 63.7,6.8 63.1,6.8 C62.4,6.8 62.2,7.1 61.5,7.2 C60.9,7.3 59.9,7.4 59.2,7.5 C58.6,7.6 58.2,7.6 57.5,7.7 C56.8,7.8 55.8,8.1 55.1,8.0 C54.4,8.0 53.8,7.5 53.1,7.4 C52.4,7.3 51.8,7.6 51.1,7.6 C50.4,7.6 49.8,7.3 49.1,7.3 C48.5,7.3 47.8,7.5 47.1,7.6 C46.3,7.7 45.3,7.8 44.7,7.9 C44.0,8.0 43.6,8.0 43.0,7.9 C42.4,7.9 41.6,7.5 40.9,7.4 C40.2,7.4 39.5,7.8 38.8,7.9 C38.1,8.0 37.2,8.0 36.4,8.0 C35.7,8.0 35.1,7.8 34.4,7.8 C33.7,7.8 32.9,8.2 32.1,8.1 C31.3,8.0 30.2,7.4 29.8,7.3"/></svg>';
  document.querySelectorAll(".menu a, .menu button").forEach(function (l) { l.insertAdjacentHTML("beforeend", trait); });
})();
}


/* ============================================================
   PAGE PROJETS : la grille et la carte
   ============================================================ */
function initProjets() {
if (!document.getElementById("vue-grille")) return;
/* VERSION 7 : écrit ici, directement dans la page */
/* =========================================================
   accueil.js — les 3 façons de regarder les projets
   grille / carte / liste  (les projets viennent de projets.js)
   ========================================================= */


var PROJETS = window.PROJETS;




/* =========================================================
   ACCESSOIRES - pince, trombone, ruban bleu, ruban gris
   posés en haut à gauche ou à droite des images (au hasard, mais toujours pareil),
   comme si les images étaient accrochées sur une planche
   ========================================================= */

var ACCESSOIRES = ["ruban-bleu"];   // VERSION 7 : seulement des rubans bleus (plus de pince, de trombone ni de ruban gris)

var graineAcc = 11;
function hasardAcc() {
  graineAcc = (graineAcc * 16807) % 2147483647;
  return (graineAcc - 1) / 2147483646;
}

// n = quel accessoire (on les fait tourner pour utiliser les 4)
function accessoire(n, coteForce) {
  var type = ACCESSOIRES[n % ACCESSOIRES.length];
  var cote = coteForce || (hasardAcc() < 0.5 ? "gauche" : "droite");
  var angle = ((hasardAcc() - 0.5) * 14).toFixed(1);        // un peu de travers, comme à la main
  return '<img class="acc acc-' + type + " " + cote + '" src="img/' + type + '.png" alt="" aria-hidden="true" draggable="false" style="--r:' + angle + 'deg">';
}
var vrais = PROJETS.filter(function (p) { return !p.aVenir; });

// partout pareil : le titre « Inspire (Bois) » en lettres simples, l'année seule en bleu écrit à la main
function texteP(p, champ) { return window.LANG === "en" && p[champ + "_en"] != null ? p[champ + "_en"] : p[champ]; }   // la version anglaise si on lit en anglais
function titreComplet(p, coupe) {
  var lignes = texteP(p, "lignes"), sous = texteP(p, "sous");
  var t = '<span class="titre-cap">' + (coupe && lignes ? lignes.join("<br>") : texteP(p, "titre")) + "</span>";
  if (!sous) return t;
  if (sous.length <= 16) return t + ' <span class="nowrap">(' + sous + ")</span>";
  var i = sous.lastIndexOf(" ");      // un long sous-titre peut passer à la ligne
  return t + " (" + sous.slice(0, i) + ' <span class="nowrap">' + sous.slice(i + 1) + ")</span>";
}function anneeSeule(p) { return p.aVenir ? "" : (p.annee.match(/\d{4}/) || [""])[0]; }




/* =========================================================
   1. GRILLE - les projets en quinconce, comme dans la maquette
   ========================================================= */

/* place de chaque projet : [gauche %, haut vw, largeur vw, hauteur vw]
   (le 1er est seul à droite sur le premier écran, la moitié gauche reste vide) */
var PLACES = [
  [54.6,   5.8, 42.4, 41],
  [ 4.3,  60.3, 42.4, 41],
  [54.7,  63.3, 42.4, 41],
  [ 4.3, 117,   26.2, 38],
  [41.3, 121,   54.9, 36],
  [ 3.6, 169,   54.9, 36],
  [61.7, 182,   35.4, 41],
  [ 4.3, 231,   42.4, 38],
  [54.7, 236,   42.4, 41]
];

// de quel côté on écrit le titre, pour chaque projet (mélangé "au hasard", toujours le même)


var grille = document.getElementById("vue-grille");
var basGrille = 0;

PROJETS.forEach(function (p, i) {
  var pl = PLACES[i % PLACES.length];
  var tour = Math.floor(i / PLACES.length) * 290;   // si un jour il y a plus de 9 projets
  var t = document.createElement(p.aVenir ? "div" : "a");

  t.className = "tuile" + (p.aVenir ? " a-venir" : "");
  if (!p.aVenir) t.href = p.page;

  t.style.left = pl[0] + "%";
  t.style.top = (pl[1] + tour) + "vw";

  var annee = anneeSeule(p);
  // image principale entière (sans la couper) : le cadre prend la forme de l'image
  var haut = p.entier ? +(pl[2] / p.entier).toFixed(2) : pl[3];
  var larg = pl[2];
  if (p.entier && haut > pl[3] + 4) {
    haut = pl[3] + 4;
    larg = +(haut * p.entier).toFixed(2);
    if (pl[0] > 50) t.style.left = (pl[0] + pl[2] - larg) + "%";   // colonne de droite : collée au bord droit
  }
  t.style.width = larg + "vw";

  t.innerHTML = accessoire(i) +
    '<span class="cadre" style="height:' + haut + 'vw">' +
      (p.aVenir ? "" : '<img src="' + p.couverture + '" alt="' + p.titre + '" loading="lazy">') +
    "</span>" +
    // sous l'image, sur une même ligne : le titre à gauche, l'année (bleue) à droite
    '<span class="legende-tuile" style="top:' + haut + 'vw">' +
      '<span class="titre-tuile' + (texteP(p, "lignes") && texteP(p, "lignes")[0].length > 24 ? " long" : "") + '">' + titreComplet(p, true) + "</span>" +
      (annee ? '<span class="annee-tuile main">' + annee + "</span>" : "") +
    "</span>";

  grille.appendChild(t);
  basGrille = Math.max(basGrille, pl[1] + tour + haut);
});

// la hauteur de la grille = jusqu'au bas de la dernière image, + de l'air
grille.style.height = (basGrille + 12) + "vw";




/* =========================================================
   2. CARTE - toutes les images posées sur une grande table,
      on glisse pour se promener, on zoome avec la molette
   ========================================================= */

var carte = document.getElementById("vue-carte");
var monde = carte.querySelector(".monde");

var W = 5200, H = 3300;          // la taille de la "table"
monde.style.width = W + "px";
monde.style.height = H + "px";


// un hasard qui donne toujours le même résultat (la carte ne change pas à chaque visite)
var graine = 7;
function hasard() {
  graine = (graine * 16807) % 2147483647;
  return (graine - 1) / 2147483646;
}


// on prépare tous les éléments : les images des projets + les projets à venir
var elements = [];

// VERSION 7 : sur la carte, seulement 2 ou 3 images choisies par projet (sinon c'est le chaos)
var CARTE = {
  "01": [["img/b-objet-2.jpg", 0.75], ["img/b-cyano-1.jpg", 1.0], ["img/b-mapping.jpg", 1.41, "plan"]],
  "02": [["img/a-vue-ext.jpg", 1.79], ["img/a-int-gradins.jpg", 1.78], ["img/a-plan.jpg", 1.01, "plan"]],
  "03": [["img/f-maquette.jpg", 1.36], ["img/f-bulle.jpg", 0.75], ["img/f-plan-bulles.jpg", 1.14, "plan"]],
  "04": [["img/s-coupe-persp.jpg", 1.77, "plan"], ["img/s-rotonde.jpg", 0.78, "plan"]],
  "05": [["img/n-rendu.jpg", 1.78], ["img/n-mirabilia.jpg", 1.5], ["img/n-robot-3.jpg", 0.68]],
  "06": [["img/m-expo-1.jpg", 0.75], ["img/m-machine-3.jpg", 1.44]],
  "07": [["img/o-diable-1.jpg", 0.8], ["img/o-croquis.jpg", 1.02, "plan"], ["img/o-rue.jpg", 0.86]],
  "08": [["img/v-image.jpg", 1.78], ["img/v-processus.jpg", 0.75]],
  "09": [["img/c-ext.jpg", 1.18], ["img/c-maq-a2.jpg", 1.3], ["img/c-int-3.jpg", 1.18]]
};
vrais.forEach(function (p) {
  (CARTE[p.no] || p.images.slice(0, 3)).forEach(function (im) {
    elements.push({ p: p, src: im[0], ratio: im[1], plan: im[2] === "plan" });
  });
});

PROJETS.filter(function (p) { return p.aVenir; }).forEach(function (p) {
  elements.push({ p: p, ratio: 0.8 + hasard() * 0.6, vide: true });
});

// on mélange
elements.sort(function () { return hasard() - 0.5; });


// on pose chaque élément sans qu'il en chevauche un autre
var poses = [];
var nAcc = 0;

// VERSION 7 : la table est divisée en cases invisibles (une par image, dans un ordre mélangé) ;
// chaque image est posée au hasard dans sa case, avec une taille un peu différente : réparti, jamais l'une sur l'autre
var nCol = 1, nRang = elements.length, meilleur = 1e9;
for (var c = 1; c <= elements.length; c++) {          // le nombre de colonnes qui laisse le moins de cases vides (cases pas trop allongées)
  var rr = Math.ceil(elements.length / c), vides = c * rr - elements.length;
  var forme = Math.abs(Math.log((W / c) / (H / rr) / 1.15));
  var score = vides * 3 + forme;
  if (score < meilleur) { meilleur = score; nCol = c; nRang = rr; }
}
var caseW = (W - 160) / nCol, caseH = (H - 160) / nRang;
var cases = [];
for (var q = 0; q < nCol * nRang; q++) cases.push(q);
cases.sort(function () { return hasard() - 0.5; });       // les cases vides tombent n'importe où, pas toutes en bas
elements.forEach(function (el, k) {
  var aire = 200000 + hasard() * 190000;
  var w = Math.sqrt(aire * el.ratio);
  var h = w / el.ratio;
  var maxW = caseW - 110, maxH = caseH - 120;              // de l'air autour (et la place de l'étiquette)
  if (w > maxW) { w = maxW; h = w / el.ratio; }
  if (h > maxH) { h = maxH; w = h * el.ratio; }
  var c = cases[k] % nCol, r = Math.floor(cases[k] / nCol);
  var x = 80 + c * caseW + 30 + hasard() * (caseW - 60 - w);
  var y = 80 + r * caseH + 30 + hasard() * (caseH - 100 - h);
  poses.push({ x: x, y: y, w: w, h: h });

  var n = document.createElement(el.vide ? "div" : "a");
  n.className = "point" + (el.vide ? " a-venir" : "");
  n.draggable = false;
  if (!el.vide) n.href = el.p.page;
  // un peu de travers, comme posées à la main sur la table
  n.style.cssText = "left:" + x + "px;top:" + y + "px;width:" + w + "px;height:" + h + "px;transform:rotate(" + ((hasard() - 0.5) * 6).toFixed(1) + "deg)";
  n.innerHTML = (nAcc++ % 3 === 0 && !el.plan ? accessoire(nAcc) : "") +
    (el.vide ? "" : '<span class="p-cadre"><img src="' + el.src + '" alt="" loading="lazy" draggable="false"></span>') +
    (el.vide ? '<span class="etiquette main">' + el.p.no + " à venir</span>"
             : '<span class="etiquette">' + titreComplet(el.p) + ' <span class="main">' + anneeSeule(el.p) + "</span></span>");
  monde.appendChild(n);
});


// position et zoom de la caméra
var cam = { x: 0, y: 0, s: 1 };       // où on est
var vise = { x: 0, y: 0, s: 1 };      // où on va (pour glisser en douceur)
var zMin = 0.1, zMax = 1.5;

function vueDEnsemble() {
  var s = Math.min(innerWidth / W, (innerHeight - 40) / H) * 0.96;
  if (window.MOBILE()) s = Math.min((innerHeight - 140) / H, innerWidth / W * 2.2);   // téléphone : les images plus grandes, on glisse pour voir le reste
  zMin = s * 0.5;
  vise.s = s;
  vise.x = (innerWidth - W * s) / 2;
  vise.y = (innerHeight - H * s) / 2 + 20;
}

vueDEnsemble();
cam.x = vise.x; cam.y = vise.y; cam.s = vise.s;

function zoomer(f, cx, cy) {
  var s = Math.max(zMin, Math.min(zMax, vise.s * f));
  f = s / vise.s;
  vise.x = cx - (cx - vise.x) * f;
  vise.y = cy - (cy - vise.y) * f;
  vise.s = s;
}

// la caméra rejoint doucement la cible
function boucle() {
  cam.x += (vise.x - cam.x) * 0.18;
  cam.y += (vise.y - cam.y) * 0.18;
  cam.s += (vise.s - cam.s) * 0.18;
  monde.style.transform = "translate(" + cam.x + "px," + cam.y + "px) scale(" + cam.s + ")";
  requestAnimationFrame(boucle);
}

boucle();


// molette / pavé tactile = zoom
carte.addEventListener("wheel", function (e) {
  e.preventDefault();
  if (e.ctrlKey || Math.abs(e.deltaY) > Math.abs(e.deltaX)) {
    zoomer(Math.exp(-e.deltaY * (e.ctrlKey ? 0.01 : 0.0018)), e.clientX, e.clientY);
  } else {
    vise.x -= e.deltaX; vise.y -= e.deltaY;
  }
}, { passive: false });


// glisser une image = on la déplace (comme les croquis de l'accueil) ; glisser le fond = on se promène
var tire = null, bouge = 0, prise = null, zPoint = 100;

carte.addEventListener("dragstart", function (e) { e.preventDefault(); });
pincer(carte, function (f, cx, cy, dx, dy) { if (prise) { prise.el.classList.remove("prise"); prise = null; } tire = null; zoomer(f, cx, cy); vise.x += dx; vise.y += dy; bouge = 99; });   // Safari : pas de « glisser le lien »

carte.addEventListener("pointerdown", function (e) {
  if (e.button > 0) return;
  bouge = 0;
  var pt = e.target.closest(".point");
  if (pt) {
    prise = { el: pt, x: e.clientX, y: e.clientY, l: parseFloat(pt.style.left), t: parseFloat(pt.style.top) };
    pt.style.zIndex = ++zPoint;
    pt.classList.add("prise");
  } else {
    tire = { x: e.clientX, y: e.clientY };
  }
  carte.classList.add("tire");
});

addEventListener("pointermove", function (e) {
  if (carte.dataset.pince) return;                  // deux doigts : on zoome, on ne tire rien
  if (prise) {
    var dx = e.clientX - prise.x, dy = e.clientY - prise.y;
    bouge = Math.abs(dx) + Math.abs(dy);
    prise.el.style.left = (prise.l + dx / cam.s) + "px";
    prise.el.style.top = (prise.t + dy / cam.s) + "px";
    return;
  }
  if (!tire) return;
  var dx = e.clientX - tire.x, dy = e.clientY - tire.y;
  bouge += Math.abs(dx) + Math.abs(dy);
  vise.x += dx; vise.y += dy;
  cam.x += dx; cam.y += dy;   // la caméra suit tout de suite pendant qu'on tire
  tire = { x: e.clientX, y: e.clientY };
});

addEventListener("pointerup", function () {
  if (prise) prise.el.classList.remove("prise");
  tire = null; prise = null;
  carte.classList.remove("tire");
});

// si on a glissé, ce n'est pas un clic sur l'image
carte.addEventListener("click", function (e) {
  if (bouge > 6) { e.preventDefault(); e.stopPropagation(); }
}, true);

// double-clic = on s'approche
carte.addEventListener("dblclick", function (e) {
  zoomer(2, e.clientX, e.clientY);
});

// boutons + / -


addEventListener("resize", function () { if (vue === "carte") vueDEnsemble(); });




/* =========================================================
   3. LISTE - les titres à gauche, les images à droite
   ========================================================= */

var sommaire = document.getElementById("sommaire");
var mosaique = document.getElementById("mosaique");
var choisi = null;

PROJETS.forEach(function (p) {
  var li = document.createElement("li");
  li.innerHTML =
    '<button type="button" class="entree' + (p.aVenir ? " a-venir" : "") + '" data-no="' + p.no + '">' +
      '<span class="t">' + titreComplet(p) + "</span>" +
      '<span class="annee main">' + anneeSeule(p) + "</span>" +
    "</button>";
  sommaire.appendChild(li);
});

dessinerCrayons(sommaire);


function placerNotes() {}   // (plus de petite note à placer)


// rangées « justifiées », calculées en pixels (pas de coupe, même dans Safari) :
// chaque rangée remplit la largeur jusqu'à la marge ; si c'est trop haut pour l'écran, tout rapetisse ensemble
function ajusterRangees() {
  if (!mosaique.classList.contains("rangees")) return;
  var G = 9;
  var L = mosaique.clientWidth, H = mosaique.clientHeight;
  var rangees = [].slice.call(mosaique.querySelectorAll(".rangee"));
  var hauteurs = rangees.map(function (r) {
    var somme = 0;
    r.querySelectorAll("a").forEach(function (a) { somme += +a.dataset.r; });
    return (L - G * (r.children.length - 1)) / somme;
  });
  var total = hauteurs.reduce(function (s, h) { return s + h; }, 0) + G * (rangees.length - 1);
  var f = total > H ? (H - G * (rangees.length - 1)) / (total - G * (rangees.length - 1)) : 1;
  rangees.forEach(function (r, i) {
    var h = Math.floor(hauteurs[i] * f);
    r.querySelectorAll("a").forEach(function (a) {
      a.style.width = Math.floor(h * a.dataset.r) + "px";
      a.style.height = h + "px";
    });
  });
}
addEventListener("resize", ajusterRangees);


function montrerImages(p) {
  if (choisi === p) return;
  choisi = p;

  sommaire.querySelectorAll(".entree").forEach(function (b) {
    b.classList.toggle("choisi", b.dataset.no === p.no);
  });

  mosaique.classList.add("fondu");

  setTimeout(function () {
    mosaique.classList.remove("rangees");
    if (p.aVenir) {
      mosaique.innerHTML = '<div class="vide main">' + p.titre + " — à venir</div>";
    } else {
      mosaique.classList.toggle("rangees", !!p.liste);
      if (p.liste) {
        // rangées « justifiées » : chaque image garde ses proportions, rien n'est coupé
        var n = 0;
        mosaique.innerHTML = p.liste.map(function (rangee) {
          return '<div class="rangee">' + rangee.map(function (im, k) {
            n++;
            // côté de l'accessoire : jamais vers la ligne pointillée (1re image d'une rangée → à droite)
            var cote = k === 0 ? "droite" : "gauche";
            var acc = n === 2 ? accessoire(Number(p.no), cote) : n === 3 ? accessoire(Number(p.no) + 2, cote) : "";
            return '<a href="' + p.page + '" data-r="' + im[1] + '">' + acc + '<span class="m-im"><img src="' + im[0] + '" alt="' + p.titre + '"></span></a>';
          }).join("") + "</div>";
        }).join("");
        ajusterRangees();
        mosaique.classList.remove("fondu");
        return;
      }
      mosaique.innerHTML = p.images.slice(0, 7).map(function (im, k) {
        // (côté choisi pour ne pas sortir de l'écran ni passer sur la ligne pointillée)
        var acc = k === 1 ? accessoire(Number(p.no), "gauche") : k === 5 ? accessoire(Number(p.no) + 2, "droite") : "";
        return '<a href="' + p.page + '">' + acc + '<span class="m-im"><img src="' + im[0] + '" alt="' + p.titre + '"></span></a>';
      }).join("");
    }
    mosaique.classList.remove("fondu");
  }, 300);
}


// survol = on regarde / clic = on choisit, 2e clic = on ouvre le projet
sommaire.addEventListener("pointerover", function (e) {
  var b = e.target.closest(".entree:not(.a-venir)");
  if (b) montrerImages(PROJETS.find(function (p) { return p.no === b.dataset.no; }));
});

sommaire.addEventListener("click", function (e) {
  var b = e.target.closest(".entree");
  if (!b) return;
  var p = PROJETS.find(function (q) { return q.no === b.dataset.no; });
  if (b.classList.contains("choisi") && !p.aVenir && e.detail > 0 && b.dataset.vu) {
    document.body.classList.add("part");
    setTimeout(function () { location.href = p.page; }, 400);
    return;
  }
  sommaire.querySelectorAll(".entree").forEach(function (x) { delete x.dataset.vu; });
  b.dataset.vu = 1;
  montrerImages(p);
});

montrerImages(vrais[0]);




/* =========================================================
   CHANGER DE VUE - les 3 boutons en bas à gauche
   ========================================================= */

var vue = "grille";
var boutons = document.querySelectorAll(".choix-vue button");


function changerVue(v) {
  vue = v;

  document.querySelectorAll(".vue").forEach(function (el) {
    el.classList.toggle("on", el.id === "vue-" + v);
  });

  boutons.forEach(function (b) {
    b.setAttribute("aria-pressed", b.dataset.vue === v);
  });

  // la grille défile, la carte et la liste non
  document.body.classList.toggle("fixe", v !== "grille");


  if (v === "carte") vueDEnsemble();
  if (v === "liste") placerNotes();
  if (v === "grille") scrollTo(0, 0);

  
  try { localStorage.setItem("vue-rose", v); } catch (e) {}
}

boutons.forEach(function (b) {
  b.addEventListener("click", function () { changerVue(b.dataset.vue); });
});

// on revient sur la dernière vue choisie
var depart = location.hash.slice(1);
if (["grille", "carte", "liste"].indexOf(depart) < 0) {
  try { depart = localStorage.getItem("vue-rose"); } catch (e) {}
}
changerVue(["grille", "carte", "liste"].indexOf(depart) >= 0 ? depart : "grille");
}


/* ============================================================
   ACCUEIL : les feuilles de calque
   ============================================================ */
function initAccueil() {
if (!document.getElementById("calques")) return;
/* VERSION 7 : écrit ici, directement dans la page */
/* =========================================================
   calque.js — ACCUEIL, idée 1 : la grande table de calques
   tous les croquis de Rose, chacun sur une feuille de papier calque, posés sur une grande table.
   on arrive en vue d'ensemble ; molette / pincement = zoomer, glisser le fond = se promener,
   glisser une feuille = la déplacer (elle passe par-dessus), double-clic = s'approcher.
   ========================================================= */

/* [croquis ("" = calque vide), x, y, hauteur (px de la table), angle, rubans]
   rubans : "hg" "hd" "bg" "bd" (coins), "h" (milieu haut), "g" / "d" (milieu des côtés)
   l'ordre = l'empilement : la première est tout en dessous */
var FEUILLES = [
  // les feuilles du dessous
  ["img/croquis/017f.png",    1000,  520, 820,  -6, []],     // mapping (page 18 du carnet)
  ["img/croquis/006r.png",    2380,  600, 560,   5, []],     // plan coté (page 6)
  ["img/croquis/006l.png",     380, 1250, 720,   3, []],     // notes et détails (page 6)
  ["img/croquis/008r.png",     520,  300, 650,   6, []],
  ["img/croquis/016l.png",    1930,  380, 640,  -5, []],
  ["img/croquis/010r.png",    1180, 1220, 620,   4, []],
  ["img/croquis/005f.png",    3060, 1250, 640,  -4, []],

  // rangée du haut
  ["img/croquis/008l.png",     200,  100, 700,  -3, ["hg:bleu"]],
  ["img/croquis/010l.png",     820,   60, 680,   2, []],
  ["img/croquis/012f.png",    1380,  170, 560,  -1, []],
  ["img/croquis/011r.png",    2270,   80, 720,   3, ["hd:bleu"]],
  ["img/croquis/009r.png",    2880,  220, 640,  -2, []],

  // rangée du milieu
  ["img/croquis/013r.png",      80,  860, 720,   2, ["hd:bleu"]],
  ["img/croquis/015l.png",     700,  780, 700,  -4, ["bg:bleu"]],
  ["img/croquis/003.png",     1180,  800, 540,   1, []],
  ["img/croquis/014f.png",    2070,  900, 620,  -2, ["bd:bleu"]],
  ["img/croquis/016r.png",    2790,  870, 700,   4, []],

  // rangée du bas
  ["img/croquis/019f.png",     160, 1590, 560,  -2, ["hg:bleu"]],
  ["img/croquis/009l.png",     860, 1470, 700,   3, []],
  ["img/croquis/011l.png",    1460, 1500, 680,  -1.5, []],
  ["img/croquis/020r.png",    2010, 1520, 680,   2, []],
  ["img/croquis/013l.png",    2560, 1540, 660,  -3, ["hd:bleu"]]
];

// déplacements (px de la table) pour mieux répartir les croquis sur la page d'accueil
var DEPLACE = {
  "008l": [-211, -211],
  "008r": [0, -200],
  "010l": [75, -263],
  "012f": [302, -452],
  "011r": [200, -264],
  "009r": [166, -286],
  "006r": [449, -11],
  "016r": [339, -53],
  "005f": [237, 375],
  "013l": [180, 150],
  "020r": [60, 170],
  "011l": [113, 234],
  "009l": [121, 302],
  "019f": [-181, 204],
  "013r": [-162, 19],
  "017f": [151, -151],
  "015l": [94, -120],
  "003": [520, 420],
  "014f": [132, -75],
  "010r": [-19, -57],
  "006l": [38, 113],
  "016l": [151, 0]
};

var W = 4450, H = 2640;                               // la taille de la table
var zone = document.getElementById("calques");
var monde = zone.querySelector(".monde-calques");
monde.style.width = W + "px";
monde.style.height = H + "px";
var z = 10;


/* ---------- 1. on pose les feuilles ---------- */

var nbRubans = 0;
FEUILLES.forEach(function (f) { nbRubans += f[5].length; });
var graine = 7;
function hasard() { graine = (graine * 16807) % 2147483647; return (graine - 1) / 2147483646; }
var couleurs = [];
for (var q = 0; q < nbRubans; q++) couleurs.push("bleu");   // VERSION 7 : seulement des rubans bleus
for (var q = couleurs.length - 1; q > 0; q--) { var r = Math.floor(hasard() * (q + 1)); var t = couleurs[q]; couleurs[q] = couleurs[r]; couleurs[r] = t; }
var qc = 0;
var feuilleEl = {};

FEUILLES.forEach(function (f, i) {
  var el = document.createElement("div");
  el.className = "calque" + (f[0] ? "" : " vide");
  // on aère : plus d\'espace entre les croquis, surtout vers la gauche
  var px = f[1] < 1900 ? f[1] * 1.22 : 2318 + (f[1] - 1900) * 1.12;
  // VERSION 7 : les croquis un peu plus répartis (d'après la capture de Victoria)
  var dep = DEPLACE[(f[0] || "").replace(/.*\//, "").replace(".png", "")] || [0, 0];
  el.style.left = (px + dep[0]) + "px";
  el.style.top = (f[2] * 1.12 + dep[1]) + "px";
  el.style.height = f[3] + "px";
  if (!f[0]) el.style.width = (f[3] * 0.72) + "px";
  el.style.setProperty("--a", f[4] + "deg");
  el.style.zIndex = ++z;
  el.innerHTML = (f[0] ? '<img src="' + f[0] + '" alt="Croquis de Rose" draggable="false">' : "") +
    f[5].map(function (p, k) {
      var c = p.indexOf(":") > 0 ? p.split(":")[1] : couleurs[qc++];   // "hg:bleu" = couleur choisie
      p = p.split(":")[0];
      return '<img class="scotch ' + p.split(" ")[0] + " " + c + '" src="img/ruban-' + c + '.png" alt="" draggable="false" style="--t:' + ((i * 7 + k * 13) % 11 - 5) + 'deg">';
    }).join("");
  monde.appendChild(el);
  if (f[0]) feuilleEl[f[0].replace(/.*\//, "").replace(".png", "")] = el;
});




/* ---------- 1d. les petites notes à la main (idée de carte mentale) ----------
   [croquis, x, y (fractions de la feuille), texte, angle, taille, flèche : [angle, miroir] ou 0, cercle ?]
   Elles restent accrochées à leur feuille quand on la déplace. À valider avec Rose. */

var NOTES_EN = ["formal research", "relations, flows, siting", "human scale, atmosphere", "construction principle", "axonometry: reading the volumes", "rhythm of the arcade", "section, light", "furniture: use studies", "plan: organizing spaces", "structure + façade, modular grid", "massing, profiles"];   // les mêmes notes, en anglais (même ordre)
var NOTES = [
  // à gauche (flèche vers la droite)
  ["008l", -0.30, 0.22, "recherche formelle", -5, 1, [-15, 0, 1], 1],
  ["013r", -0.36, 0.55, "relations, flux, implantation", -3, 1, [-25, 0, 0], 0],
  ["019f", -0.30, 0.45, "échelle humaine, ambiance", 3, 1, [-20, 0, 2], 0],
  // en haut (flèche vers le bas)
  ["010l", 0.45, -0.22, "principe constructif", 2, 1, [60, 0, 3], 0],
  ["012f", 0.50, -0.26, "axonométrie : lecture des volumes", -2, 1, [60, 0, 0], 0],
  ["011r", 0.55, -0.15, "rythme de l’arcade", 3, 1, [55, 0, 4], 1],
  // à droite (flèche vers la gauche)
  ["009r", 1.32, 0.35, "coupe, lumière", 4, 1, [20, 1, 2], 0],
  ["016r", 1.34, 0.25, "mobilier : études d’usage", -3, 1, [25, 1, 5], 0],
  ["005f", 1.30, 0.50, "plan : organisation des espaces", 3, 1, [20, 1, 1], 0],
  // en bas
  ["009l", 0.50, 1.10, "structure + façade, trame modulaire", 2, 1, 0, 0],
  ["011l", 0.50, 1.10, "gabarits, profils", -2, 1, 0, 0]
];
var TRAITS = [
  // 0 : flèche courbe
  '<path d="M4 8 C 30 2, 62 14, 80 46" fill="none"/><path d="M66 44 L81 49 L82 33" fill="none"/>',
  // 1 : ligne droite, sans flèche
  '<path d="M3 5 L 38 24 L 82 46" fill="none"/>',
  // 2 : ligne courbe, sans flèche
  '<path d="M4 10 C 14 46, 52 58, 84 40" fill="none"/>',
  // 3 : flèche droite
  '<path d="M3 6 L 40 26 L 80 46" fill="none"/><path d="M64 48 L81 47 L74 31" fill="none"/>',
  // 4 : ligne en S, finie par un point
  '<path d="M4 6 C 40 -2, 30 40, 70 40 C 76 40, 80 44, 82 48" fill="none"/><circle cx="83" cy="49" r="3" fill="currentColor"/>',
  // 5 : ligne droite courte avec petit coude
  '<path d="M3 8 L 30 8 L 70 50" fill="none"/>'
];
function dessinTrait(t) {
  return '<svg class="fleche" viewBox="0 0 90 60" style="transform:rotate(' + t[0] + 'deg) scaleX(' + (t[1] ? -1 : 1) + ')" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round">' + TRAITS[t[2] || 0] + '</svg>';
}
var calqueNotes = document.createElement("div");
calqueNotes.className = "notes";
monde.appendChild(calqueNotes);
var TRAITS_BLEUS = [0, 3, 6];   // quelques lignes en bleu (les autres restent noires)
NOTES.forEach(function (n, i) {
  var d = document.createElement("div");
  d.className = "note main" + (n[2] > 1 ? " sous-croquis" : "") + (n[7] ? " ronde" : "") + (TRAITS_BLEUS.indexOf(i) >= 0 ? " trait-bleu" : "");
  d.style.setProperty("--r", n[4] + "deg");
  d.innerHTML = '<span>' + (window.LANG === "en" ? NOTES_EN[i] : n[3]).replace(/ ([:;!?])/g, "\u00a0$1") + '</span>' + (n[6] ? dessinTrait(n[6]) : "");   // « : » jamais seul en début de ligne
  calqueNotes.appendChild(d);
  n.el = d;
});

/* VERSION 7 : les flèches, les lignes et les cercles des notes, redessinés au crayon bleu,
   comme le trait qui souligne les mots du menu : une ligne qui tremble un peu, puis un petit retour plus fin */
var graineCrayon = 29;
function hasardCrayon() { graineCrayon = (graineCrayon * 16807) % 2147483647; return (graineCrayon - 1) / 2147483646; }
function lisse(pts) {                 // une courbe douce qui passe par les points
  var s = "M" + pts[0][0].toFixed(1) + "," + pts[0][1].toFixed(1);
  for (var i = 1; i < pts.length - 1; i++) {
    var mx = (pts[i][0] + pts[i + 1][0]) / 2, my = (pts[i][1] + pts[i + 1][1]) / 2;
    s += " Q" + pts[i][0].toFixed(1) + "," + pts[i][1].toFixed(1) + " " + mx.toFixed(1) + "," + my.toFixed(1);
  }
  var z = pts[pts.length - 1];
  return s + " L" + z[0].toFixed(1) + "," + z[1].toFixed(1);
}
function tremble(pts, amp) {          // un tremblement doux (pas un zigzag) : chaque écart suit un peu le précédent
  var e = 0;
  return pts.map(function (p, i) {
    e = e * 0.6 + (hasardCrayon() - 0.5) * amp;
    var a = pts[Math.min(i + 1, pts.length - 1)], b = pts[Math.max(i - 1, 0)];
    var dx = a[0] - b[0], dy = a[1] - b[1], L = Math.hypot(dx, dy) || 1;
    return [p[0] - dy / L * e, p[1] + dx / L * e];
  });
}
function auCrayon(svg) {
  [].slice.call(svg.querySelectorAll("path")).forEach(function (p) {
    var L = p.getTotalLength(), n = Math.max(6, Math.round(L / 2.2)), pts = [];
    for (var i = 0; i <= n; i++) { var q = p.getPointAtLength(L * i / n); pts.push([q.x, q.y]); }
    p.setAttribute("d", lisse(tremble(pts, 1.1)));
    if (L > 22) {                      // le retour : repart de la fin, plus fin, à peine décalé
      var r = pts.slice(Math.round(n * 0.45)).reverse().map(function (q) { return [q[0] + 0.7, q[1] + 0.9]; });
      var p2 = document.createElementNS("http://www.w3.org/2000/svg", "path");
      p2.setAttribute("class", "retour");
      p2.setAttribute("d", lisse(tremble(r, 1.4)));
      p.parentNode.insertBefore(p2, p.nextSibling);
    }
  });
}
// le cercle autour d'une note : une boucle à main levée (même crayon, même épaisseur que les flèches), qui dépasse un peu son départ ;
// redessiné à la taille réelle du mot (sans étirement), chaque fois que la taille des notes change
function cercleAuCrayon(n, k) {
  var span = n.el.querySelector("span");
  var w = span.offsetWidth, h = span.offsetHeight, F = parseFloat(getComputedStyle(n.el).fontSize) || 74;
  if (!w || !h) return;
  var g = 97 + k * 31;
  function rnd() { g = (g * 16807) % 2147483647; return (g - 1) / 2147483646; }
  var pts = [], tours = 1.1, m = 72, d0 = 2.4 + rnd() * 1.2, rx = w / 2 * 1.05, ry = h / 2 * 1.16, e = 0;
  for (var i = 0; i <= m; i++) {
    var t = i / m, a = d0 + t * tours * 6.283;
    e = e * 0.7 + (rnd() - 0.5) * 0.05;
    var r = 1 + e + t * 0.06;                              // la fin repasse un peu à côté du début, comme à la main
    pts.push([w / 2 + rx * r * Math.cos(a), h / 2 + ry * r * Math.sin(a)]);
  }
  var ep = (F * 0.045).toFixed(2);
  var svg = span.querySelector(".cercle");
  if (!svg) { span.insertAdjacentHTML("beforeend", '<svg class="cercle" aria-hidden="true"></svg>'); svg = span.querySelector(".cercle"); }
  svg.setAttribute("viewBox", "0 0 " + w + " " + h);
  svg.innerHTML = '<path style="stroke-width:' + ep + 'px;vector-effect:none" d="' + lisse(pts) + '"/>';
}
NOTES.forEach(function (n) {
  var f = n.el.querySelector(".fleche");
  if (f) auCrayon(f);

});

function poserNotes() {
  // VERSION 7 : les notes sont plus grandes ; on les pousse juste assez pour qu'elles restent à côté de leur croquis, sans le couvrir
  var gap = (parseFloat(monde.style.getPropertyValue("--note")) || 74) * 0.3;
  NOTES.forEach(function (n, k) { if (n[7]) cercleAuCrayon(n, k); });
  NOTES.forEach(function (n) {
    var f = feuilleEl[n[0]];
    if (!f) { n.el.style.display = "none"; return; }
    var x = f.offsetLeft + n[1] * f.offsetWidth, y = f.offsetTop + n[2] * f.offsetHeight;
    var w2 = n.el.offsetWidth / 2, h2 = n.el.offsetHeight / 2;
    if (n[1] < 0) x = Math.min(x, f.offsetLeft - gap - w2);
    if (n[1] > 1) x = Math.max(x, f.offsetLeft + f.offsetWidth + gap + w2);
    if (n[2] < 0) y = Math.min(y, f.offsetTop - gap - h2);
    if (n[2] > 1) y = Math.max(y, f.offsetTop + f.offsetHeight + gap + h2);
    n.el.style.left = x + "px";
    n.el.style.top = y + "px";
    n.x = x; n.y = y; n.w2 = w2; n.h2 = h2;
  });
  // deux notes qui se touchent : on les écarte doucement l'une de l'autre (de côté)
  var vis = NOTES.filter(function (n) { return n.el.style.display !== "none"; });
  for (var tour = 0; tour < 6; tour++) {
    for (var i = 0; i < vis.length; i++) for (var j = i + 1; j < vis.length; j++) {
      var a = vis[i], b = vis[j];
      var ox = a.w2 + b.w2 + gap * 0.6 - Math.abs(a.x - b.x), oy = a.h2 + b.h2 + gap * 0.3 - Math.abs(a.y - b.y);
      if (ox > 0 && oy > 0) {
        var s = a.x <= b.x ? 1 : -1;
        a.x -= s * ox / 2; b.x += s * ox / 2;
        a.el.style.left = a.x + "px"; b.el.style.left = b.x + "px";
      }
    }
  }
}
poserNotes();


/* ---------- 1c. on centre le groupe de croquis au milieu de la table ---------- */

function recentrer() {
  // VERSION 7 : le groupe = les croquis ET leurs notes (les notes ne sortent jamais de l'écran) ;
  // on recalcule 3 fois, parce que la taille des notes dépend du zoom, et le zoom de la place qu'elles prennent
  var els = monde.querySelectorAll(".calque");
  for (var passe = 0; passe < 3; passe++) {
    var x0 = 1e9, y0 = 1e9, x1 = -1e9, y1 = -1e9;
    els.forEach(function (el) {
      x0 = Math.min(x0, el.offsetLeft); y0 = Math.min(y0, el.offsetTop);
      x1 = Math.max(x1, el.offsetLeft + el.offsetWidth); y1 = Math.max(y1, el.offsetTop + el.offsetHeight);
    });
    NOTES.forEach(function (n) {
      if (n.el.style.display === "none") return;
      var l = n.el.offsetLeft - n.el.offsetWidth / 2, t = n.el.offsetTop - n.el.offsetHeight / 2;
      x0 = Math.min(x0, l); y0 = Math.min(y0, t);
      x1 = Math.max(x1, l + n.el.offsetWidth); y1 = Math.max(y1, t + n.el.offsetHeight);
    });
    var pad = 60;
    els.forEach(function (el) {
      el.style.left = (el.offsetLeft - x0 + pad) + "px";
      el.style.top = (el.offsetTop - y0 + pad) + "px";
    });
    W = x1 - x0 + 2 * pad; H = y1 - y0 + 2 * pad;
    monde.style.width = W + "px"; monde.style.height = H + "px";
    poserNotes();
    vueDEnsemble();
  }
  cam.x = vise.x; cam.y = vise.y; cam.s = vise.s;
}


/* ---------- 2. la caméra : position + zoom, qui rejoint doucement sa cible ---------- */

var cam = { x: 0, y: 0, s: 1 }, vise = { x: 0, y: 0, s: 1 };
var zMin = 0.1, zMax = 1.6;

function vueDEnsemble() {
  var s = Math.min((innerWidth - 40) / W, (innerHeight - 110) / H), mob = window.MOBILE();
  if (mob) s = Math.min((innerWidth - 24) / W * 2.3, (innerHeight - 130) / H);   // téléphone : plus proche ; on glisse pour voir le reste
  monde.style.setProperty("--note", ((mob ? 13 : 24) / s).toFixed(1) + "px");   // VERSION 7 : notes = même taille que « Plan rez-de-chaussée » (légendes des projets)
  poserNotes();
  zMin = s * 0.38;
  vise.s = s;          // VERSION 7 : les croquis remplissent mieux l'écran (plus grands, mieux répartis)
  vise.x = (innerWidth - W * vise.s) / 2;
  vise.y = (innerHeight - H * vise.s) / 2 + 22;     // un peu plus bas : rien ne touche le nom ni le menu
}
vueDEnsemble();
cam.x = vise.x; cam.y = vise.y; cam.s = vise.s;

function borner() {
  // VERSION 7 : la table paraît sans fin — on peut se promener bien au-delà des croquis, dans le vide, de tous les côtés
  var sw = W * vise.s, sh = H * vise.s, mx = innerWidth * 1.3, my = innerHeight * 1.3;
  vise.x = Math.max(innerWidth - sw - mx, Math.min(mx, vise.x));
  vise.y = Math.max(innerHeight - sh - my, Math.min(my, vise.y));
}

function zoomer(f, cx, cy) {
  var s = Math.max(zMin, Math.min(zMax, vise.s * f));
  f = s / vise.s;
  vise.x = cx - (cx - vise.x) * f;
  vise.y = cy - (cy - vise.y) * f;
  vise.s = s;
  borner();
}

(function boucle() {
  cam.x += (vise.x - cam.x) * 0.18;
  cam.y += (vise.y - cam.y) * 0.18;
  cam.s += (vise.s - cam.s) * 0.18;
  monde.style.transform = "translate(" + cam.x + "px," + cam.y + "px) scale(" + cam.s + ")";
  requestAnimationFrame(boucle);
})();

addEventListener("resize", vueDEnsemble);

// quand toutes les images sont chargées, on connaît la vraie taille du groupe : on le centre
(function () {
  var imgs = [].slice.call(monde.querySelectorAll(".calque > img:not(.scotch)")), n = imgs.length;
  function un() { if (--n <= 0) recentrer(); }
  imgs.forEach(function (im) { if (im.complete) un(); else { im.addEventListener("load", un); im.addEventListener("error", un); } });
})();

// molette = toujours zoom : vers le bas on s'éloigne (dézoom), vers le haut on s'approche
zone.addEventListener("wheel", function (e) {
  e.preventDefault();
  var d = e.deltaMode === 1 ? e.deltaY * 16 : e.deltaY;
  zoomer(Math.exp(-d * (e.ctrlKey ? 0.01 : 0.0035)), e.clientX, e.clientY);
}, { passive: false });

zone.addEventListener("dblclick", function (e) { zoomer(2, e.clientX, e.clientY); });
pincer(zone, function (f, cx, cy, dx, dy) {
  if (prise && prise.el) prise.el.classList.remove("tenu");
  prise = null;
  zoomer(f, cx, cy); vise.x += dx; vise.y += dy; borner();
});


/* ---------- 3. glisser : une feuille = on la déplace ; le fond = on se promène ---------- */

var prise = null;

zone.addEventListener("pointerdown", function (e) {
  var el = e.target.closest(".calque");
  prise = { el: el, x: e.clientX, y: e.clientY, l: el ? el.offsetLeft : 0, t: el ? el.offsetTop : 0 };
  if (el) { el.style.zIndex = ++z; el.classList.add("tenu"); }
  else zone.classList.add("tire");
  zone.setPointerCapture(e.pointerId);
});

zone.addEventListener("pointermove", function (e) {
  if (!prise || zone.dataset.pince) return;
  var dx = e.clientX - prise.x, dy = e.clientY - prise.y;
  if (prise.el) {
    prise.el.style.left = (prise.l + dx / cam.s) + "px";
    prise.el.style.top = (prise.t + dy / cam.s) + "px";
    poserNotes();
  } else {
    vise.x += e.clientX - (prise.px || prise.x); vise.y += e.clientY - (prise.py || prise.y);
    borner();
    cam.x = vise.x; cam.y = vise.y;
    prise.px = e.clientX; prise.py = e.clientY;
  }
});

// VERSION 7 : on passe la souris sur un croquis = il vient doucement au premier plan (sans cliquer)
zone.addEventListener("pointerover", function (e) {
  if (prise) return;
  var el = e.target.closest(".calque");
  if (!el || +el.style.zIndex === z) return;
  el.style.zIndex = ++z;
  el.classList.remove("devant"); void el.offsetWidth; el.classList.add("devant");
});

zone.addEventListener("pointerup", function () {
  if (prise && prise.el) prise.el.classList.remove("tenu");
  zone.classList.remove("tire");
  prise = null;
});
}


/* ============================================================
   LES PAGES : afficher la bonne page selon l’adresse (#/projets, #/inspire…)
   ============================================================ */
/* PAGES PROJET : un titre sur deux lignes précises — on réduit la taille juste assez pour que chaque ligne tienne */
function initTitres() {
  var t = document.querySelector(".projet-titre.deux-lignes");
  if (!t) return;
  function ajuster() {
    t.style.fontSize = "";
    var base = parseFloat(getComputedStyle(t).fontSize), largeur = t.clientWidth, max = 0;
    t.querySelectorAll(".ligne").forEach(function (l) {
      var r = document.createRange(); r.selectNodeContents(l);
      max = Math.max(max, r.getBoundingClientRect().right - t.getBoundingClientRect().left);
    });
    if (max > largeur) t.style.fontSize = Math.floor(base * largeur / max * 0.98) + "px";
  }
  ajuster();
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(ajuster);
  addEventListener("resize", ajuster);
}
var PAGES_INIT = [initCommun, initMenu, initProjets, initAccueil, initTitres];
(function () {
  // tout ce qu'une page installe (écouteurs, minuteries, animations) est arrêté quand on change de page
  var W = window, D = document;
  var addW = W.addEventListener.bind(W), addD = D.addEventListener.bind(D);
  var rawTimeout = W.setTimeout.bind(W), rawInterval = W.setInterval.bind(W), rawRAF = W.requestAnimationFrame.bind(W);
  var ctrl = new AbortController(), gen = 0;
  function avecSignal(add) {
    return function (type, fn, opt) {
      var o = (typeof opt === "object" && opt) ? Object.assign({}, opt) : { capture: !!opt };
      if (!o.signal) o.signal = ctrl.signal;
      return add(type, fn, o);
    };
  }
  W.addEventListener = avecSignal(addW);
  D.addEventListener = avecSignal(addD);
  W.setTimeout = function (fn, t) { var g = gen, a = [].slice.call(arguments, 2); return rawTimeout(function () { if (g === gen) fn.apply(null, a); }, t); };
  W.setInterval = function (fn, t) { var g = gen, id = rawInterval(function () { if (g === gen) fn(); else clearInterval(id); }, t); return id; };
  W.requestAnimationFrame = function (fn) { var g = gen; return rawRAF(function (ts) { if (g === gen) fn(ts); }); };

  var poses = [];
  function routeActuelle() {
    var h = location.hash;
    if (h.indexOf("#/") !== 0) return null;          // #ch-1, etc. : un simple lien dans la page
    return h.slice(2) || "accueil";
  }
  function afficher(route) {
    var choix = W.LANG === "en" ? '[data-lang="en"]' : ':not([data-lang])';
    var t = D.querySelector('template[data-page="' + route + '"]' + choix) || D.querySelector('template[data-page="accueil"]' + choix) || D.querySelector('template[data-page="accueil"]');
    ctrl.abort(); ctrl = new AbortController(); gen++;
    poses.forEach(function (n) { n.remove(); });
    var frag = t.content.cloneNode(true);
    poses = [].slice.call(frag.childNodes);
    D.body.className = t.dataset.classe;
    D.body.insertBefore(frag, D.body.firstChild);
    rawRAF(function () {});
    // la nouvelle page s'ouvre en haut, d'un coup et sans qu'on la voie défiler (avant : elle remontait du bas vers le haut)
    var html = D.documentElement;
    html.style.scrollBehavior = "auto";
    try { W.scrollTo({ top: 0, left: 0, behavior: "instant" }); } catch (err) { W.scrollTo(0, 0); }
    rawTimeout(function () { html.style.scrollBehavior = ""; }, 80);
    PAGES_INIT.forEach(function (init) { init(); });
    ajusterTitres();
  }
  // téléphone : un sous-titre trop long pour l'écran a le droit de passer à la ligne (les courts restent entiers)
  function ajusterTitres() {
    D.querySelectorAll(".projet-titre .nowrap").forEach(function (s) {
      s.classList.remove("coupe");
      var h = s.closest(".projet-titre");
      if (W.MOBILE() && s.getBoundingClientRect().right > h.getBoundingClientRect().right + 1) s.classList.add("coupe");
    });
  }
  W.addEventListener("resize", ajusterTitres);
  if (D.fonts && D.fonts.ready) D.fonts.ready.then(ajusterTitres);
  // un lien vers une autre page : petit fondu, puis on change de page
  addD("click", function (e) {
    var a = e.target.closest && e.target.closest('a[href^="#/"]');
    if (!a || e.metaKey || e.ctrlKey || e.shiftKey) return;
    e.preventDefault();
    var cible = a.getAttribute("href");
    if (cible === location.hash || (cible === "#/" && !routeActuelle())) { afficher(routeActuelle() || "accueil"); return; }
    D.body.classList.add("part");
    parClic = true;
    rawTimeout(function () { location.hash = cible; }, 480);
  });
  if ("scrollRestoration" in history) history.scrollRestoration = "manual";   // chaque page s'ouvre en haut
  // retour / avance du navigateur : le même fondu doux qu'avec un clic
  var parClic = false;
  addW("hashchange", function () {
    var r = routeActuelle(); if (!r) return;
    if (parClic) { parClic = false; afficher(r); return; }
    D.body.classList.add("part");
    rawTimeout(function () { afficher(r); }, 420);
  });
  // changer de langue : un fondu, puis la même page dans l'autre langue, à la même hauteur
  W.changerLangue = function () {
    W.LANG = W.LANG === "en" ? "fr" : "en";
    try { localStorage.setItem("rose-langue", W.LANG); } catch (e) {}
    D.documentElement.lang = W.LANG;
    var y = W.scrollY;
    D.body.classList.add("part");
    rawTimeout(function () {
      afficher(routeActuelle() || "accueil");
      if (y) { D.documentElement.style.scrollBehavior = "auto"; W.scrollTo(0, y); rawTimeout(function () { D.documentElement.style.scrollBehavior = ""; }, 80); }
    }, 420);
  };
  afficher(routeActuelle() || "accueil");
})();
