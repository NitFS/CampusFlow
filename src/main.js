import "./style.css";

const events = [
  {
    id: 1,
    title: "Frontend-разработка: от макета до интерфейса",
    category: "Разработка",
    date: "25 сентября, 15:00",
    place: "Аудитория 302",
    format: "Очно",
    level: "Начальный",
    seatsLeft: 12,
    seatsTotal: 30,
    description:
      "Практическое мероприятие о создании современных веб-интерфейсов: семантическая разметка, компоненты и адаптивность.",
    program: ["Разбор макета", "HTML и CSS", "Компонентный подход"],
    speakers: ["Анна Смирнова — frontend-разработчик"]
  },
  {
    id: 2,
    title: "Основы UX/UI для студенческих проектов",
    category: "Дизайн",
    date: "27 сентября, 12:00",
    place: "Онлайн",
    format: "Онлайн",
    level: "Начальный",
    seatsLeft: 25,
    seatsTotal: 40,
    description:
      "Введение в пользовательские сценарии, визуальную иерархию и проектирование интерфейсов.",
    program: ["User Flow", "Композиция", "Прототипирование"],
    speakers: ["Илья Волков — UX-дизайнер"]
  },
  {
    id: 3,
    title: "Git и командная разработка",
    category: "Разработка",
    date: "30 сентября, 17:30",
    place: "Лаборатория 105",
    format: "Очно",
    level: "Средний",
    seatsLeft: 0,
    seatsTotal: 25,
    description:
      "Практическая встреча по Git, веткам, pull request и командному процессу разработки.",
    program: ["Ветки", "Pull Request", "Code Review"],
    speakers: ["Максим Орлов — software engineer"]
  },
  {
    id: 4,
    title: "Академическое выступление: как подготовить доклад",
    category: "Коммуникации",
    date: "2 октября, 14:00",
    place: "Актовый зал",
    format: "Очно",
    level: "Начальный",
    seatsLeft: 18,
    seatsTotal: 50,
    description:
      "Как структурировать материал, подготовить слайды и уверенно представить результат.",
    program: ["Структура", "Слайды", "Публичное выступление"],
    speakers: ["Елена Ким — преподаватель"]
  }
];

const state = {
  favorites: new Set(),
  query: "",
  category: "Все",
  sort: "date",
  page: 1
};

const categories = ["Все", ...new Set(events.map((event) => event.category))];

function header() {
  return `
    <header class="header">
      <a class="logo" href="#/events">CampusFlow</a>
      <nav aria-label="Основная навигация">
        <a href="#/events">Мероприятия</a>
        <a href="#/events">Мои события</a>
        <a href="#/events">Профиль</a>
      </nav>
    </header>
  `;
}

function favoriteButton(event) {
  const active = state.favorites.has(event.id);
  return `
    <button
      class="favorite ${active ? "is-active" : ""}"
      type="button"
      aria-label="${active ? "Убрать из избранного" : "Добавить в избранное"}"
      aria-pressed="${active}"
      data-favorite="${event.id}"
    >${active ? "♥" : "♡"}</button>
  `;
}

function eventCard(event) {
  const noSeats = event.seatsLeft === 0;
  return `
    <article class="event-card">
      <div class="event-card__top">
        <span class="badge">${event.category}</span>
        ${favoriteButton(event)}
      </div>
      <h2>${event.title}</h2>
      <p class="muted">${event.date} · ${event.place}</p>
      <p class="muted">Мест: ${event.seatsLeft} из ${event.seatsTotal}</p>
      <a class="button button--primary" href="#/events/${event.id}">Подробнее</a>
      ${noSeats ? '<span class="status status--error">Мест нет</span>' : ""}
    </article>
  `;
}

