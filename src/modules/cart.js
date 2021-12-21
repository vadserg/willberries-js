const cart = () => {
  const cartBtn = document.querySelector(".button-cart"); // кнопка корзина
  const cart = document.getElementById("modal-cart"); // сама модалка
  const closeBtn = cart.querySelector(".modal-close"); // кнопка закрытия крестик
  const cartTable = document.querySelector(".cart-table__goods"); //товарная таблица в модалке корзины
  const modalForm = document.querySelector(".modal-form");
  const cartTotalCost = document.querySelector('.card-table__total');

  const deleteCartItem = (id) => {
    const cart = JSON.parse(localStorage.getItem("cart"));

    const newCart = cart.filter((good) => {
      return good.id !== id;
    });

    localStorage.setItem("cart", JSON.stringify(newCart));

    renderCartGoods(JSON.parse(localStorage.getItem("cart")));
  };

  const plusCartItem = (id) => {
    const cart = JSON.parse(localStorage.getItem("cart"));

    const newCart = cart.map((good) => {
      if (good.id === id) {
        good.count++;
      }
      return good;
    });

    localStorage.setItem("cart", JSON.stringify(newCart));

    renderCartGoods(JSON.parse(localStorage.getItem("cart")));
  };

  const minusCartItem = (id) => {
    const cart = JSON.parse(localStorage.getItem("cart"));

    const newCart = cart.map((good) => {
      if (good.id === id && good.count > 1) {
        good.count--;
      }
      return good;
    });

    localStorage.setItem("cart", JSON.stringify(newCart));

    renderCartGoods(JSON.parse(localStorage.getItem("cart")));
  };
  // добавляем товар в корзину
  const addToCart = (id) => {
    // парсим список товаров выбранной группы
    const goods = JSON.parse(localStorage.getItem("goods"));
    // ищем товар, на котором кликнули по кнопке в корзину
    const clickedGood = goods.find((good) => good.id === id);
    // парсим корзину из хранилища или обнуляем, если она еще не создавалась
    const cart = localStorage.getItem("cart")
      ? JSON.parse(localStorage.getItem("cart"))
      : [];
    // если в корзине уже есть элемент с таким id
    if (cart.some((good) => good.id === clickedGood.id)) {
      // то маппим корзину, увеличивая на 1 кол-во этой товарной единицы
      cart.map((good) => {
        if (good.id === clickedGood.id) {
          good.count++;
        }
        return good;
      });
      // если такого элемента в корзине нет, то
    } else {
      // кол-во ставим 1
      clickedGood.count = 1;
      // добавляем новый товар в корзину
      cart.push(clickedGood);
    }
    // сохраняем корзину в хранилище, не забывая сериализовать массив в строку
    localStorage.setItem("cart", JSON.stringify(cart));
    cartBtn.style.background = '#4592ff';
  };
  // рендер таблицы товаров корзины
  const renderCartGoods = (goods) => {
    cartTable.innerHTML = "";
    let totalCost = '';

    goods.forEach((good) => {
      const tr = document.createElement("tr");
      tr.innerHTML = `
						<td>${good.name}</td>
						<td>${good.price}$</td>
						<td><button class="cart-btn-minus"">-</button></td>
						<td>${good.count}</td>
						<td><button class=" cart-btn-plus"">+</button></td>
						<td>${good.price * good.count}$</td>
						<td><button class="cart-btn-delete"">x</button></td>
      `;

      cartTable.append(tr);

      tr.addEventListener("click", (e) => {
        if (e.target.classList.contains("cart-btn-minus")) {
          minusCartItem(good.id);
        } else if (e.target.classList.contains("cart-btn-plus")) {
          plusCartItem(good.id);
        } else if (e.target.classList.contains("cart-btn-delete")) {
          deleteCartItem(good.id);
        }
      });
      totalCost += (good.price * good.count);

    });

    cartTotalCost.innerText = totalCost + '$';
  };

  const sendForm = () => {
    const cartArray = localStorage.getItem("cart")
      ? JSON.parse(localStorage.getItem("cart"))
      : [];

    fetch("https://jsonplaceholder.typicode.com/posts", {
      method: "POST",
      body: JSON.stringify({
        cart: cartArray,
        name: modalForm.nameCustomer.value,
        phone: modalForm.phoneCustomer.value,
      }),
    }).then(() => {
      cart.style.display = "none";
    });
  };

  modalForm.addEventListener("submit", (e) => {
    e.preventDefault();
    sendForm();
    localStorage.removeItem("cart");
    modalForm.nameCustomer.value = '';
    modalForm.phoneCustomer.value = '';
  });

  // открываем модалку по кнопке корзина
  cartBtn.addEventListener("click", () => {
    const cartArray = localStorage.getItem("cart")
      ? JSON.parse(localStorage.getItem("cart"))
      : [];
    // рендерим таблицу товаров корзины
    if (cartArray.length != 0) {
      renderCartGoods(cartArray);
      // делаем модалку с корзиной видимой
      cart.style.display = "flex";
    } else {
      cartBtn.style.background = 'lightgrey';
    }
  });
  // закрываем корзину по крестику
  closeBtn.addEventListener("click", () => (cart.style.display = "none"));
  // закрываем по клику на стороне
  cart.addEventListener("click", (e) => {
    if (e.target.classList.contains("overlay")) {
      cart.style.display = "none";
    }
  });
  // закрываем по нажатию Esc
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
      cart.style.display = "none";
    }
  });

  // Обрабатываем нажатия на кнопки "add to cart"
  // прослушиваем клики на странице в любом месте
  document.addEventListener("click", (e) => {
    // вся эта чехарда только из-за того, что на кнопке висит span с ценой и текстом, на которых тоже можно кликнуть
    // если кликнули на элементе, ближайший родитель которого .add-to-cart (или на нем самом)
    if (e.target.closest(".add-to-cart")) {
      // то инициируем кнопку как этот самый родитель
      const toCartBtn = e.target.closest(".add-to-cart");
      // и у нее есть поле data-id, которое однозначно определяет товарную позицию
      const goodId = toCartBtn.dataset.id;
      // добавляем товар в корзину
      addToCart(goodId);
    }
  });
};

export default cart;
