// общая инициализация, год в футере, бургер

function toggleTabs(btn){
  var t = document.getElementById('tabs');
  if (!t) return;
  var open = t.classList.toggle('open');
  btn.classList.toggle('active', open);
}

document.addEventListener('DOMContentLoaded', function(){
  var year = document.getElementById('year');
  if (year) year.textContent = new Date().getFullYear();

  // закрываем бургер при клике по ссылке
  document.querySelectorAll('#tabs a').forEach(function(a){
    a.addEventListener('click', function(){
      var t = document.getElementById('tabs');
      var burger = document.querySelector('.nav-toggle');
      if (t) t.classList.remove('open');
      if (burger) burger.classList.remove('active');
    });
  });
});