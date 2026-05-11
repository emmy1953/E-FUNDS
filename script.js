const APP_KEY = 'efunds-demo-users';
const CURRENT_USER_KEY = 'efunds-demo-current';
const THEME_KEY = 'efunds-demo-theme';

const elements = {
  welcomePanel: document.getElementById('welcomePanel'),
  authPanel: document.getElementById('authPanel'),
  dashboardPanel: document.getElementById('dashboardPanel'),
  getStartedButton: document.getElementById('getStartedButton'),
  backToWelcomeButton: document.getElementById('backToWelcomeButton'),
  loginForm: document.getElementById('loginForm'),
  signupForm: document.getElementById('signupForm'),
  loginUsername: document.getElementById('loginUsername'),
  loginPassword: document.getElementById('loginPassword'),
  signupName: document.getElementById('signupName'),
  signupUsername: document.getElementById('signupUsername'),
  signupPassword: document.getElementById('signupPassword'),
  dashboardName: document.getElementById('dashboardName'),
  balanceAmount: document.getElementById('balanceAmount'),
  activityList: document.getElementById('activityList'),
  sendForm: document.getElementById('sendForm'),
  sendRecipient: document.getElementById('sendRecipient'),
  sendAmount: document.getElementById('sendAmount'),
  recipientOptions: document.getElementById('recipientOptions'),
  userDirectoryList: document.getElementById('userDirectoryList'),
  receiveForm: document.getElementById('receiveForm'),
  receiveSender: document.getElementById('receiveSender'),
  receiveAmount: document.getElementById('receiveAmount'),
  signOutButton: document.getElementById('signOutButton'),
  themeToggleButton: document.getElementById('themeToggleButton'),
  sendQuickButton: document.querySelector('.send-quick'),
  receiveQuickButton: document.querySelector('.receive-quick'),
};

const initialUsers = {
  david: {
    name: 'David Chan',
    username: 'david',
    password: 'demo1234',
    balance: 12540.0,
    activity: [
      { type: 'credit', label: 'Account opened', amount: 12540.0, timestamp: '5/7/2026, 9:00 AM' },
    ],
  },
  nora: {
    name: 'Nora Patel',
    username: 'nora',
    password: 'demo1234',
    balance: 8760.25,
    activity: [
      { type: 'credit', label: 'Account opened', amount: 8760.25, timestamp: '5/7/2026, 9:00 AM' },
    ],
  },
  monroe: {
    name: 'Monroe Lee',
    username: 'monroe',
    password: 'demo1234',
    balance: 15230.5,
    activity: [
      { type: 'credit', label: 'Account opened', amount: 15230.5, timestamp: '5/7/2026, 9:00 AM' },
    ],
  },
};

function loadUsers() {
  const stored = localStorage.getItem(APP_KEY);
  if (!stored) {
    localStorage.setItem(APP_KEY, JSON.stringify(initialUsers));
    return { ...initialUsers };
  }
  try {
    return JSON.parse(stored);
  } catch (error) {
    localStorage.setItem(APP_KEY, JSON.stringify(initialUsers));
    return { ...initialUsers };
  }
}

function saveUsers(users) {
  localStorage.setItem(APP_KEY, JSON.stringify(users));
}

function getCurrentUserUsername() {
  return localStorage.getItem(CURRENT_USER_KEY);
}

function setCurrentUserUsername(username) {
  localStorage.setItem(CURRENT_USER_KEY, username);
}

function clearCurrentUser() {
  localStorage.removeItem(CURRENT_USER_KEY);
}

function getTheme() {
  return localStorage.getItem(THEME_KEY) || 'light';
}

function setTheme(theme) {
  localStorage.setItem(THEME_KEY, theme);
  document.documentElement.setAttribute('data-theme', theme);
}

function toggleTheme() {
  const current = getTheme();
  const newTheme = current === 'light' ? 'dark' : 'light';
  setTheme(newTheme);
}

