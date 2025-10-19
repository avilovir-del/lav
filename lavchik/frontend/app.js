// Telegram WebApp
const tg = window.Telegram?.WebApp || null;
if (tg) tg.expand();

let user = {
  telegram_id: null,
  balance: 0,
  needs: { food: 80, energy: 60, fun: 40 },
  tasks: []
};

const API_URL = "<YOUR_BACKEND_URL>"; // <- сюда вставь url твоего backend (после деплоя)

function showScreen(name){
  document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
  document.getElementById(`screen-${name}`).classList.add('active');
  if (name === 'tasks') fetchTasks();
}

function updateCharacter(){
  document.getElementById("food").textContent = user.needs.food;
  document.getElementById("energy").textContent = user.needs.energy;
  document.getElementById("fun").textContent = user.needs.fun;

  const avg = (user.needs.food + user.needs.energy + user.needs.fun)/3;
  const img = document.getElementById("character-img");
  const status = document.getElementById("character-status");
  if (avg < 40) { img.src = "sad.png"; status.textContent = "Он грустит 😞"; }
  else if (avg < 70) { img.src = "neutral.png"; status.textContent = "Он норм 😐"; }
  else { img.src = "happy.png"; status.textContent = "Он счастлив 😄"; }
}

async function fetchTasks(){
  // GET /tasks (public endpoint)
  try {
    const r = await fetch(`${API_URL}/tasks`);
    const data = await r.json();
    user.tasks = data;
    renderTasks();
  } catch (e){
    console.error(e);
  }
}

function renderTasks(){
  const list = document.getElementById('task-list');
  list.innerHTML = "";
  user.tasks.forEach(task => {
    const li = document.createElement('li');
    li.textContent = ${task.title} (+${task.reward} лавок) ;
    const btn = document.createElement('button');
    btn.textContent = "Выполнено";
    btn.onclick = () => submitTask(task.id);
    li.appendChild(btn);
    list.appendChild(li);
  });
}

async function submitTask(task_id){
  // Получаем telegram id из initData (если есть). Без проверки — небезопасно.
  const telegram_id = tg?.initDataUnsafe?.user?.id || null;
  const body = { telegram_id, task_id, note: "Отправлено из WebApp" };
  try {
    const r = await fetch(`${API_URL}/submit`, {
      method: "POST",
      headers: { "Content-Type":"application/json" },
      body: JSON.stringify(body)
    });
    if (r.status === 200){
      alert("Задание отправлено на проверку");
    } else {
      const j = await r.json();
      alert("Ошибка: " + (j.detail || r.status));
    }
  } catch (e){
    console.error(e);
    alert("Ошибка сети");
  }
}

function buyItem(item, cost){
  alert("Покупка: " + item + " за " + cost);
}

// init
updateCharacter();