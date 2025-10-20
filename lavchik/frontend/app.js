// =====================
// 🌟 НАВИГАЦИЯ
// =====================
function showScreen(name) {
  document.querySelectorAll('.screen').forEach(screen => {
    screen.classList.remove('active');
  });

  const screen = document.getElementById(`screen-${name}`);
  if (screen) screen.classList.add('active');
}

document.addEventListener('DOMContentLoaded', () => {
  // Навигация через JS
  const navButtons = document.querySelectorAll('.nav button');
  navButtons.forEach(button => {
    button.addEventListener('click', () => {
      const target = button.dataset.target;
      showScreen(target);

      // Подсветка активной кнопки
      navButtons.forEach(b => b.classList.remove('active'));
      button.classList.add('active');
    });
  });

  // Показ первого экрана по умолчанию
  showScreen('character');
  if (navButtons[0]) navButtons[0].classList.add('active');

  // Инициализация
  loadCharacter();
  updateLavki();
  initializeTasks();
  renderTasks();
  loadCharacterName();
});

// =====================
// 💎 ЛАВКИ
// =====================
let lavki = parseInt(localStorage.getItem('lavki')) || 0;

function updateLavki() {
  const lavkiAmount = document.getElementById('lavki-amount');
  if (lavkiAmount) {
    lavkiAmount.textContent = lavki;
  }
  localStorage.setItem('lavki', lavki);
}

// =====================
// 🛍️ МАГАЗИН
// =====================
function buyItem(item, cost) {
  if (lavki >= cost) {
    lavki -= cost;
    updateLavki();
    alert(`Вы купили ${item} за ${cost} лавок!`);
  } else {
    alert('Недостаточно лавок 💎');
  }
}

// =====================
// ⚙️ СИСТЕМА НАСТРОЕК
// =====================

function saveSettings() {
  const nameInput = document.getElementById('char-name');
  const name = nameInput ? nameInput.value.trim() : '';
  
  if (!name) {
    alert('⚠️ Пожалуйста, введите имя персонажа');
    nameInput.focus();
    return;
  }
  
  if (name.length < 2) {
    alert('⚠️ Имя должно содержать хотя бы 2 символа');
    return;
  }
  
  localStorage.setItem('charName', name);
  updateCharacterDisplay();
  showSuccessMessage('Имя персонажа сохранено! 🎉');
}

function updateCharacterDisplay() {
  const name = localStorage.getItem('charName') || 'Лавчик';
  const nameDisplay = document.getElementById('character-name-display');
  const statusDisplay = document.getElementById('character-status');
  
  if (nameDisplay) {
    nameDisplay.textContent = name;
  }
  
  if (statusDisplay) {
    // Меняем статус в зависимости от имени
    const statuses = [
      'Счастлив и готов к приключениям! 😄',
      'Рад видеть вас! ✨',
      'Готов к новым заданиям! 🚀',
      'Настроен позитивно! 🌟'
    ];
    const randomStatus = statuses[Math.floor(Math.random() * statuses.length)];
    statusDisplay.textContent = randomStatus;
  }
}

function loadCharacterName() {
  const savedName = localStorage.getItem('charName');
  const nameInput = document.getElementById('char-name');
  
  if (savedName && nameInput) {
    nameInput.value = savedName;
  }
  updateCharacterDisplay();
}

function initializeCharacterSelector() {
  const selector = document.getElementById('character-selector');
  const currentCharacter = localStorage.getItem('characterImg') || 'images/1.jfif';
  
  if (selector) {
    // Вешаем обработчики на выбор персонажа
    const options = selector.querySelectorAll('.character-option');
    options.forEach(option => {
      const imgPath = option.getAttribute('data-img');
      option.addEventListener('click', () => changeCharacter(imgPath));
      
      // Отмечаем текущего выбранного персонажа
      if (imgPath === currentCharacter) {
        option.classList.add('selected');
      }
    });
  }
}

function changeCharacter(imgPath) {
  const img = document.getElementById('character-img');
  if (img) {
    img.src = imgPath;
    localStorage.setItem('characterImg', imgPath);
    
    // Обновляем выделение в селекторе
    const options = document.querySelectorAll('.character-option');
    options.forEach(option => {
      option.classList.remove('selected');
      if (option.getAttribute('data-img') === imgPath) {
        option.classList.add('selected');
      }
    });
    
    showSuccessMessage('Внешность персонажа изменена! 👗');
  }
}

function loadCharacter() {
  const savedImg = localStorage.getItem('characterImg');
  const characterImg = document.getElementById('character-img');
  if (savedImg && characterImg) {
    characterImg.src = savedImg;
  }
}

