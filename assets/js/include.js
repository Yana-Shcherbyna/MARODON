// js/includes.js
// Використовуємо ES-модуль з defer, щоб мав місце топ-левел await
const includes = [
  { selector: ".header", file: "header.html" },
  { selector: ".footer", file: "footer.html" },
];

;(async () => {
  for (const { selector, file } of includes) {
    const targets = document.querySelectorAll(selector); // ✅ всі елементи

    for (const target of targets) {
      // Якщо вже є вміст усередині — пропускаємо
      if (target.innerHTML.trim()) {
        console.log(`Skip include for ${selector}`);
        continue;
      }

      try {
        const response = await fetch(file);
        if (!response.ok) throw new Error(`Status ${response.status}`);
        const html = await response.text();
        target.insertAdjacentHTML("beforeend", html);
        console.log(`Included ${file} into ${selector}`);
      } catch (err) {
        console.error(`Failed to load ${file}:`, err);
      }
    }
  }

  // Кидаємо івент, коли все готово
  document.dispatchEvent(new Event("includesLoaded"));
})();