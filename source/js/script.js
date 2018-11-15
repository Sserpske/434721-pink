var toggle = document.querySelector(".page-header__toggle");
var menu = document.querySelector(".page-header");

menu.classList.add("page-header--menu-closed")
toggle.addEventListener("click", function (evt) {
        evt.preventDefault();
        menu.classList.toggle("page-header--menu-opened");
        menu.classList.toggle("page-header--menu-closed");
      });
