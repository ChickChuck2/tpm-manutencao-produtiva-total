/* =================================================================
   MPT PRESENTATION - Navigation Engine
================================================================= */
(function () {
  "use strict";

  var slides = Array.from(document.querySelectorAll(".slide"));
  var total  = slides.length;
  var cur    = 0;
  var busy   = false;
  var nc     = document.getElementById("nc");
  var nd     = document.getElementById("nd");

  /* Build dots */
  if (nd) {
    slides.forEach(function (_, i) {
      var d = document.createElement("button");
      d.className = "ndot" + (i === 0 ? " active" : "");
      d.setAttribute("aria-label", "Slide " + (i + 1));
      d.addEventListener("click", function () { go(i); });
      nd.appendChild(d);
    });
  }

  function updateDots() {
    if (!nd) return;
    nd.querySelectorAll(".ndot").forEach(function (d, i) {
      d.classList.toggle("active", i === cur);
    });
  }

  function go(idx) {
    if (busy || idx === cur || idx < 0 || idx >= total) return;
    busy = true;
    slides[cur].classList.add("exit");
    slides[cur].classList.remove("active");
    var prev = cur;
    cur = idx;
    slides[cur].classList.add("active");
    if (nc) nc.textContent = (cur + 1) + " / " + total;
    var hdrNum = slides[cur].querySelector(".hdr-num");
    if (hdrNum) {
      var padCur = (cur + 1) < 10 ? "0" + (cur + 1) : (cur + 1);
      var padTot = total < 10 ? "0" + total : total;
      hdrNum.textContent = padCur + " / " + padTot;
    }
    updateDots();
    setTimeout(function () {
      slides[prev].classList.remove("exit");
      busy = false;
    }, 460);
  }

  /* Buttons */
  var bp = document.getElementById("bp");
  var bn = document.getElementById("bn");
  if (bp) bp.addEventListener("click", function () { go(cur - 1); });
  if (bn) bn.addEventListener("click", function () { go(cur + 1); });

  /* Keyboard */
  document.addEventListener("keydown", function (e) {
    if (e.key === "ArrowRight" || e.key === "ArrowDown" || e.key === " ") {
      e.preventDefault(); go(cur + 1);
    } else if (e.key === "ArrowLeft" || e.key === "ArrowUp") {
      e.preventDefault(); go(cur - 1);
    }
  });

  /* Touch swipe com deteccao direcional (scroll vertical livre no mobile) */
  var tx = 0, ty = 0;
  document.addEventListener("touchstart", function (e) {
    tx = e.touches[0].clientX;
    ty = e.touches[0].clientY;
  }, { passive: true });
  document.addEventListener("touchend", function (e) {
    var dx = e.changedTouches[0].clientX - tx;
    var dy = e.changedTouches[0].clientY - ty;
    // So troca se o movimento horizontal for nitido e maior que a rolagem vertical
    if (Math.abs(dx) > 45 && Math.abs(dx) > Math.abs(dy) * 1.4) {
      dx < 0 ? go(cur + 1) : go(cur - 1);
    }
  }, { passive: true });

  /* Mouse wheel */
  var wc = false;
  document.addEventListener("wheel", function (e) {
    if (wc) return;
    wc = true;
    e.deltaY > 0 ? go(cur + 1) : go(cur - 1);
    setTimeout(function () { wc = false; }, 700);
  }, { passive: true });

})();
