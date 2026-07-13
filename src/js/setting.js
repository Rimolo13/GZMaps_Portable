const settings_id = [
  "settings",
  "settings-mode",
  "setting-server",
  "setting-local",
  "settings-server",
  "setting-input",
  "settings-user",
  "setting-admin",
  "setting-user",
  "settings-button",
];
let settings_list = [];
for (let i = 0; i < settings_id.length; i++) {
  settings_list.push(document.getElementById(`${settings_id[i]}`));
}

if (localStorage.getItem("settings") === null) {
  const maps = document.getElementById("maps");
  maps.classList.add("hidden");
  let settings = {};

  const selectiv = [2, 3, 7, 8];
  let settings_active_page = 0;
  const settings_page = [settings_list[1], settings_list[4], settings_list[6]];

  function switchselect(select) {
    if (select === 0 || select === 1) {
      const mode = ["server", "local"];
      settings.mode = mode[select];
    } else {
      const user = [0, 0, "admin", "user"];
      settings.user = user[select];
    }
    for (let i = 0; i < 4; i++) {
      if (select === i) {
        settings_list[selectiv[i]].classList.add("select-active");
      } else {
        settings_list[selectiv[i]].classList.remove("select-active");
      }
    }
  }

  function settings_page_switch() {
    for (let i = 0; i < 3; i++) {
      if (i === settings_active_page) {
        settings_page[i].classList.remove("not-displayed");
      } else {
        settings_page[i].classList.add("not-displayed");
      }
    }
  }

  for (let i = 0; i < 4; i++) {
    settings_list[selectiv[i]].addEventListener("click", () => {
      switchselect(i);
    });
  }

  settings_list[9].addEventListener("click", async () => {
    if (settings_active_page === 0) {
      if (settings.mode !== undefined) {
        if (settings.mode === "local") {
          localStorage.setItem("settings", `${JSON.stringify(settings)}`);
          maps.classList.remove("hidden");
          settings_list[0].classList.add("not-displayed");
          return;
        } else {
          settings_active_page++;
          settings_page_switch();
          return;
        }
      } else {
        alert("Bitte wählen Sie ein Betriebsmodus aus.");
      }
    }

    if (settings_active_page === 1) {
      function alert_link() {
        alert(
          "Bitte überprüfen Sie den Server Link.\nHinweis: Denken Sie an den / am Ende",
        );
      }
      try {
        const link = settings_list[5].textContent;
        const res = await fetch(`${link}t/GETMapData`);
        if (!res.ok) {
          alert_link();
        } else {
          settings.link = link;
          settings_active_page++;
          settings_page_switch();
          return;
        }
      } catch (e) {
        alert_link();
      }
    }

    if (settings_active_page === 2) {
      if (settings.user !== undefined) {
        localStorage.setItem("settings", `${JSON.stringify(settings)}`);
        maps.classList.remove("hidden");
        settings_list[0].classList.add("not-displayed");
        return;
      } else {
        alert("Bitte wählen Sie eine Rolle aus.");
      }
    }
  });
} else {
  settings_list[0].classList.add("not-displayed");
}