function catalogPage() {
  const filtered = events
    .filter((event) => {
      const matchesQuery =
        event.title.toLowerCase().includes(state.query.toLowerCase());
      const matchesCategory =
        state.category === "Все" || event.category === state.category;
      return matchesQuery && matchesCategory;
    })
    .sort((a, b) => state.sort === "seats" ? b.seatsLeft - a.seatsLeft : a.id - b.id);

  return `
    ${header()}
    <main class="container">
      <section class="page-heading">
        <div>
          <p class="eyebrow">CampusFlow</p>
          <h1>Учебные мероприятия</h1>
          <p class="muted">Найдите мероприятие и запишитесь на участие.</p>
        </div>
      </section>

      <section class="toolbar" aria-label="Поиск и сортировка">
        <label class="search">
          <span class="sr-only">Поиск</span>
          <input id="search" type="search" value="${state.query}" placeholder="Поиск мероприятий..." />
        </label>
        <label>
          <span class="sr-only">Сортировка</span>
          <select id="sort">
            <option value="date" ${state.sort === "date" ? "selected" : ""}>По дате</option>
            <option value="seats" ${state.sort === "seats" ? "selected" : ""}>По количеству мест</option>
          </select>
        </label>
      </section>

      <section class="chips" aria-label="Категории">
        ${categories.map((category) => `
          <button class="chip ${state.category === category ? "is-selected" : ""}"
                  type="button" data-category="${category}">
            ${category}
          </button>
        `).join("")}
      </section>

      <div class="catalog-layout">
        <aside class="filter-panel">
          <h2>Мои фильтры</h2>
          <p class="muted">Формат и уровень можно расширить на следующих этапах.</p>
          <button class="button button--ghost" id="resetFilters">Сбросить</button>
        </aside>

        <section>
          <div class="results-header">
            <strong>${filtered.length} мероприятий</strong>
          </div>
          ${
            filtered.length
              ? `<div class="event-grid">${filtered.map(eventCard).join("")}</div>`
              : `<div class="empty-state"><h2>Ничего не найдено</h2><p>Измените поисковый запрос или фильтр.</p></div>`
          }
        </section>
      </div>
    </main>
  `;
}

function eventPage(id) {
  const event = events.find((item) => item.id === Number(id));
  if (!event) return notFound();

  const noSeats = event.seatsLeft === 0;

  return `
    ${header()}
    <main class="container">
      <a class="back-link" href="#/events">← Вернуться в каталог</a>

      <section class="event-detail">
        <div>
          <span class="badge">${event.category}</span>
          <h1>${event.title}</h1>
          <p class="lead">${event.description}</p>
          <p class="muted">${event.date} · ${event.place} · ${event.format}</p>
        </div>

        <aside class="registration-card">
          <strong>Осталось ${event.seatsLeft} из ${event.seatsTotal} мест</strong>
          <div class="progress">
            <span style="width:${(event.seatsLeft / event.seatsTotal) * 100}%"></span>
          </div>
          <button
            class="button button--primary button--wide"
            type="button"
            data-register="${event.id}"
            ${noSeats ? "disabled" : ""}
          >
            ${noSeats ? "Мест нет" : "Записаться"}
          </button>
          ${favoriteButton(event)}
        </aside>
      </section>

      <section class="tabs">
        <button class="tab is-active" data-tab="description">Описание</button>
        <button class="tab" data-tab="program">Программа</button>
        <button class="tab" data-tab="speakers">Спикеры</button>
      </section>

      <section class="tab-content" id="tabContent">
        <p>${event.description}</p>
      </section>

      <section class="organizer">
        <h2>Организатор</h2>
        <p>CampusFlow · Университетский образовательный центр</p>
      </section>
    </main>
  `;
}

function registerPage(id) {
  const event = events.find((item) => item.id === Number(id));
  if (!event) return notFound();

  return `
    ${header()}
    <main class="container form-container">
      <a class="back-link" href="#/events/${event.id}">← Назад к мероприятию</a>
      <h1>Регистрация</h1>
      <p class="muted">${event.title}</p>

      <form id="registrationForm" class="registration-form" novalidate>
        <label>
          Имя и фамилия *
          <input name="name" required autocomplete="name" />
          <small class="field-error" data-error="name"></small>
        </label>

        <label>
          E-mail *
          <input name="email" type="email" required autocomplete="email" />
          <small class="field-error" data-error="email"></small>
        </label>

        <label>
          Группа / команда
          <input name="group" />
        </label>

        <fieldset>
          <legend>Формат участия *</legend>
          <label class="radio"><input type="radio" name="format" value="Очно" required /> Очно</label>
          <label class="radio"><input type="radio" name="format" value="Онлайн" /> Онлайн</label>
          <small class="field-error" data-error="format"></small>
        </fieldset>

        <label>
          Комментарий
          <textarea name="comment" maxlength="500"></textarea>
          <small>До 500 символов</small>
        </label>

        <label class="checkbox">
          <input type="checkbox" name="consent" required />
          <span>Согласен с правилами участия *</span>
        </label>
        <small class="field-error" data-error="consent"></small>

        <div class="form-actions">
          <a class="button button--ghost" href="#/events/${event.id}">Отмена</a>
          <button class="button button--primary" type="submit">Отправить заявку</button>
        </div>

        <div id="formMessage" role="status"></div>
      </form>
    </main>
  `;
}

