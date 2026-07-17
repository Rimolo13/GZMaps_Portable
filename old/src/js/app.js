const maps = document.getElementById("maps");
const full_map = document.getElementById("full-map");
const edit_bar = document.getElementById("edit-bar");
const edit_button = document.getElementById("edit-button");
const save_button = document.getElementById("save-button");
const copyright = document.getElementById("copyright");

const title_maps = [
  "Gesamte Karte",
  "Haus 1",
  "Haus 2",
  "Haus 3",
  "Haus 4",
  "Haus 5",
  "Haus 6",
  "Haus 8",
  "Haus 11",
];
const template_list = [
  "full-map",
  "house-1",
  "house-2",
  "house-3",
  "house-4",
  "house-5",
  "house-6",
  "house-8",
  "house-11",
];
let routes = [];
let houses_ids = [];
let houses_maps_ids = [];

const houses_inputs = [10, 10, 18, 5, 4, 3, 6, 2];
const basements = [2, 2, 3, 1, 1, 1, 2, 0];

let input_list = [];
let value_list = [];
let edit_mode = 0;

const date_now = new Date();

for (let i = 0; i < template_list.length; i++) {
  routes.push(`#${template_list[i]}`);
  if (i === 0) {
    houses_ids.push(`${template_list[i]}-back`);
    houses_maps_ids.push(template_list[i]);
  } else {
    houses_ids.push(template_list[i]);
    houses_maps_ids.push(`${template_list[i]}-map`);
  }
}

function element_builder({
  element,
  id,
  classes,
  textcontent,
  type,
  placeholder,
  readonly,
  autocomplete,
}) {
  const createdelement = document.createElement(element);
  if (id) createdelement.id = id;
  if (classes) createdelement.className = classes;
  if (textcontent) createdelement.textContent = textcontent;
  if (type) createdelement.type = type;
  if (placeholder) createdelement.placeholder = placeholder;
  if (readonly) createdelement.readOnly = readonly;
  if (autocomplete) createdelement.autocomplete = autocomplete;
  return createdelement;
}

for (let i = 1; i < houses_maps_ids.length; i++) {
  //houses
  const full_map_house = element_builder({
    element: "div",
    classes: "houses",
    id: `${houses_ids[i]}`,
  });
  const full_map_house_number = element_builder({
    element: "p",
    textcontent: `${houses_ids[i].split("-")[1]}`,
  });
  full_map_house.appendChild(full_map_house_number);
  full_map.appendChild(full_map_house);
  //corridors
  if (i < 4) {
    const full_map_corridor = element_builder({
      element: "p",
      classes: `corridor-${i} corridors`,
    });
    full_map.appendChild(full_map_corridor);
  }
  //maps
  const map = element_builder({
    element: "div",
    classes: `${houses_maps_ids[i]} houses-map not-displayed`,
    id: `${houses_maps_ids[i]}`,
  });
  maps.appendChild(map);
  //map input felds
  for (let x = 1; x <= houses_inputs[i - 1]; x++) {
    const input = element_builder({
      element: "input",
      id: `h${i}-${x}`,
      classes: "input",
      type: "Text",
      placeholder: `${x}`,
      readonly: true,
      autocomplete: "off",
    });
    if (houses_inputs[i - 1] - basements[i - 1] < x) {
      input.classList.add("basements");
    }
    input_list.push(input);
    map.appendChild(input);
  }
}

window.addEventListener("resize", () => {
  setTimeout(correct_resize, 300);
});

correct_resize();
function correct_resize() {
  const height_70p = (window.innerHeight / 100) * 70;
  if (window.innerWidth < height_70p) {
    full_map.classList.add("full-map-scale-width");
    full_map.classList.remove("full-map-scale-hight");
  } else {
    full_map.classList.add("full-map-scale-hight");
    full_map.classList.remove("full-map-scale-width");
  }
}

window.addEventListener("popstate", repage);
repage();

function repage() {
  for (let i = 0; i < routes.length; i++) {
    if (routes[i] === window.location.hash) {
      switchmap(i);
      return;
    }
  }
  let path = routes[0];
  history.pushState({}, "", path);
  switchmap(0);
}

for (let i = 0; i < routes.length; i++) {
  const houses = document.getElementById(houses_ids[i]);
  const path = routes[i];
  houses.addEventListener("click", () => {
    history.pushState({}, "", path);
    switchmap(i);
  });
}

