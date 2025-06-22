let selectedAnalysisType = null;

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

window.addEventListener('load', () => {
  document.querySelector('.hexagon').classList.add('active');
});

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
    const sectionHeight = current.offsetHeight;
    const sectionTop = current.offsetTop - 58;
    const sectionId = current.getAttribute('id');
    const sectionsClass = document.querySelector(
      '.nav__menu a[href*=' + sectionId + ']'
    );

    if (sectionsClass) {
      if (scrollDown > sectionTop && scrollDown <= sectionTop + sectionHeight) {
        sectionsClass.classList.add('active-link');
      } else {
        sectionsClass.classList.remove('active-link');
      }
    } else {
      console.warn(`Debug: No element found for sectionId: ${sectionId}`);
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
  const userId = localStorage.getItem('userId');

  if (!userId) {
    modalMessage.innerText = 'User is not logged in.';
    popupModal.classList.remove('hidden');
    return;
  }

  if (!file) {
    modalMessage.innerText = 'Please select an image file.';
    popupModal.classList.remove('hidden');
    return;
  }

  const formData = new FormData();
  formData.append('Image', file);
  formData.append('UserId', userId);

  // ✅ Anamnez verilerini formData’ya ekle
  anamnezSorular.forEach((soru) => {
    const el = document.getElementById(soru.key);
    if (!el) return;

    let val;
    if (el.type === 'checkbox') {
      val = el.checked;
    } else {
      val = el.value;
    }

    const keyPrefix = selectedAnalysisType === 'skin' ? 'Anamnez.' : '';
    formData.append(keyPrefix + soru.key, val);
  });

  try {
    let endpoint = '';

    if (selectedAnalysisType === 'skin') {
      endpoint = 'https://localhost:7100/api/SkinCancer/detect';
    } else {
      endpoint = 'https://localhost:7100/api/Tumor/detect';
    }

    const response = await fetch(endpoint, {
      method: 'POST',
      body: formData
    });

    if (response.ok) {
      const result = await response.json();

      if (selectedAnalysisType === 'skin') {
        modalMessage.innerHTML = `
    <strong>Predicted Type:</strong> ${result.tahmin || '-'}<br>
    <strong>Overall Confidence:</strong> ${result.ensemble_skor || '-'}<br>
    <strong>Image-Based Score:</strong> ${result.gorsel_skor || '-'}<br>
    <strong>Anamnesis-Based Score:</strong> ${result.anamnez_skor || '-'}<br>
    <strong>Comment:</strong><br><em>${result.yorum || '-'}</em>
  `;
      } else {
        modalMessage.innerHTML = `
    <strong>Tumor Type Detected:</strong> ${
      result.tumorType || result.tumor_type || '-'
    }<br>
    <strong>Overall Confidence:</strong> ${result.güven || '-'}<br>
    <strong>MR-Based Prediction:</strong> ${result.mr_tahmini || '-'} (${
          result.mr_güven || '-'
        })<br>
    <strong>Anamnesis-Based Prediction:</strong> ${
      result.anamnez_tahmini || '-'
    } (${result.anamnez_güven || '-'})<br>
    <strong>Comment:</strong><br><em>${result.yorum || '-'}</em>
  `;
      }

      const segmentationImage = document.getElementById('segmentationImage');

      if (result.segmentation_image_base64) {
        segmentationImage.src = `data:image/png;base64,${result.segmentation_image_base64}`;
        segmentationImage.classList.remove('hidden');
      } else {
        segmentationImage.classList.add('hidden');
      }

      popupModal.classList.remove('hidden');
      await refreshHistory();
    } else {
      const errorData = await response.json();
      modalMessage.innerText = `Error: ${
        errorData.message || 'Could not process the image.'
      }`;
      popupModal.classList.remove('hidden');
    }
  } catch (error) {
    modalMessage.innerText = 'Network Error: Could not connect to the server.';
    popupModal.classList.remove('hidden');
  }
});

async function refreshHistory() {
  const userId = localStorage.getItem('userId');
  const historyContainer = document.getElementById('history-container');

  if (!userId) {
    historyContainer.innerHTML = `<p>User is not logged in.</p>`;
    return;
  }

  historyContainer.innerHTML = `<p>Loading history...</p>`;

  try {
    const brainRes = await fetch(
      `https://localhost:7100/api/Tumor/history/${userId}`
    );
    const skinRes = await fetch(
      `https://localhost:7100/api/SkinCancer/history/${userId}`
    );

    const brainData = brainRes.ok ? await brainRes.json() : { $values: [] };
    const skinData = skinRes.ok ? await skinRes.json() : { $values: [] };

    let combinedHtml = '';

    combinedHtml += displayHistory(brainData.$values, 'brain');

    combinedHtml += displayHistory(skinData.$values, 'skin');

    historyContainer.innerHTML = combinedHtml;
  } catch (error) {
    console.error('History fetch error:', error);
    historyContainer.innerHTML = `<p>Network error. Please try again later.</p>`;
  }
}

