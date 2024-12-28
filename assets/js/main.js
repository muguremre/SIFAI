/*=============== SHOW MENU ===============*/
const navMenu = document.getElementById('nav-menu'),
  navToggle = document.getElementById('nav-toggle'),
  navClose = document.getElementById('nav-close');
/*=============== MENU SHOW ===============*/
/* Validate if constant exists */
if (navToggle) {
  navToggle.addEventListener('click', () => {
    navMenu.classList.add('show-menu');
  });
}
/*=============== MENU HIDDEN ===============*/
/* Validate if constant exists */
if (navClose) {
  navClose.addEventListener('click', () => {
    navMenu.classList.remove('show-menu');
  });
}
/*=============== REMOVE MENU MOBILE ===============*/
const navLink = document.querySelectorAll('.nav__link');

const linkAction = () => {
  const navMenu = document.getElementById('nav-menu');
  //	When we click on each nav__link, we remove the show-menu class
  navMenu.classList.remove('show-menu');
};
navLink.forEach((n) => n.addEventListener('click', linkAction));

/*=============== ADD BLUR TO HEADER ===============*/
const blurHeader = () => {
  const header = document.getElementById('header');
  //  When the scroll is greater than 50 viewport height, add the blur-header class to the header tag
  this.scrollY >= 50
    ? header.classList.add('blur-header')
    : header.classList.remove('blur-header');
};
window.addEventListener('scroll', blurHeader);

/*=============== EMAIL JS ===============*/
const contactForm = document.getElementById('contact-form');
contactMessage = document.getElementById('contact-message');
const sendEmail = (e) => {
  e.preventDefault();

  // serviceID -templateID - #form - publicKey
  emailjs
    .sendForm(
      'service_bwpabic',
      'template_3q8p7qq',
      '#contact-form',
      '9XBLKenfachnVQ9MC'
    )
    .then(
      () => {
        //Show sent message
        contactMessage.textContent = 'Message sent successfully ✅';
        //Remove message after 5 seconds
        setTimeout(() => {
          contactMessage.textContent = '';
        }, 5000);
        //Clear input fields
        contactForm.reset();
      },
      () => {
        //Show error message
        contactMessage.textContent = 'Message not sent (service error) ❌';
      }
    );
};
contactForm.addEventListener('submit', sendEmail);

/*=============== SHOW SCROLL UP ===============*/
const scrollUp = () => {
  const scrollUp = document.getElementById('scroll-up');
  // When the scroll is higher than 350 viewport height, add the show-scroll class to the a tag with the scrollup class
  this.scrollY >= 350
    ? scrollUp.classList.add('show-scroll')
    : scrollUp.classList.remove('show-scroll');
};
window.addEventListener('scroll', scrollUp);
/*=============== SCROLL SECTIONS ACTIVE LINK ===============*/
const sections = document.querySelectorAll('section[id]');

const scrollActive = () => {
  const scrollDown = window.scrollY;

  sections.forEach((current) => {
    const sectionHeight = current.offsetHeight,
      sectionTop = current.offsetTop - 58,
      sectionId = current.getAttribute('id'),
      sectionsClass = document.querySelector(
        '.nav__menu a[href*=' + sectionId + ']'
      );

    if (scrollDown > sectionTop && scrollDown <= sectionTop + sectionHeight) {
      sectionsClass.classList.add('active-link');
    } else {
      sectionsClass.classList.remove('active-link');
    }
  });
};
window.addEventListener('scroll', scrollActive);

/*=============== SCROLL REVEAL ANIMATION ===============*/
const sr = ScrollReveal({
  origin: 'top',
  distance: '60px',
  duration: 2500,
  delay: 400
  //reset: true // animations repeat
});

/*=============== UPLOAD EKRANI ===============*/
document
  .getElementById('imageUpload')
  .addEventListener('change', function (event) {
    const previewImage = document.getElementById('previewImage');
    const file = event.target.files[0];

    if (file) {
      const reader = new FileReader();

      reader.onload = function (e) {
        previewImage.src = e.target.result;
        previewImage.classList.remove('hidden'); // Fotoğrafı göster
      };

      reader.readAsDataURL(file);
    }
  });

/*=============== SCROLL HOME ===============*/
sr.reveal(
  '.home__data, .home__social, .contact__container, .footer__container'
);
sr.reveal('.home__image', { origin: 'bottom' });
sr.reveal('.about__data, .skills__data', { origin: 'left' });
sr.reveal('.about__image, .skills__content', { origin: 'right' });
sr.reveal('.services__card, .projects__card', { interval: 100 });
const uploadForm = document.getElementById('uploadForm');
const imageUpload = document.getElementById('imageUpload');
const previewImage = document.getElementById('previewImage');
const previewText = document.getElementById('previewText');
const responseMessage = document.getElementById('responseMessage');

// Görüntü Önizleme
imageUpload.addEventListener('change', () => {
  const file = imageUpload.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = (e) => {
      previewImage.src = e.target.result;
      previewImage.classList.remove('hidden');
      previewText.style.display = 'none';
    };
    reader.readAsDataURL(file);
  }
});

// Form Submit İşlemi
uploadForm.addEventListener('submit', async (e) => {
  e.preventDefault();

  const file = imageUpload.files[0];
  if (!file) {
    modalMessage.innerText = 'Please select an image file.';
    popupModal.classList.remove('hidden'); // Modalı göster
    return;
  }

  const formData = new FormData();
  formData.append('Image', file);

  try {
    const response = await fetch('https://localhost:7100/api/Tumor/detect', {
      method: 'POST',
      body: formData
    });

    if (response.ok) {
      const result = await response.json();
      modalMessage.innerText = `Tumor Type Detected: ${result.tumor_type}`;
      popupModal.classList.remove('hidden'); // Modalı göster
    } else {
      modalMessage.innerText = 'Error: Could not process the image.';
      popupModal.classList.remove('hidden'); // Modalı göster
    }
  } catch (error) {
    modalMessage.innerText = 'Network Error: Could not connect to the server.';
    popupModal.classList.remove('hidden'); // Modalı göster
  }
});

// Modal Elementleri
const popupModal = document.getElementById('popupModal');
const modalMessage = document.getElementById('modalMessage');
const closeModal = document.getElementById('closeModal');

// Modalı kapatma işlemi
closeModal.addEventListener('click', () => {
  popupModal.classList.add('hidden'); // Modalı gizle
});
