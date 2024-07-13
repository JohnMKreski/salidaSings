var currentImg = 0;
var imgs;
var dots;
var interval = 3000;
var timer;


document.addEventListener('DOMContentLoaded', function () {
  imgs = document.querySelectorAll('.slider img');
  dots = document.querySelectorAll('.dot');
  timer = setInterval(changeSlide, interval);
  arrows = document.querySelectorAll('.arrow');

  // Add click event listeners to dots
  dots.forEach(function(dot, index) {
    dot.addEventListener('click', function() {
      changeSlide(index);
      
    });
  });   

  // Add click event listeners to arrows
  arrows.forEach(function(arrow, index) {
    arrow.addEventListener('click', function() {
      if (index === 0) {
        prevSlide();
      } else {
        nextSlide();
      }
    });
  });
});



function changeSlide(n) {
  for (var i = 0; i < imgs.length; i++) {
    imgs[i].style.opacity = 0;
    dots[i].classList.remove('active');
  }

  currentImg = (currentImg + 1) % imgs.length;

  if (n !== undefined) {
    clearInterval(timer);
    timer = setInterval(changeSlide, interval);
    currentImg = n;
  }

  imgs[currentImg].style.opacity = 1;
  dots[currentImg].classList.add('active');
  console.log(currentImg);
}

function prevSlide() {
  var newIndex = (currentImg - 1 + imgs.length) % imgs.length;
  changeSlide(newIndex);
}

function nextSlide() {
  var newIndex = (currentImg + 1) % imgs.length;
  changeSlide(newIndex);
}