function notFound() {
  return `${header()}<main class="container"><h1>Страница не найдена</h1><a href="#/events">В каталог</a></main>`;
}

function render() {
  const hash = location.hash || "#/events";
  const parts = hash.replace(/^#\//, "").split("/");
  let html;

  if (parts[0] === "events" && !parts[1]) html = catalogPage();
  else if (parts[0] === "events" && parts[2] === "register") html = registerPage(parts[1]);
  else if (parts[0] === "events" && parts[1]) html = eventPage(parts[1]);
  else html = notFound();

  document.querySelector("#app").innerHTML = html;
  bindEvents();
}

function bindEvents() {
  document.querySelector("#search")?.addEventListener("input", (e) => {
    state.query = e.target.value;
    state.page = 1;
    render();
    document.querySelector("#search")?.focus();
  });

  document.querySelector("#sort")?.addEventListener("change", (e) => {
    state.sort = e.target.value;
    render();
  });

  document.querySelectorAll("[data-category]").forEach((button) => {
    button.addEventListener("click", () => {
      state.category = button.dataset.category;
      render();
    });
  });

  document.querySelector("#resetFilters")?.addEventListener("click", () => {
    state.query = "";
    state.category = "Все";
    state.sort = "date";
    render();
  });

  document.querySelectorAll("[data-favorite]").forEach((button) => {
    button.addEventListener("click", (e) => {
      e.preventDefault();
      const id = Number(button.dataset.favorite);
      state.favorites.has(id) ? state.favorites.delete(id) : state.favorites.add(id);
      render();
    });
  });

  document.querySelector("[data-register]")?.addEventListener("click", () => {
    location.hash = `#/events/${document.querySelector("[data-register]").dataset.register}/register`;
  });

  const tabs = document.querySelectorAll("[data-tab]");
  const content = document.querySelector("#tabContent");
  const id = location.hash.split("/")[2];
  const event = events.find((item) => item.id === Number(id));

  tabs.forEach((tab) => {
    tab.addEventListener("click", () => {
      tabs.forEach((item) => item.classList.remove("is-active"));
      tab.classList.add("is-active");

      const data = {
        description: `<p>${event.description}</p>`,
        program: `<ul>${event.program.map((item) => `<li>${item}</li>`).join("")}</ul>`,
        speakers: `<ul>${event.speakers.map((item) => `<li>${item}</li>`).join("")}</ul>`
      };

      content.innerHTML = data[tab.dataset.tab];
    });
  });

  document.querySelector("#registrationForm")?.addEventListener("submit", handleRegistration);
}

function handleRegistration(event) {
  event.preventDefault();
  const form = event.currentTarget;
  const data = new FormData(form);
  let valid = true;

  document.querySelectorAll(".field-error").forEach((el) => (el.textContent = ""));

  if (!data.get("name")?.trim()) {
    document.querySelector('[data-error="name"]').textContent = "Введите имя и фамилию.";
    valid = false;
  }

  const email = data.get("email")?.trim();
  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    document.querySelector('[data-error="email"]').textContent = "Введите корректный e-mail.";
    valid = false;
  }

  if (!data.get("format")) {
    document.querySelector('[data-error="format"]').textContent = "Выберите формат участия.";
    valid = false;
  }

  if (!data.get("consent")) {
    document.querySelector('[data-error="consent"]').textContent = "Необходимо согласие с правилами.";
    valid = false;
  }

  if (!valid) return;

  const button = form.querySelector('button[type="submit"]');
  button.disabled = true;
  button.textContent = "Отправка…";
  [...form.elements].forEach((element) => (element.disabled = true));

  setTimeout(() => {
    form.innerHTML = `
      <div class="success-state">
        <h2>Заявка отправлена</h2>
        <p>Регистрация на мероприятие прошла успешно.</p>
        <a class="button button--primary" href="#/events">Перейти в «Мои события»</a>
      </div>
    `;
  }, 700);
}

window.addEventListener("hashchange", render);
render();
