// Данные аудиторий.
const rooms = [
  {
    id: 1,
    name: "Аудитория 101",
    capacity: 25,
    equipment: "Проектор, доска"
  },
  {
    id: 2,
    name: "Аудитория 202",
    capacity: 18,
    equipment: "Компьютеры, проектор"
  },
  {
    id: 3,
    name: "Аудитория 305",
    capacity: 40,
    equipment: "Экран, микрофон, доска"
  }
];

// Бронирования хранятся в массиве до обновления страницы.
const bookings = [];

const rules = [
  "Укажите имя, аудиторию, дату и время занятия.",
  "Бронирование на прошедшую дату или время запрещено.",
  "Время окончания должно быть позже времени начала.",
  "В одной аудитории нельзя создавать пересекающиеся бронирования.",
  "Следующее занятие может начинаться сразу после окончания предыдущего.",
  "Ненужное бронирование можно отменить во вкладке «Бронирования»."
];

const content = document.querySelector("#content");
const tabs = document.querySelectorAll(".tab");

let nextBookingId = 1;

// Переключение вкладок без перезагрузки.
tabs.forEach((tab) => {
  tab.addEventListener("click", () => {
    switchTab(tab.dataset.tab);
  });
});

function switchTab(tabName, selectedRoomId = null) {
  tabs.forEach((tab) => {
    const isActive = tab.dataset.tab === tabName;

    tab.classList.toggle("active", isActive);

    if (isActive) {
      tab.setAttribute("aria-current", "page");
    } else {
      tab.removeAttribute("aria-current");
    }
  });

  content.replaceChildren();

  if (tabName === "rooms") {
    renderRooms();
  } else if (tabName === "bookings") {
    renderBookings(selectedRoomId);
  } else if (tabName === "rules") {
    renderRules();
  }
}

// Создание элемента DOM.
// textContent безопасно отображает введённый пользователем текст.
function createElement(tag, text = "", className = "") {
  const element = document.createElement(tag);
  element.textContent = text;

  if (className) {
    element.className = className;
  }

  return element;
}

