"use strict";

import { headers } from "./settings.js";
const today = document.querySelector("#release_date");

window.addEventListener("DOMContentLoaded", init);

function init() {
  today.max = new Date(new Date().getTime() - new Date().getTimezoneOffset() * 60000).toISOString().split("T")[0];
}

function get() {
  fetch("https://zuzdata-0da8.restdb.io/rest/videogames", {
    method: "get",
    headers: headers,
  })
    .then((e) => e.json())
    .then((data) => data.forEach(showGame));
}

function post(data) {
  const postData = JSON.stringify(data);
  fetch("https://zuzdata-0da8.restdb.io/rest/videogames", {
    method: "post",
    headers: headers,
    body: postData,
  })
    .then((res) => res.json())
    .then((data) => showGame(data));
}

function showGame(game) {
  console.log(game);
  const template = document.querySelector("template").content;
  const copy = template.cloneNode(true);
  copy.querySelector("h2").textContent = game.title;
  copy.querySelector(".age_limit span").textContent = game.age_limit;
  copy.querySelector(".release_date").textContent = game.release_date;
  copy.querySelector(".genre").textContent = game.genre;
  copy.querySelector(".platforms").textContent = game.platforms;
  copy.querySelector(".players").textContent = game.players;
  copy.querySelector(".price").textContent = game.price;
  copy.querySelector(".metascore span").textContent = game.metascore;
  copy.querySelector(".developer").textContent = game.developer;

  document.querySelector(".games").appendChild(copy);
}
get();

const form = document.querySelector("form");
form.addEventListener("submit", (e) => {
  e.preventDefault();

  if (!form.elements.title.checkValidity()) {
    form.elements.title.nextElementSibling.classList.remove("hidden");
  } else {
    form.elements.title.nextElementSibling.classList.add("hidden");
  }

  if (!form.elements.age_limit.checkValidity()) {
    form.elements.age_limit.nextElementSibling.classList.remove("hidden");
  } else {
    form.elements.age_limit.nextElementSibling.classList.add("hidden");
  }

  if (!form.elements.release_date.checkValidity()) {
    form.elements.release_date.nextElementSibling.classList.remove("hidden");
  } else {
    form.elements.release_date.nextElementSibling.classList.add("hidden");
  }

  if (form.checkValidity()) {
    let multiplayer = true;
    if (form.elements.players.value === "singleplayer") {
      multiplayer = false;
    }
    const platforms = [];
    const platformEls = document.querySelectorAll("[name=platforms]:checked");
    platformEls.forEach((el) => platforms.push(el.value));

    console.log(platforms);
    post({
      title: form.elements.title.value,
      age_limit: form.elements.age_limit.value,
      release_date: Date.now(),
      genre: form.elements.genre.value,
      platforms: platforms,
      players: multiplayer,
      price: form.elements.price.value,
      metascore: form.elements.metascore.value,
      developer: form.elements.developer.value,
    });
  }
});
document.querySelector("form").setAttribute("novalidate", true);