document.querySelectorAll("[data-wa]").forEach(function (el) {
  el.addEventListener("click", function (e) {
    var text = el.getAttribute("data-wa") || "Hello, I have an enquiry.";
    var phone = el.getAttribute("data-phone") || "919894496560";
    window.open("https://wa.me/" + phone + "?text=" + encodeURIComponent(text), "_blank");
  });
});