function updateStats() {
  const totalLavki = document.getElementById('total-lavki');
  const completedTasks = document.getElementById('completed-tasks');
  
  if (totalLavki) {
    totalLavki.textContent = lavki;
  }
  
  if (completedTasks) {
    const completedCount = tasks.filter(task => task.completed).length;
    completedTasks.textContent = `${completedCount} из ${tasks.length}`;
  }
}

function showSuccessMessage(message) {
  // Создаем красивый тост
  const toast = document.createElement('div');
  toast.textContent = message;
  toast.style.cssText = `
    position: fixed;
    top: 20px;
    left: 50%;
    transform: translateX(-50%);
    background: #4caf50;
    color: white;
    padding: 12px 20px;
    border-radius: 25px;
    font-weight: 600;
    z-index: 1000;
    animation: slideIn 0.3s ease;
    box-shadow: 0 4px 12px rgba(76, 175, 80, 0.3);
  `;
  
  document.body.appendChild(toast);
  
  setTimeout(() => {
    toast.style.animation = 'slideIn 0.3s ease reverse';
    setTimeout(() => {
      document.body.removeChild(toast);
    }, 300);
  }, 2000);
}

// Обновите DOMContentLoaded - добавьте:
document.addEventListener('DOMContentLoaded', () => {
  // ... существующий код ...
  
  // Добавьте эти строки:
  loadCharacterName();
  initializeCharacterSelector();
  updateStats();
});

// Обновите renderTasks чтобы обновлять статистику:
function renderTasks() {
  // ... существующий код renderTasks ...
  updateStats(); // Добавьте эту строку в конец
}
// =====================
// 📋 СИСТЕМА ЗАДАНИЙ
// =====================

// Базовые задания с уникальными ID
const defaultTasks = [
  { id: 1, name: "Покормить персонажа", reward: 5, completed: false, userPhoto: null },
  { id: 2, name: "Поиграть с персонажем", reward: 10, completed: false, userPhoto: null },
  { id: 3, name: "Дать персонажу поспать", reward: 8, completed: false, userPhoto: null },
];

let tasks = [];

// Инициализация заданий
function initializeTasks() {
  const savedTasks = localStorage.getItem('tasks');
  
  if (savedTasks) {
    try {
      const parsedTasks = JSON.parse(savedTasks);
      
      // Восстанавливаем задания, сохраняя структуру defaultTasks
      tasks = defaultTasks.map(defaultTask => {
        const savedTask = parsedTasks.find(t => t.id === defaultTask.id);
        if (savedTask) {
          // Возвращаем сохраненное задание (с фото и статусом выполнения)
          return savedTask;
        }
        // Возвращаем задание по умолчанию
        return { ...defaultTask };
      });
      
      console.log('Задания загружены из localStorage:', tasks);
    } catch (e) {
      console.error('Ошибка загрузки заданий:', e);
      tasks = [...defaultTasks];
    }
  } else {
    // Первый запуск - используем задания по умолчанию
    tasks = [...defaultTasks];
    saveTasksToStorage();
    console.log('Созданы новые задания:', tasks);
  }
}

// Сохранение заданий
function saveTasksToStorage() {
  try {
    localStorage.setItem('tasks', JSON.stringify(tasks));
    console.log('Задания сохранены:', tasks);
  } catch (e) {
    console.error('Ошибка сохранения заданий:', e);
  }
}