async function switchmap(map) {
  load_values();
  for (let i = 0; i < houses_maps_ids.length; i++) {
    if (i === map) {
      document.title = `GZMaps - ${title_maps[i]}`;
      document.getElementById("header").textContent =
        `GZMaps - ${title_maps[i]}`;
      const activ_map = document.getElementById(houses_maps_ids[i]);
      activ_map.classList.add("hidden");
      activ_map.classList.remove("not-displayed");
      setTimeout(() => {
        activ_map.classList.remove("hidden");
      }, 30);
      let settings = JSON.parse(localStorage.getItem("settings"));
      if (settings === null) {
        settings = {};
      }
      if (map === 0 || settings.user === "user") {
        edit_bar.classList.add("hidden");
        if (edit_mode === 1) {
          edit_switch();
        }
      } else {
        edit_bar.classList.remove("hidden");
      }
    } else {
      const inactiv_map = document.getElementById(houses_maps_ids[i]);
      inactiv_map.classList.add("not-displayed");
    }
  }
}

async function getmapdata() {
  try {
    let settings = JSON.parse(localStorage.getItem("settings"));
    if (settings.mode === "local") {
      return JSON.parse(localStorage.getItem("mapdata")).mapdata;
    }
    if (settings.mode === "server") {
      return (await (await fetch(`${settings.link}t/GETMapData`)).json())
        .mapdata;
    }
  } catch (e) {
    return [];
  }
}

async function postmapdata(mapdata) {
  try {
    let settings = JSON.parse(localStorage.getItem("settings"));
    if (settings.mode === "local") {
      localStorage.setItem(
        "mapdata",
        `${JSON.stringify({ mapdata: mapdata })}`,
      );
    }
    if (settings.mode === "server") {
      await fetch(`${settings.link}t/POSTMapData`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          mapdata: mapdata,
        }),
      });
    }
  } catch (e) {}
}

edit_button.addEventListener("click", edit_switch);
save_button.addEventListener("click", save);

async function save() {
  let mapdata = [];
  input_list.forEach((e) => {
    mapdata.push(e.value);
  });
  await postmapdata(mapdata);
  edit_switch();
}

async function edit_switch() {
  let settings = JSON.parse(localStorage.getItem("settings"));
  if (edit_mode == 0) {
    if (settings.mode === "server") {
      const getpassword = prompt("Password:");
      const code_words = [
        "LemmyIsGod",
        "PrinceOfFuckingDarkness",
        "ComeTouchMyMetalMachine",
        "MetalGods",
      ];
      const nice_links = [
        "https://youtu.be/fM1UPeAOyHM?si=B5QVM3Gl32ScGb6w",
        "https://youtu.be/S6A13bOB76A?si=bw6tJRjNZ_Gt4rA7",
        "https://youtube.com/shorts/mTQffwXF1k8?si=QN8msGXkStp0srmz",
        "https://youtu.be/CLWlCQZy87g?si=nNuZagMzejflPyff",
      ];
      for (let i = 0; i < code_words.length; i++) {
        if (getpassword === code_words[i]) {
          console.log(code_words[i], nice_links[i]);
          window.open(nice_links[i], "_blank");
          return;
        }
      }
      if (getpassword != "" && getpassword != null) {
        const password_valid = await fetch(`${settings.link}t/POSTPassword`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            PasswordInput: getpassword,
          }),
        });
        if ((await password_valid.json()).isValid === true) {
          input_list.forEach((e) => {
            e.readOnly = false;
          });
          save_button.classList.remove("hidden");
          edit_button.textContent = "abbrechen";
          edit_mode = 1;
        }
      }
    } else {
      input_list.forEach((e) => {
        e.readOnly = false;
      });
      save_button.classList.remove("hidden");
      edit_button.textContent = "abbrechen";
      edit_mode = 1;
    }
  } else {
    input_list.forEach((e) => {
      e.readOnly = true;
    });
    save_button.classList.add("hidden");
    edit_button.textContent = "bearbeiten";
    edit_mode = 0;
    load_values();
  }
}

async function load_values() {
  try {
    value_list = await getmapdata();
    set_values();
  } catch (err) {}
}

function set_values() {
  for (let i = 0; i < input_list.length; i++) {
    if (value_list[i] != undefined || value_list[i] != null) {
      input_list[i].value = value_list[i];
    }
  }
}

copyright.textContent = `©${date_now.getUTCFullYear()}\u00A0`;