function displayHistory(resultsArray, type) {
  if (!resultsArray || resultsArray.length === 0) return '';

  const titleLabel =
    type === 'skin' ? 'Skin Cancer History' : 'Brain Tumor History';

  const cardsHtml = resultsArray
    .map((result) => {
      const imageSrc = `https://localhost:7100/uploads/${result.imageUrl}`;
      const date = new Date(result.detectionDate).toLocaleDateString();

      const tumorLabel =
        type === 'skin'
          ? result.tahmin || result.prediction || '-'
          : result.tumorType || result.tumor_type || '-';

      const label = type === 'skin' ? 'Skin Type' : 'Tumor Type';

      return `
        <div class="history__card">
          <img class="history__image" src="${imageSrc}" alt="${tumorLabel}">
          <h3 class="history__title">${label}: ${tumorLabel}</h3>
          <p class="history__date">Detection Date: ${date}</p>
        </div>
      `;
    })
    .join('');

  return `
    <div class="history__section">
      <h3 class="history__subtitle">${titleLabel}</h3>
      <div class="history__cards-wrapper">
        ${cardsHtml}
      </div>
    </div>
  `;
}

const popupModal = document.getElementById('popupModal');
const modalMessage = document.getElementById('modalMessage');
const closeModal = document.getElementById('closeModal');

closeModal.addEventListener('click', () => {
  popupModal.classList.add('hidden');

  const segmentationImage = document.getElementById('segmentationImage');
  segmentationImage.src = '';
  segmentationImage.classList.add('hidden');

  modalMessage.innerHTML = '';
});

const logoutButton = document.getElementById('logoutButton');

logoutButton.addEventListener('click', () => {
  console.log('Debug: Logging out user...');
  localStorage.removeItem('userId');
  localStorage.removeItem('token');
  console.log('Debug: userId and token removed from localStorage.');
  window.location.href = 'login.html';
});
function selectAnalysisType(type) {
  selectedAnalysisType = type;
  currentAnamnezStep = 0;

  if (type === 'brain') {
    anamnezSorular = [...anamnezQuestionsBrain];
  } else if (type === 'skin') {
    anamnezSorular = [...anamnezQuestionsSkin];
  }

  askNextAnamnezQuestion();
}

document.addEventListener('DOMContentLoaded', async () => {
  const userId = localStorage.getItem('userId');
  console.log('Debug: Loaded userId:', userId);

  if (!userId) {
    console.error(
      'Debug: No userId found in localStorage. Redirecting to login.'
    );
    window.location.href = 'login.html';
  } else {
    console.log('Debug: Refreshing history on page load...');
    await refreshHistory();
  }
});

let currentAnamnezStep = 0;

document.getElementById('customChooseFile').addEventListener('click', () => {
  currentAnamnezStep = 0;
  askNextAnamnezQuestion();
});

function askNextAnamnezQuestion() {
  if (currentAnamnezStep >= anamnezSorular.length) {
    document.getElementById('imageUpload').disabled = false;
    document.getElementById('imageUpload').click();
    return;
  }

  const soru = anamnezSorular[currentAnamnezStep];
  let html = `<p class="modal-message">${soru.text}</p><div>`;

  if (soru.options && Array.isArray(soru.options)) {
    soru.options.forEach((optionText, index) => {
      html += `<button onclick="answerAnamnez(${index})">${optionText}</button>`;
    });
    html += '</div>';
  } else if (soru.key === 'gender') {
    html += `
      <select id="anamnezTemp" class="modal-select">
        <option value="male">Male</option>
        <option value="female">Female</option>
      </select>
      <br><button onclick="submitAnamnezValue()">Next</button>
    `;
  } else if (soru.key === 'age') {
    html += `
      <input type="number" id="anamnezTemp" min="1" max="120" />
      <br><button onclick="submitAnamnezValue()">Next</button>
    `;
  } else {
    html += `
      <button onclick="answerAnamnez(1)">Yes</button>
      <button onclick="answerAnamnez(0)">No</button>
    `;
  }

  modalMessage.innerHTML = html;
  popupModal.classList.remove('hidden');
}