// =====================
// РЕНДЕР ЗАДАНИЙ
// =====================
function renderTasks() {
  const list = document.getElementById('task-list');
  if (!list) {
    console.error('Элемент task-list не найден');
    return;
  }

  list.innerHTML = '';

  tasks.forEach((task, i) => {
    const li = document.createElement('li');
    li.className = 'task-item';
    
    if (task.completed) {
      li.style.background = '#f8fff8';
      li.style.borderLeft = '4px solid #4caf50';
    }

    const divName = document.createElement('div');
    divName.style.fontWeight = 'bold';
    divName.style.marginBottom = '10px';
    divName.innerHTML = task.completed ? 
      `✅ <s>${task.name}</s>` : 
      `📝 ${task.name}`;
    li.appendChild(divName);

    // Показываем фото пользователя, если задание выполнено
    if (task.completed && task.userPhoto) {
      const userImgContainer = document.createElement('div');
      userImgContainer.style.marginTop = '10px';
      
      const userLabel = document.createElement('div');
      userLabel.textContent = '📸 Ваше фото:';
      userLabel.style.fontWeight = 'bold';
      userLabel.style.marginBottom = '5px';
      userLabel.style.color = '#2e7d32';
      userImgContainer.appendChild(userLabel);
      
      const userImg = document.createElement('img');
      userImg.src = task.userPhoto;
      userImg.alt = "Ваше фото";
      userImg.style.width = '100%';
      userImg.style.maxHeight = '200px';
      userImg.style.borderRadius = '8px';
      userImg.style.border = '2px solid #4caf50';
      userImg.style.objectFit = 'cover';
      userImg.style.boxShadow = '0 2px 8px rgba(76, 175, 80, 0.3)';
      userImgContainer.appendChild(userImg);
      
      li.appendChild(userImgContainer);
    }

    const btnContainer = document.createElement('div');
    btnContainer.className = 'task-buttons';

    if (!task.completed) {
      // Кнопка для загрузки фото
      const fileInput = document.createElement('input');
      fileInput.type = 'file';
      fileInput.accept = 'image/*';
      fileInput.capture = 'environment';
      fileInput.style.display = 'none';
      fileInput.id = `file-input-${i}`;
      
      fileInput.addEventListener('change', function(e) {
        handleImageUpload(e, task.id);
      });

      const uploadBtn = document.createElement('button');
      uploadBtn.className = 'complete';
      uploadBtn.textContent = `Прикрепить фото (+${task.reward} лавок)`;
      uploadBtn.onclick = () => {
        console.log('Клик по кнопке загрузки для задания:', task.id);
        fileInput.click();
      };

      btnContainer.appendChild(fileInput);
      btnContainer.appendChild(uploadBtn);
    } else {
      const completedText = document.createElement('span');
      completedText.textContent = '✅ Выполнено';
      completedText.style.color = '#4caf50';
      completedText.style.fontWeight = 'bold';
      btnContainer.appendChild(completedText);
    }

    li.appendChild(btnContainer);
    list.appendChild(li);
  });
  
  console.log('Задания отрендерены:', tasks);
}

// =====================
// ОБРАБОТКА ЗАГРУЗКИ ФОТО
// =====================
function handleImageUpload(event, taskId) {
  console.log('Загрузка фото для задания ID:', taskId);
  const file = event.target.files[0];
  if (!file) {
    console.log('Файл не выбран');
    return;
  }

  // Проверяем, что файл является изображением
  if (!file.type.match('image.*')) {
    alert('Пожалуйста, выберите файл изображения');
    return;
  }

  // Проверяем размер файла (максимум 5MB)
  if (file.size > 5 * 1024 * 1024) {
    alert('Файл слишком большой. Максимальный размер: 5MB');
    return;
  }

  const reader = new FileReader();
  
  reader.onload = function(e) {
    const imageDataUrl = e.target.result;
    console.log('Фото загружено, данные URL получены');
    
    // Сохраняем фото пользователя и завершаем задание
    completeTaskWithPhoto(taskId, imageDataUrl);
  };
  
  reader.onerror = function() {
    console.error('Ошибка при чтении файла');
    alert('Ошибка при чтении файла');
  };
  
  reader.readAsDataURL(file);
}

// =====================
// ВЫПОЛНЕНИЕ ЗАДАНИЯ С ФОТО
// =====================
function completeTaskWithPhoto(taskId, photoDataUrl) {
  console.log('Завершение задания ID:', taskId, 'с фото');
  
  const taskIndex = tasks.findIndex(t => t.id === taskId);
  
  if (taskIndex === -1) {
    console.error('Задание не найдено ID:', taskId);
    return;
  }
  
  const task = tasks[taskIndex];
  if (task.completed) {
    console.log('Задание уже выполнено');
    alert('Это задание уже выполнено!');
    return;
  }

  // Сохраняем фото пользователя
  task.userPhoto = photoDataUrl;
  task.completed = true;
  lavki += task.reward;
  updateLavki();

  // Сохраняем в localStorage
  saveTasksToStorage();

  // Перерисовываем задания
  renderTasks();
  animateCharacterReward();
  
  alert(`Задание "${task.name}" выполнено! Получено ${task.reward} лавок 💎`);
  console.log('Задание завершено, новые данные:', tasks);
}

// =====================
// АНИМАЦИЯ ПЕРСОНАЖА
// =====================
function animateCharacterReward() {
  const img = document.getElementById('character-img');
  if (img) {
    img.classList.add('bounce');
    setTimeout(() => img.classList.remove('bounce'), 1000);
  }
}

// =====================
// ДЕБАГ ФУНКЦИИ
// =====================
function debugTasks() {
  console.log('Текущие задания:', tasks);
  console.log('LocalStorage tasks:', localStorage.getItem('tasks'));
}

// Для отладки в консоли
window.debugTasks = debugTasks;

// =====================
// 🎯 ИСПРАВЛЕНИЯ ОТОБРАЖЕНИЯ
// =====================

