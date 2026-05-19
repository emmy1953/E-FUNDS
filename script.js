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
  senderOptions: document.getElementById('senderOptions'),
  userDirectoryList: document.getElementById('userDirectoryList'),
  receiveForm: document.getElementById('receiveForm'),
  receiveSender: document.getElementById('receiveSender'),
  receiveAmount: document.getElementById('receiveAmount'),
  signOutButton: document.getElementById('signOutButton'),
  themeToggleButton: document.getElementById('themeToggleButton'),
  sendQuickButton: document.querySelector('.send-quick'),
  receiveQuickButton: document.querySelector('.receive-quick'),
  receiptPanel: document.getElementById('receiptPanel'),
  receiptTitle: document.getElementById('receiptTitle'),
  receiptContent: document.getElementById('receiptContent'),
  downloadReceiptButton: document.getElementById('downloadReceiptButton'),
  closeReceiptButton: document.getElementById('closeReceiptButton'),
};

let activeReceipt = null;

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

function createTransactionId() {
  return `EF-${Date.now()}-${Math.random().toString(36).slice(2, 7).toUpperCase()}`;
}

function formatReceiptDate(timestamp) {
  return timestamp || new Date().toLocaleString('en-US', {
    month: 'numeric',
    day: 'numeric',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

function buildReceiptText(receipt) {
  const directionLabel = receipt.type === 'debit' ? 'Funds sent' : 'Funds received';
  return [
    'E-FUNDS TRANSACTION RECEIPT',
    'Digital Banking & Payments',
    '',
    `Receipt ID: ${receipt.transactionId}`,
    `Status: Successful`,
    `Date: ${formatReceiptDate(receipt.timestamp)}`,
    `Type: ${directionLabel}`,
    `Amount: $${formatCurrency(receipt.amount)}`,
    '',
    `Sender: ${receipt.senderName} (@${receipt.senderUsername})`,
    `Recipient: ${receipt.recipientName} (@${receipt.recipientUsername})`,
    '',
    'This receipt was generated for a mock E-FUNDS demo transaction.',
  ].join('\n');
}

function receiptFilename(receipt) {
  const safeId = receipt.transactionId.replace(/[^a-z0-9-]/gi, '').toLowerCase();
  return `efunds-receipt-${safeId}.txt`;
}

function downloadReceipt(receipt) {
  const blob = new Blob([buildReceiptText(receipt)], { type: 'text/plain;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = receiptFilename(receipt);
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
}

function showReceipt(receipt) {
  activeReceipt = receipt;
  const directionLabel = receipt.type === 'debit' ? 'Funds sent' : 'Funds received';
  elements.receiptTitle.textContent = directionLabel;
  elements.receiptContent.innerHTML = '';

  const rows = [
    ['Receipt ID', receipt.transactionId],
    ['Status', 'Successful'],
    ['Date', formatReceiptDate(receipt.timestamp)],
    ['Amount', `$${formatCurrency(receipt.amount)}`],
    ['Sender', `${receipt.senderName} (@${receipt.senderUsername})`],
    ['Recipient', `${receipt.recipientName} (@${receipt.recipientUsername})`],
  ];

  rows.forEach(([label, value]) => {
    const row = document.createElement('div');
    row.className = 'receipt-row';

    const labelElement = document.createElement('span');
    labelElement.textContent = label;

    const valueElement = document.createElement('strong');
    valueElement.textContent = value;

    row.append(labelElement, valueElement);
    elements.receiptContent.appendChild(row);
  });

  elements.receiptPanel.classList.remove('hidden');
  elements.receiptPanel.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

function hideReceipt() {
  activeReceipt = null;
  elements.receiptPanel.classList.add('hidden');
}

function getReceiptFromActivityEntry(entry) {
  if (!entry.transactionId || !entry.senderUsername || !entry.recipientUsername) {
    return null;
  }

  return {
    transactionId: entry.transactionId,
    type: entry.type,
    amount: entry.amount,
    timestamp: entry.timestamp,
    senderName: entry.senderName,
    senderUsername: entry.senderUsername,
    recipientName: entry.recipientName,
    recipientUsername: entry.recipientUsername,
  };
}

function findReceiptById(transactionId) {
  const users = loadUsers();
  const currentUsername = getCurrentUserUsername();
  const currentUser = users[currentUsername];
  if (!currentUser) {
    return null;
  }

  const entry = currentUser.activity.find((item) => item.transactionId === transactionId);
  return entry ? getReceiptFromActivityEntry(entry) : null;
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
    const receiptButton = entry.transactionId
      ? `<button class="receipt-link" type="button" data-receipt-id="${entry.transactionId}">Generate receipt</button>`
      : '';

    item.innerHTML = `
      <div class="activity-icon ${iconClass}">${icon}</div>
      <div class="activity-details">
        <strong>${entry.label}</strong>
        <span>${entry.timestamp}</span>
        ${receiptButton}
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

/**
 * Render the available recipients list AND populate both the
 * send-recipient and receive-sender <datalist> elements so that
 * every newly-registered user is immediately visible everywhere.
 */
function renderRecipientDirectory(currentUsername) {
  const users = loadUsers();
  const sortedUsers = Object.values(users)
    .filter((user) => user.username !== currentUsername)
    .sort((a, b) => a.name.localeCompare(b.name));

  // 1) Clear & rebuild the recipient <datalist> (send form)
  elements.recipientOptions.innerHTML = '';
  // 2) Clear & rebuild the sender <datalist> (receive form)
  elements.senderOptions.innerHTML = '';
  // 3) Clear & rebuild the clickable user-directory list
  elements.userDirectoryList.innerHTML = '';

  sortedUsers.forEach((user) => {
    // --- datalist option for send form ---
    const sendOption = document.createElement('option');
    sendOption.value = user.username;
    elements.recipientOptions.appendChild(sendOption);

    // --- datalist option for receive form ---
    const recvOption = document.createElement('option');
    recvOption.value = user.username;
    elements.senderOptions.appendChild(recvOption);

    // --- clickable directory item ---
    const item = document.createElement('li');
    item.className = 'user-directory-item';
    item.setAttribute('data-username', user.username);
    item.setAttribute('title', `Send to ${user.username}`);
    item.innerHTML = `
      <div>
        <strong class="user-directory-name">${user.name}</strong>
        <div class="user-directory-username">@${user.username}</div>
      </div>
      <div class="user-directory-balance">$${formatCurrency(user.balance)}</div>
    `;

    // Clicking a directory entry auto-fills the send form and scrolls to it
    item.addEventListener('click', () => {
      elements.sendRecipient.value = user.username;
      elements.sendForm.scrollIntoView({ behavior: 'smooth', block: 'start' });
      elements.sendAmount.focus();
    });

    elements.userDirectoryList.appendChild(item);
  });
}

function renderDashboard(user) {
  elements.dashboardName.textContent = `${user.name}`;
  elements.balanceAmount.textContent = formatCurrency(user.balance);
  renderActivity(user.activity);
  renderRecipientDirectory(user.username);
  hideReceipt();
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
      {
        type: 'credit',
        label: 'Account opened',
        amount: 5800.0,
        timestamp: new Date().toLocaleString(),
      },
    ],
  };

  // Save new user to shared users object
  users[username] = newUser;
  saveUsers(users);

  // Set this tab's context to the new user and render dashboard
  setCurrentUserUsername(username);
  renderDashboard(newUser);
  showDashboard();
  elements.signupForm.reset();
  showNotification('Welcome to E-FUNDS. Your account is ready.');
}

function addActivity(user, entry) {
  const timestamp = new Date().toLocaleString('en-US', {
    month: 'numeric',
    day: 'numeric',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
  const activityEntry = {
    ...entry,
    timestamp,
  };
  user.activity.push(activityEntry);
  return activityEntry;
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

  // Debit sender, credit recipient
  const transactionId = createTransactionId();
  sender.balance -= amount;
  recipient.balance += amount;

  const senderReceipt = addActivity(sender, {
    type: 'debit',
    label: `Sent to ${recipient.name} (${recipient.username})`,
    amount,
    transactionId,
    senderName: sender.name,
    senderUsername: sender.username,
    recipientName: recipient.name,
    recipientUsername: recipient.username,
  });
  addActivity(recipient, {
    type: 'credit',
    label: `Received from ${sender.name} (${sender.username})`,
    amount,
    transactionId,
    senderName: sender.name,
    senderUsername: sender.username,
    recipientName: recipient.name,
    recipientUsername: recipient.username,
  });

  saveUsers(users);

  // Re-load fresh user data from localStorage and re-render
  const freshUsers = loadUsers();
  const freshSender = freshUsers[currentUsername];
  renderDashboard(freshSender);
  showReceipt(getReceiptFromActivityEntry(senderReceipt));
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

  // Debit sender, credit current user
  const transactionId = createTransactionId();
  sender.balance -= amount;
  currentUser.balance += amount;

  const currentUserReceipt = addActivity(currentUser, {
    type: 'credit',
    label: `Received from ${sender.name} (${sender.username})`,
    amount,
    transactionId,
    senderName: sender.name,
    senderUsername: sender.username,
    recipientName: currentUser.name,
    recipientUsername: currentUser.username,
  });
  addActivity(sender, {
    type: 'debit',
    label: `Sent to ${currentUser.name} (${currentUser.username})`,
    amount,
    transactionId,
    senderName: sender.name,
    senderUsername: sender.username,
    recipientName: currentUser.name,
    recipientUsername: currentUser.username,
  });

  saveUsers(users);

  // Re-load fresh user data from localStorage and re-render
  // This ensures the balance display, activity, AND recipient directory
  // (including any newly created accounts) are all up-to-date.
  const freshUsers = loadUsers();
  const freshCurrent = freshUsers[currentUsername];
  renderDashboard(freshCurrent);
  showReceipt(getReceiptFromActivityEntry(currentUserReceipt));
  elements.receiveForm.reset();
  showNotification(`Mock payment of $${formatCurrency(amount)} received from ${sender.username}.`);
}

function handleSignOut() {
  clearCurrentUser();
  hideReceipt();
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
  elements.activityList.addEventListener('click', (event) => {
    const receiptButton = event.target.closest('.receipt-link');
    if (!receiptButton) {
      return;
    }

    const receipt = findReceiptById(receiptButton.dataset.receiptId);
    if (receipt) {
      showReceipt(receipt);
    }
  });
  elements.downloadReceiptButton.addEventListener('click', () => {
    if (activeReceipt) {
      downloadReceipt(activeReceipt);
      showNotification('Receipt downloaded.');
    }
  });
  elements.closeReceiptButton.addEventListener('click', () => {
    hideReceipt();
  });
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