function submitAnamnezValue() {
  const soru = anamnezSorular[currentAnamnezStep];
  const value = document.getElementById('anamnezTemp').value;

  if (!value) return;

  document.getElementById(soru.key).value = value;
  popupModal.classList.add('hidden');
  currentAnamnezStep++;
  setTimeout(() => askNextAnamnezQuestion(), 200);
}

function answerAnamnez(answer) {
  if (currentAnamnezStep >= anamnezSorular.length) {
    document.getElementById('imageUpload').disabled = false;
    document.getElementById('imageUpload').click();
    return;
  }

  const soru = anamnezSorular[currentAnamnezStep];
  const el = document.getElementById(soru.key);

  if (!el) {
    console.warn(`Element not found for ${soru.key}`);
    currentAnamnezStep++;
    askNextAnamnezQuestion();
    return;
  }

  el.value = answer;

  popupModal.classList.add('hidden');
  currentAnamnezStep++;
  setTimeout(() => askNextAnamnezQuestion(), 200);
}

let anamnezSorular = [];

const anamnezQuestionsBrain = [
  { key: 'gender', text: 'What is your gender?' },
  { key: 'age', text: 'What is your age?' },
  { key: 'epilepsy', text: 'Do you have epilepsy?' },
  { key: 'morningHeadache', text: 'Do you have morning headaches?' },
  { key: 'worseningHeadache', text: 'Do your headaches worsen over time?' },
  { key: 'visionLoss', text: 'Have you experienced vision loss?' },
  { key: 'hormonalIssues', text: 'Any hormonal problems?' },
  { key: 'familyHistory', text: 'Any family history of tumor?' }
];

const anamnezQuestionsSkin = [
  {
    key: 'fark_suresi',
    text: 'When did you first notice the lesion?',
    options: [
      'Less than 1 month',
      '1–6 months',
      '6–12 months',
      'More than 1 year'
    ]
  },
  {
    key: 'renk_degisti',
    text: 'Has the color of the lesion changed recently?',
    options: ['No', 'Yes']
  },
  {
    key: 'kenar_duzensiz',
    text: 'Are the borders of the lesion irregular?',
    options: ['Regular', 'Irregular']
  },
  {
    key: 'kasinti_kanama',
    text: 'Does it itch, hurt, or bleed?',
    options: ['No', 'Yes']
  },
  {
    key: 'ailede_kanser',
    text: 'Any family history of skin cancer?',
    options: ['No', 'Yes']
  },
  {
    key: 'gunes_maruz',
    text: 'How often are you exposed to the sun?',
    options: ['Rarely', 'Occasionally', 'Frequently']
  },
  {
    key: 'lezyon_kabuk',
    text: 'Is there crusting on the lesion?',
    options: ['No', 'Yes']
  },
  {
    key: 'travma_sonrasi',
    text: 'Did it appear after an injury/trauma?',
    options: ['No', 'Yes']
  },
  {
    key: 'ten_rengi',
    text: 'What is your skin tone?',
    options: ['Dark', 'Medium', 'Light']
  },
  {
    key: 'tedavi_alindi',
    text: 'Have you received treatment for this lesion?',
    options: ['No', 'Yes']
  },
  {
    key: 'bolge',
    text: 'Where is the lesion located?',
    options: ['Face', 'Arm', 'Leg', 'Torso', 'Hand/Foot']
  }
];

document.getElementById('emailInput').addEventListener('input', function () {
  const email = this.value.toLowerCase();
  const allowedDomains = [
    'gmail.com',
    'hotmail.com',
    'outlook.com',
    'icloud.com'
  ];
  const domain = email.split('@')[1];
  const errorSpan = document.getElementById('emailError');

  if (domain && !allowedDomains.includes(domain)) {
    errorSpan.style.display = 'block';
    this.setCustomValidity('Bu e-posta sağlayıcısı kabul edilmiyor.');
  } else {
    errorSpan.style.display = 'none';
    this.setCustomValidity('');
  }
});
document
  .getElementById('contact-form')
  .addEventListener('submit', function (e) {
    const email = document.getElementById('emailInput').value.toLowerCase();
    const domain = email.split('@')[1];
    const allowedDomains = [
      'gmail.com',
      'hotmail.com',
      'outlook.com',
      'icloud.com'
    ];

    if (!allowedDomains.includes(domain)) {
      e.preventDefault(); // gönderimi engelle
      alert('Sadece gmail, hotmail, outlook veya icloud adresi kabul edilir.');
    }
  });