// Функция для инициализации всех значений
function initializeDisplayValues() {
  // Убедимся, что все значения отображаются
  updateLavki();
  updateCharacterDisplay();
  updateStats();
  
  // Инициализируем значения потребностей если они не отображаются
  const foodElement = document.getElementById('food');
  const energyElement = document.getElementById('energy');
  const funElement = document.getElementById('fun');
  
  if (foodElement && !foodElement.textContent) foodElement.textContent = '80';
  if (energyElement && !energyElement.textContent) energyElement.textContent = '60';
  if (funElement && !funElement.textContent) funElement.textContent = '40';
}

// Обновленная функция для загрузки имени
function loadCharacterName() {
  const savedName = localStorage.getItem('charName');
  const nameInput = document.getElementById('char-name');
  
  if (savedName && nameInput) {
    nameInput.value = savedName;
  } else {
    // Устанавливаем значение по умолчанию
    nameInput.value = 'Лавчик';
  }
  updateCharacterDisplay();
}

// Обновленная функция для статистики
function updateStats() {
  const totalLavki = document.getElementById('total-lavki');
  const completedTasks = document.getElementById('completed-tasks');
  const creationDate = document.getElementById('creation-date');
  
  if (totalLavki) {
    totalLavki.textContent = lavki;
  }
  
  if (completedTasks) {
    const completedCount = tasks.filter(task => task.completed).length;
    completedTasks.textContent = `${completedCount} из ${tasks.length}`;
  }
  
  if (creationDate) {
    // Получаем дату создания или устанавливаем текущую
    let creation = localStorage.getItem('creationDate');
    if (!creation) {
      creation = new Date().toLocaleDateString('ru-RU');
      localStorage.setItem('creationDate', creation);
    }
    creationDate.textContent = creation;
  }
}

// Функция для проверки изображений
function checkImages() {
  const images = document.querySelectorAll('img');
  images.forEach(img => {
    img.onerror = function() {
      console.log('Ошибка загрузки изображения:', this.src);
      // Можно установить placeholder
      this.src = 'https://via.placeholder.com/200x200/ECF0F1/666?text=🎮';
    };
  });
}

// Обновите DOMContentLoaded
document.addEventListener('DOMContentLoaded', () => {
  // ... существующий код навигации ...
  
  // Добавьте эти вызовы:
  loadCharacterName();
  initializeCharacterSelector();
  initializeDisplayValues();
  checkImages();
  
  // Принудительно обновляем отображение через небольшой таймаут
  setTimeout(() => {
    updateLavki();
    updateCharacterDisplay();
    updateStats();
  }, 100);
});

// Добавьте обработчик изменения экранов
function showScreen(name) {
  document.querySelectorAll('.screen').forEach(screen => {
    screen.classList.remove('active');
  });

  const screen = document.getElementById(`screen-${name}`);
  if (screen) {
    screen.classList.add('active');
    // При переключении экранов обновляем данные
    setTimeout(() => {
      updateStats();
      if (name === 'character') {
        updateCharacterDisplay();
      }
    }, 50);
  }
}

// Добавьте в app.js эту функцию
function liftCharacterImage() {
  const characterScreen = document.getElementById('screen-character');
  const characterImg = document.getElementById('character-img');
  const characterHeader = document.querySelector('.character-header');
  
  if (characterScreen && characterImg && characterHeader) {
    // Минимальные отступы между именем и картинкой
    characterHeader.style.marginBottom = '0px';
    characterHeader.style.paddingBottom = '0px';
    
    // Принудительно поднимаем картинку
    const screenHeight = window.innerHeight;
    const navHeight = 60;
    const headerHeight = characterHeader.offsetHeight;
    const needsHeight = characterScreen.querySelector('.needs-overlay').offsetHeight;
    
    // Вычисляем доступную высоту для изображения (увеличиваем)
    const availableHeight = screenHeight - navHeight - headerHeight - needsHeight - 10;
    
    // Устанавливаем максимальную высоту изображения
    characterImg.style.maxHeight = `${Math.max(250, availableHeight)}px`;
    
    // Принудительно убираем любые отступы
    characterScreen.style.gap = '0';
    characterScreen.style.rowGap = '0';
  }
}

// Вызываем при загрузке и изменении размера
document.addEventListener('DOMContentLoaded', function() {
  setTimeout(liftCharacterImage, 100);
  window.addEventListener('resize', liftCharacterImage);
});

// Обновляем функцию showScreen
function showScreen(name) {
  document.querySelectorAll('.screen').forEach(screen => {
    screen.classList.remove('active');
  });

  const screen = document.getElementById(`screen-${name}`);
  if (screen) {
    screen.classList.add('active');
    
    if (name === 'character') {
      setTimeout(liftCharacterImage, 50);
    }
    
    setTimeout(() => {
      updateStats();
      if (name === 'character') {
        updateCharacterDisplay();
      }
    }, 50);
  }
}