function formatCurrency(value) {
  return value.toLocaleString('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

function renderActivity(activity) {
  const fragment = document.createDocumentFragment();
  const latest = [...activity].reverse().slice(0, 6);
  latest.forEach((entry) => {
    const item = document.createElement('li');
    item.className = 'activity-item';
    
    const iconClass = entry.type === 'debit' ? 'debit' : 'credit';
    const icon = entry.type === 'debit' ? '⬆️' : '⬇️';
    const amountClass = entry.type === 'debit' ? 'debit' : 'credit';
    const amountPrefix = entry.type === 'debit' ? '-' : '+';
    
    item.innerHTML = `
      <div class="activity-icon ${iconClass}">${icon}</div>
      <div class="activity-details">
        <strong>${entry.label}</strong>
        <span>${entry.timestamp}</span>
      </div>
      <div class="activity-amount ${amountClass}">${amountPrefix}$${formatCurrency(entry.amount)}</div>
    `;
    fragment.appendChild(item);
  });
  elements.activityList.innerHTML = '';
  elements.activityList.appendChild(fragment);
}

function showNotification(message) {
  const toast = document.createElement('div');
  toast.className = 'toast-message';
  toast.textContent = message;
  document.body.appendChild(toast);
  setTimeout(() => toast.classList.add('visible'), 10);
  setTimeout(() => toast.remove(), 3600);
}

function renderRecipientDirectory(currentUsername) {
  const users = loadUsers();
  const sortedUsers = Object.values(users).filter((user) => user.username !== currentUsername)
    .sort((a, b) => a.name.localeCompare(b.name));

  elements.recipientOptions.innerHTML = '';
  elements.userDirectoryList.innerHTML = '';

  sortedUsers.forEach((user) => {
    const option = document.createElement('option');
    option.value = user.username;
    elements.recipientOptions.appendChild(option);

    const item = document.createElement('li');
    item.className = 'user-directory-item';
    item.innerHTML = `
      <div>
        <strong class="user-directory-name">${user.name}</strong>
        <div class="user-directory-username">@${user.username}</div>
      </div>
      <div class="user-directory-balance">$${formatCurrency(user.balance)}</div>
    `;
    elements.userDirectoryList.appendChild(item);
  });
}

function renderDashboard(user) {
  elements.dashboardName.textContent = `${user.name}`;
  elements.balanceAmount.textContent = formatCurrency(user.balance);
  renderActivity(user.activity);
  renderRecipientDirectory(user.username);
}

function showDashboard() {
  elements.authPanel.classList.add('hidden');
  elements.welcomePanel.classList.add('hidden');
  elements.dashboardPanel.classList.remove('hidden');
}

function showAuth() {
  elements.welcomePanel.classList.add('hidden');
  elements.dashboardPanel.classList.add('hidden');
  elements.authPanel.classList.remove('hidden');
}

function showWelcome() {
  elements.dashboardPanel.classList.add('hidden');
  elements.authPanel.classList.add('hidden');
  elements.welcomePanel.classList.remove('hidden');
}

function switchForm(target) {
  document.querySelectorAll('.toggle-button').forEach((button) => {
    button.classList.toggle('active', button.dataset.target === target);
  });
  elements.loginForm.classList.toggle('hidden', target !== 'loginForm');
  elements.signupForm.classList.toggle('hidden', target !== 'signupForm');
}

function handleLogin(event) {
  event.preventDefault();
  const username = elements.loginUsername.value.trim().toLowerCase();
  const password = elements.loginPassword.value;
  const users = loadUsers();

  if (!username || !password) {
    showNotification('Enter both username and password.');
    return;
  }

  const user = users[username];
  if (!user || user.password !== password) {
    showNotification('Username or password is incorrect.');
    return;
  }

  setCurrentUserUsername(username);
  renderDashboard(user);
  showDashboard();
  elements.loginForm.reset();
}

function handleSignup(event) {
  event.preventDefault();
  const name = elements.signupName.value.trim();
  const username = elements.signupUsername.value.trim().toLowerCase();
  const password = elements.signupPassword.value;
  const users = loadUsers();

  if (!name || !username || !password) {
    showNotification('Complete all fields to create your account.');
    return;
  }

  if (username.length < 4) {
    showNotification('Choose a username with at least 4 characters.');
    return;
  }

  if (users[username]) {
    showNotification('That username is already in use.');
    return;
  }

  const newUser = {
    name,
    username,
    password,
    balance: 5800.0,
    activity: [
      { type: 'credit', label: 'Account opened', amount: 5800.0, timestamp: new Date().toLocaleString() },
    ],
  };

  users[username] = newUser;
  saveUsers(users);
  setCurrentUserUsername(username);
  renderDashboard(newUser);
  showDashboard();
  elements.signupForm.reset();
  showNotification('Welcome to E-FUNDS. Your account is ready.');
}

function addActivity(user, entry) {
  user.activity.push({ 
    ...entry, 
    timestamp: new Date().toLocaleString('en-US', { 
      month: 'numeric', 
      day: 'numeric', 
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  });
}

function handleSend(event) {
  event.preventDefault();
  const recipientKey = elements.sendRecipient.value.trim().toLowerCase();
  const amount = parseFloat(elements.sendAmount.value);
  const currentUsername = getCurrentUserUsername();
  const users = loadUsers();
  const sender = users[currentUsername];
  const recipient = users[recipientKey];

  if (!recipientKey || Number.isNaN(amount) || amount <= 0) {
    showNotification('Enter a recipient and valid amount.');
    return;
  }
  if (!recipient) {
    showNotification('Recipient not found.');
    return;
  }
  if (recipientKey === currentUsername) {
    showNotification('Use the receive form to record incoming payments.');
    return;
  }
  if (sender.balance < amount) {
    showNotification('Insufficient funds for this transaction.');
    return;
  }

  sender.balance -= amount;
  recipient.balance += amount;

  addActivity(sender, {
    type: 'debit',
    label: `Sent to ${recipient.name} (${recipient.username})`,
    amount,
  });
  addActivity(recipient, {
    type: 'credit',
    label: `Received from ${sender.name} (${sender.username})`,
    amount,
  });

  saveUsers(users);
  renderDashboard(sender);
  elements.sendForm.reset();
  showNotification(`Mock payment of $${formatCurrency(amount)} sent to ${recipient.username}.`);
}

function handleReceive(event) {
  event.preventDefault();
  const senderKey = elements.receiveSender.value.trim().toLowerCase();
  const amount = parseFloat(elements.receiveAmount.value);
  const currentUsername = getCurrentUserUsername();
  const users = loadUsers();
  const currentUser = users[currentUsername];
  const sender = users[senderKey];

  if (!senderKey || Number.isNaN(amount) || amount <= 0) {
    showNotification('Enter a sender and valid amount.');
    return;
  }
  if (!sender) {
    showNotification('Sender account not found.');
    return;
  }
  if (senderKey === currentUsername) {
    showNotification('You cannot receive from your own account.');
    return;
  }
  if (sender.balance < amount) {
    showNotification('Sender does not have enough mock funds.');
    return;
  }

  sender.balance -= amount;
  currentUser.balance += amount;

  addActivity(currentUser, {
    type: 'credit',
    label: `Received from ${sender.name} (${sender.username})`,
    amount,
  });
  addActivity(sender, {
    type: 'debit',
    label: `Sent to ${currentUser.name} (${currentUser.username})`,
    amount,
  });

  saveUsers(users);
  renderDashboard(currentUser);
  elements.receiveForm.reset();
  showNotification(`Mock payment of $${formatCurrency(amount)} received from ${sender.username}.`);
}

function handleSignOut() {
  clearCurrentUser();
  showAuth();
}

function initEventListeners() {
  document.querySelectorAll('.toggle-button').forEach((button) => {
    button.addEventListener('click', () => switchForm(button.dataset.target));
  });
  elements.loginForm.addEventListener('submit', handleLogin);
  elements.signupForm.addEventListener('submit', handleSignup);
  elements.sendForm.addEventListener('submit', handleSend);
  elements.receiveForm.addEventListener('submit', handleReceive);
  elements.signOutButton.addEventListener('click', handleSignOut);
  elements.themeToggleButton.addEventListener('click', toggleTheme);
  elements.getStartedButton.addEventListener('click', showAuth);
  elements.backToWelcomeButton.addEventListener('click', showWelcome);
  elements.sendQuickButton.addEventListener('click', () => {
    elements.sendRecipient.focus();
  });
  elements.receiveQuickButton.addEventListener('click', () => {
    elements.receiveSender.focus();
  });
}

function initializeApp() {
  loadUsers();
  setTheme(getTheme());
  initEventListeners();

  const currentUser = getCurrentUserUsername();
  if (currentUser) {
    const users = loadUsers();
    const user = users[currentUser];
    if (user) {
      renderDashboard(user);
      showDashboard();
      return;
    }
    clearCurrentUser();
  }
  showWelcome();
}

initializeApp();