(function () {
  var form = document.getElementById("enquiry");
  if (!form) return;
  form.addEventListener("submit", function (e) {
    e.preventDefault();
    var v = function (id) { var el = document.getElementById(id); return el ? el.value.trim() : ""; };
    var lines = ["Namaste MD Industries, enquiry:"];
    if (v("name")) lines.push("Name: " + v("name"));
    lines.push("Work: " + v("service"));
    if (v("place")) lines.push("Site: " + v("place"));
    if (v("msg")) lines.push("Details: " + v("msg"));
    var url = "https://wa.me/919166782730?text=" + encodeURIComponent(lines.join("\n"));
    window.location.href = url;
  });
})();