function getToday() {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

function renderRooms() {
  content.append(createElement("h2", "Аудитории"));

  const grid = createElement("div", "", "grid");

  rooms.forEach((room) => {
    const card = createElement("article", "", "card");

    card.append(
      createElement("h3", room.name),
      createElement("p", `Вместимость: ${room.capacity} человек`),
      createElement("p", `Оборудование: ${room.equipment}`)
    );

    const button = createElement("button", "Забронировать", "primary");
    button.type = "button";

    button.addEventListener("click", () => {
      switchTab("bookings", room.id);
    });

    card.append(button);
    grid.append(card);
  });

  content.append(grid);
}

function renderBookings(selectedRoomId) {
  content.append(createElement("h2", "Новое бронирование"));

  const panel = createElement("section", "", "panel");

  // Здесь только статическая разметка формы.
  panel.innerHTML = `
    <form id="booking-form">
      <label>
        Ваше имя
        <input
          name="person"
          type="text"
          placeholder="Например: Эльдар"
          minlength="2"
          maxlength="60"
          required
        >
      </label>

      <label>
        Аудитория
        <select name="room" required></select>
      </label>

      <label>
        Дата
        <input name="date" type="date" required>
      </label>

      <div class="time-fields">
        <label>
          Начало
          <input name="start" type="time" required>
        </label>

        <label>
          Окончание
          <input name="end" type="time" required>
        </label>
      </div>

      <p id="message" class="message" role="status"
         aria-live="polite"></p>

      <button type="submit" class="primary">
        Создать бронирование
      </button>
    </form>
  `;

  content.append(panel);

  const form = panel.querySelector("#booking-form");
  const roomSelect = form.elements.namedItem("room");
  const dateInput = form.elements.namedItem("date");

  rooms.forEach((room) => {
    const option = createElement("option", room.name);
    option.value = room.id;
    roomSelect.append(option);
  });

  if (selectedRoomId !== null) {
    roomSelect.value = selectedRoomId;
  }

  dateInput.min = getToday();
  dateInput.value = getToday();

  form.addEventListener("submit", (event) => {
    event.preventDefault();
    addBooking(form);
  });

  content.append(createElement("h2", "Список бронирований"));

  const list = createElement("div", "", "booking-list");
  list.id = "booking-list";
  content.append(list);

  renderBookingList();
}

function showMessage(text, isError = false) {
  const message = document.querySelector("#message");

  message.textContent = text;
  message.className = `message ${isError ? "error" : "success"}`;
}

function addBooking(form) {
  const data = new FormData(form);

  const person = String(data.get("person")).trim();
  const roomId = Number(data.get("room"));
  const date = String(data.get("date"));
  const start = String(data.get("start"));
  const end = String(data.get("end"));

  if (person.length < 2 || person.length > 60) {
    showMessage("Имя должно содержать от 2 до 60 символов.", true);
    return;
  }

  if (!rooms.some((room) => room.id === roomId)) {
    showMessage("Выберите существующую аудиторию.", true);
    return;
  }

  if (!date || !start || !end) {
    showMessage("Заполните дату и время.", true);
    return;
  }

  if (start >= end) {
    showMessage(
      "Время окончания должно быть позже времени начала.",
      true
    );
    return;
  }

  const startDate = new Date(`${date}T${start}`);

  if (
    Number.isNaN(startDate.getTime()) ||
    startDate.getTime() <= Date.now()
  ) {
    showMessage("Выберите дату и время в будущем.", true);
    return;
  }

  // Интервалы пересекаются, если:
  // новое начало < старого окончания
  // И новое окончание > старого начала.
  const conflict = bookings.find((booking) => {
    return (
      booking.roomId === roomId &&
      booking.date === date &&
      start < booking.end &&
      end > booking.start
    );
  });

  if (conflict) {
    showMessage(
      `Аудитория уже занята с ${conflict.start} до ${conflict.end}.`,
      true
    );
    return;
  }

  bookings.push({
    id: nextBookingId++,
    person,
    roomId,
    date,
    start,
    end
  });

  showMessage("Бронирование успешно создано!");
  renderBookingList();
}

function renderBookingList() {
  const list = document.querySelector("#booking-list");
  list.replaceChildren();

  if (bookings.length === 0) {
    list.append(createElement("p", "Бронирований пока нет."));
    return;
  }

  const sortedBookings = [...bookings].sort((a, b) => {
    return `${a.date}T${a.start}`.localeCompare(`${b.date}T${b.start}`);
  });

  sortedBookings.forEach((booking) => {
    const room = rooms.find((item) => item.id === booking.roomId);
    const card = createElement("article", "", "card booking");
    const info = createElement("div");

    const formattedDate = booking.date
      .split("-")
      .reverse()
      .join(".");

    info.append(
      createElement("h3", room.name),
      createElement("p", `Имя: ${booking.person}`),
      createElement(
        "p",
        `${formattedDate}, ${booking.start}–${booking.end}`
      )
    );

    const deleteButton = createElement("button", "Отменить", "danger");
    deleteButton.type = "button";

    deleteButton.addEventListener("click", () => {
      const index = bookings.findIndex((item) => item.id === booking.id);

      if (index !== -1) {
        bookings.splice(index, 1);
      }

      renderBookingList();
      showMessage("Бронирование отменено.");
    });

    card.append(info, deleteButton);
    list.append(card);
  });
}

function renderRules() {
  content.append(createElement("h2", "Правила бронирования"));

  const panel = createElement("section", "", "panel");
  const list = createElement("ol", "", "rules");

  rules.forEach((rule) => {
    list.append(createElement("li", rule));
  });

  panel.append(list);
  content.append(panel);
}

// Стартовая вкладка.
switchTab("rooms");