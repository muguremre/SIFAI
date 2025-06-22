const container = document.getElementById('container');
const registerBtn = document.getElementById('register');
const loginBtn = document.getElementById('login');

registerBtn.addEventListener('click', () => {
  container.classList.add('active');
});

loginBtn.addEventListener('click', () => {
  container.classList.remove('active');
});

document.addEventListener('DOMContentLoaded', () => {
  const registerForm = document.getElementById('registerForm');
  const loginForm = document.getElementById('loginForm');

  registerForm.addEventListener('submit', async (event) => {
    event.preventDefault();
    await registerUser();
  });

  loginForm.addEventListener('submit', async (event) => {
    event.preventDefault();
    await loginUser();
  });
});

// Levenshtein algoritması: iki metin arasındaki farkı hesaplar
function levenshteinDistance(a, b) {
  const dp = Array.from({ length: a.length + 1 }, () => Array(b.length + 1).fill(0));
  for (let i = 0; i <= a.length; i++) dp[i][0] = i;
  for (let j = 0; j <= b.length; j++) dp[0][j] = j;

  for (let i = 1; i <= a.length; i++) {
    for (let j = 1; j <= b.length; j++) {
      const cost = a[i - 1] === b[j - 1] ? 0 : 1;
      dp[i][j] = Math.min(
        dp[i - 1][j] + 1,
        dp[i][j - 1] + 1,
        dp[i - 1][j - 1] + cost
      );
    }
  }

  return dp[a.length][b.length];
}

// Bilinen domain'lerle karşılaştırır
function detectCommonEmailTypos(email) {
  const knownDomains = ['gmail.com', 'hotmail.com', 'outlook.com', 'yahoo.com', 'icloud.com'];
  
  const parts = email.split('@');
  if (parts.length !== 2) return null;

  const domain = parts[1].toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
  let suggestion = null;
  let minDistance = Infinity;

  for (const known of knownDomains) {
    const dist = levenshteinDistance(domain, known);
    if (dist < minDistance && dist <= 3) {
      suggestion = known;
      minDistance = dist;
    }
  }

  return suggestion !== domain ? suggestion : null;
}


async function registerUser() {
  const name = document.getElementById('registerName').value.trim();
  const email = document.getElementById('registerEmail').value.trim();
  const password = document.getElementById('registerPassword').value;
   const messageDiv = document.getElementById('message');

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    messageDiv.innerHTML = `<p class="error">Lütfen geçerli bir e-posta adresi giriniz.</p>`;
    return;
  }

    const typoSuggestion = detectCommonEmailTypos(email);
  if (typoSuggestion) {
    messageDiv.innerHTML = `<p class="error">Alan adı hatalı olabilir. "${typoSuggestion}" demek istediniz mi?</p>`;
    return;
  }


  const response = await fetch('https://localhost:7100/api/Register', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ name, email, password })
  });
 
  if (response.ok) {
    messageDiv.innerHTML = `<p class="success">Kayıt başarılı!</p>`;
    // Kayıt başarılı olduğunda giriş formuna geç

    container.classList.remove('active');
  } else {
    const errorData = await response.json();
    messageDiv.innerHTML = `<p class="error">Kayıt başarısız: ${errorData.message}</p>`;
  }
}


async function loginUser() {
  const email = document.getElementById('loginEmail').value.trim();
  const password = document.getElementById('loginPassword').value;
  const messageDiv = document.getElementById('message');
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
    messageDiv.innerHTML = `<p class="error">Lütfen geçerli bir e-posta adresi giriniz.</p>`;
    return;
  }

  const typoSuggestion = detectCommonEmailTypos(email);
  if (typoSuggestion) {
    messageDiv.innerHTML = `<p class="error">Alan adı hatalı olabilir. "${typoSuggestion}" demek istediniz mi?</p>`;
    return;
  }

  const response = await fetch('https://localhost:7100/api/auth/login', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ email, password })
  });

  
  if (response.ok) {
    const data = await response.json();

    // Kullanıcı bilgilerini localStorage'a kaydet
    localStorage.setItem('userId', data.userId); // API'den dönen `userId` değerini saklıyoruz
    localStorage.setItem('token', data.token); // Eğer token dönerse bunu da saklıyoruz
    localStorage.setItem('userName', data.name); // Kullanıcının ismini de saklayabilirsiniz

    // Bilgileri console.log ile kontrol et
    console.log(`User ID: ${data.userId}, User Name: ${data.name}`);

    messageDiv.innerHTML = `<p class="success">Giriş başarılı!</p>`;

    // Giriş başarılı olduğunda index.html sayfasına yönlendir
    setTimeout(() => {
      window.location.href = 'index.html';
    }, 2000); // 2 saniye sonra yönlendirme
  } 
  
  else {
    const errorData = await response.json();
    messageDiv.innerHTML = `<p class="error">Giriş başarısız: ${errorData.message}</p>`;
    // Giriş başarısız olduğunda kayıt formuna geç
    container.classList.add('active');
  }
}
