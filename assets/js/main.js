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
  formData.append('Gender', document.getElementById('gender').value);
  formData.append('Age', document.getElementById('age').value);
  formData.append('Epilepsy', document.getElementById('epilepsy').checked);
  formData.append(
    'MorningHeadache',
    document.getElementById('morningHeadache').checked
  );
  formData.append(
    'WorseningHeadache',
    document.getElementById('worseningHeadache').checked
  );
  formData.append('VisionLoss', document.getElementById('visionLoss').checked);
  formData.append(
    'HormonalIssues',
    document.getElementById('hormonalIssues').checked
  );
  formData.append(
    'FamilyHistory',
    document.getElementById('familyHistory').checked
  );

  try {
    const response = await fetch('https://localhost:7100/api/Tumor/detect', {
      method: 'POST',
      body: formData
    });

    if (response.ok) {
      const result = await response.json();

      const tumorType = result.tumorType || result.tumor_type || '-';
      const confidence = result.güven || '-';
      const mrTahmini = result.mr_tahmini || '-';
      const mrGuven = result.mr_güven || '-';
      const anamnezTahmini = result.anamnez_tahmini || '-';
      const anamnezGuven = result.anamnez_güven || '-';
      const yorum = result.yorum || '-';

      modalMessage.innerHTML = `
    <strong>Tumor Type Detected:</strong> ${tumorType}<br>
    <strong>Overall Confidence:</strong> ${confidence}<br>
    <strong>MR-Based Prediction:</strong> ${mrTahmini} (${mrGuven})<br>
    <strong>Anamnesis-Based Prediction:</strong> ${anamnezTahmini} (${anamnezGuven})<br>
    <strong>Comment:</strong><br><em>${yorum}</em>
  `;

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

// Kullanıcının geçmiş sonuçlarını yenilemek için fonksiyon
async function refreshHistory() {
  const userId = localStorage.getItem('userId'); // Kullanıcının ID'sini kontrol et
  console.log('Debug: Refresh history for userId:', userId);

  const historyContainer = document.getElementById('history-container');
  if (!userId) {
    console.error('Debug: No userId found. Cannot refresh history.');
    historyContainer.innerHTML = `<p>User is not logged in. Please log in to view history.</p>`;
    return;
  }

  try {
    const response = await fetch(
      `https://localhost:7100/api/Tumor/history/${userId}`
    );
    console.log('Debug: History API Response Status:', response.status);

    if (response.ok) {
      const results = await response.json();
      console.log('Debug: History Results:', results);
      displayHistory(results, historyContainer);
    } else {
      console.error('Debug: Error fetching history. Status:', response.status);
      historyContainer.innerHTML = `<p>Error fetching history. Please try again later.</p>`;
    }
  } catch (error) {
    console.error('Debug: Network error while fetching history:', error);
    historyContainer.innerHTML = `<p>Network error. Please try again later.</p>`;
  }
}

// Gelen sonuçları göster
function displayHistory(results, container) {
  if (!results.$values || results.$values.length === 0) {
    container.innerHTML = `<p>No results found.</p>`;
    return;
  }

  const historyHtml = results.$values
    .map(
      (result) => `
    <div class="history__card">
      <img class="history__image" src="https://localhost:7100/uploads/${
        result.imageUrl
      }" alt="${result.tumorType}">
      <h3 class="history__title">Tumor Type: ${result.tumorType}</h3>
      <p class="history__date">Detection Date: ${new Date(
        result.detectionDate
      ).toLocaleDateString()}</p>
    </div>
  `
    )
    .join('');

  container.innerHTML = historyHtml;
}

// Modal Elementleri
const popupModal = document.getElementById('popupModal');
const modalMessage = document.getElementById('modalMessage');
const closeModal = document.getElementById('closeModal');

// Modalı kapatma işlemi
closeModal.addEventListener('click', () => {
  popupModal.classList.add('hidden'); // Modalı gizle
});
// Çıkış Yapma İşlevi
const logoutButton = document.getElementById('logoutButton');

logoutButton.addEventListener('click', () => {
  console.log('Debug: Logging out user...');
  localStorage.removeItem('userId');
  localStorage.removeItem('token');
  console.log('Debug: userId and token removed from localStorage.');
  window.location.href = 'login.html';
});

document.addEventListener('DOMContentLoaded', async () => {
  const userId = localStorage.getItem('userId'); // Kullanıcı kimliği
  console.log('Debug: Loaded userId:', userId);

  if (!userId) {
    console.error(
      'Debug: No userId found in localStorage. Redirecting to login.'
    );
    window.location.href = 'login.html';
  } else {
    // Eğer kullanıcı giriş yapmışsa geçmiş sorguları yükle
    console.log('Debug: Refreshing history on page load...');
    await refreshHistory();
  }
});
const anamnezSorular = [
  { key: 'gender', text: 'What is your gender?' },
  { key: 'age', text: 'What is your age?' },
  { key: 'epilepsy', text: 'Do you have epilepsy?' },
  { key: 'morningHeadache', text: 'Do you have morning headaches?' },
  { key: 'worseningHeadache', text: 'Do your headaches worsen over time?' },
  { key: 'visionLoss', text: 'Have you experienced vision loss?' },
  { key: 'hormonalIssues', text: 'Any hormonal problems?' },
  { key: 'familyHistory', text: 'Any family history of tumor?' }
];

let currentAnamnezStep = 0;

document.getElementById('customChooseFile').addEventListener('click', () => {
  currentAnamnezStep = 0;
  askNextAnamnezQuestion();
});

function askNextAnamnezQuestion() {
  if (currentAnamnezStep >= anamnezSorular.length) {
    document.getElementById('imageUpload').disabled = false;
    document.getElementById('imageUpload').click(); // Dosya seçimi aç
    return;
  }

  const soru = anamnezSorular[currentAnamnezStep];
  let html = `<p class="modal-message">${soru.text}</p>`;

  // 🎯 Sorunun tipine göre input oluştur
  if (soru.key === 'gender') {
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
      <button onclick="answerAnamnez(true)">Yes</button>
      <button onclick="answerAnamnez(false)">No</button>
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
    document.getElementById('anamnezForm').classList.remove('hidden');
    document.getElementById('imageUpload').disabled = false;
    document.getElementById('imageUpload').click();
    return;
  }

  const soru = anamnezSorular[currentAnamnezStep];

  if (soru.key === 'gender') {
    document.getElementById(soru.key).value = answer ? 'male' : 'female';
  } else if (soru.key === 'age') {
    document.getElementById(soru.key).value = answer ? 35 : 20;
  } else {
    document.getElementById(soru.key).checked = answer;
  }

  popupModal.classList.add('hidden');
  currentAnamnezStep++;
  setTimeout(() => askNextAnamnezQuestion(), 200);
}
