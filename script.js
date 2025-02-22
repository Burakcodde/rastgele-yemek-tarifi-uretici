function favorileriYukle() {
  const favoriler = JSON.parse(localStorage.getItem("favoriler")) || [];
  const favorilerHTML = favoriler
    .map(
      (tarif) => `
        <div class="card mt-2">
            <div class="card-body">
                <h5 class="card-title">${tarif.ad}</h5>
                <p class="card-text"><strong>Malzemeler:</strong> ${tarif.malzemeler.join(
                  ", "
                )}</p>
                <p class="card-text"><strong>Hazırlanış Süresi:</strong> ${
                  tarif.sure
                }</p>
                <p class="card-text"><strong>Hazırlanışı:</strong> ${
                  tarif.hazirlanis
                }</p>
            </div>
        </div>
    `
    )
    .join("");
  document.getElementById("favoriler").innerHTML = favorilerHTML;
}

function kategorileriYukle() {
  fetch("https://www.themealdb.com/api/json/v1/1/categories.php")
    .then((response) => response.json())
    .then((data) => {
      const kategoriSecimi = document.getElementById("kategoriSecimi");
      data.categories.forEach((kategori) => {
        const option = document.createElement("option");
        option.value = kategori.strCategory;
        option.textContent = kategori.strCategory;
        kategoriSecimi.appendChild(option);
      });
    });
}

function tarifGoster(tarif) {
  const tarifHTML = `
    <h2>${tarif.ad}</h2>
    <p><strong>Malzemeler:</strong></p>
    <ul>
        ${tarif.malzemeler.map((malzeme) => `<li>${malzeme}</li>`).join("")}
    </ul>
    <p><strong>Hazırlanış Süresi:</strong> ${tarif.sure}</p>
    <p><strong>Hazırlanışı:</strong> ${tarif.hazirlanis}</p>
  `;
  document.getElementById("tarif").innerHTML = tarifHTML;
  document.getElementById("favorilereEkleButonu").style.display =
    "inline-block";
  document.getElementById("favorilereEkleButonu").onclick = function () {
    const favoriler = JSON.parse(localStorage.getItem("favoriler")) || [];
    favoriler.push(tarif);
    localStorage.setItem("favoriler", JSON.stringify(favoriler));
    favorileriYukle();
  };

  const paylasimButonlari = document.getElementById("paylasimButonlari");
  paylasimButonlari.style.display = "inline-block";

  document.getElementById("facebookPaylas").onclick = function () {
    const url = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
      window.location.href
    )}&quote=${encodeURIComponent(tarif.ad + "\n\n" + tarif.hazirlanis)}`;
    window.open(url, "_blank");
  };

  document.getElementById("twitterPaylas").onclick = function () {
    const url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(
      tarif.ad + "\n\n" + tarif.hazirlanis
    )}&url=${encodeURIComponent(window.location.href)}`;
    window.open(url, "_blank");
  };
}

document.getElementById("tarifButonu").addEventListener("click", function () {
  fetch("https://www.themealdb.com/api/json/v1/1/random.php")
    .then((response) => response.json())
    .then((data) => {
      const meal = data.meals[0];
      const rastgeleTarif = {
        ad: meal.strMeal,
        malzemeler: [],
        sure: "Bilinmiyor",
        hazirlanis: meal.strInstructions,
      };

      for (let i = 1; i <= 20; i++) {
        const ingredient = meal[`strIngredient${i}`];
        const measure = meal[`strMeasure${i}`];
        if (ingredient) {
          rastgeleTarif.malzemeler.push(`${measure} ${ingredient}`);
        }
      }

      tarifGoster(rastgeleTarif);
    });
});

document.getElementById("aramaButonu").addEventListener("click", function () {
  const malzeme = document.getElementById("malzemeInput").value;
  fetch(`https://www.themealdb.com/api/json/v1/1/filter.php?i=${malzeme}`)
    .then((response) => response.json())
    .then((data) => {
      if (data.meals) {
        const meal = data.meals[0];
        fetch(
          `https://www.themealdb.com/api/json/v1/1/lookup.php?i=${meal.idMeal}`
        )
          .then((response) => response.json())
          .then((data) => {
            const mealDetail = data.meals[0];
            const aramaTarif = {
              ad: mealDetail.strMeal,
              malzemeler: [],
              sure: "Bilinmiyor",
              hazirlanis: mealDetail.strInstructions,
            };

            for (let i = 1; i <= 20; i++) {
              const ingredient = mealDetail[`strIngredient${i}`];
              const measure = mealDetail[`strMeasure${i}`];
              if (ingredient) {
                aramaTarif.malzemeler.push(`${measure} ${ingredient}`);
              }
            }

            tarifGoster(aramaTarif);
          });
      } else {
        document.getElementById("tarif").innerHTML =
          "<p>Bu malzemeyle tarif bulunamadı.</p>";
        document.getElementById("favorilereEkleButonu").style.display = "none";
        document.getElementById("paylasimButonlari").style.display = "none";
      }
    });
});

document
  .getElementById("kategoriButonu")
  .addEventListener("click", function () {
    const kategori = document.getElementById("kategoriSecimi").value;
    if (kategori) {
      fetch(`https://www.themealdb.com/api/json/v1/1/filter.php?c=${kategori}`)
        .then((response) => response.json())
        .then((data) => {
          if (data.meals) {
            const meal = data.meals[0];
            fetch(
              `https://www.themealdb.com/api/json/v1/1/lookup.php?i=${meal.idMeal}`
            )
              .then((response) => response.json())
              .then((data) => {
                const mealDetail = data.meals[0];
                const kategoriTarif = {
                  ad: mealDetail.strMeal,
                  malzemeler: [],
                  sure: "Bilinmiyor",
                  hazirlanis: mealDetail.strInstructions,
                };

                for (let i = 1; i <= 20; i++) {
                  const ingredient = mealDetail[`strIngredient${i}`];
                  const measure = mealDetail[`strMeasure${i}`];
                  if (ingredient) {
                    kategoriTarif.malzemeler.push(`${measure} ${ingredient}`);
                  }
                }

                tarifGoster(kategoriTarif);
              });
          } else {
            document.getElementById("tarif").innerHTML =
              "<p>Bu kategoride tarif bulunamadı.</p>";
            document.getElementById("favorilereEkleButonu").style.display =
              "none";
            document.getElementById("paylasimButonlari").style.display = "none";
          }
        });
    }
  });

favorileriYukle();
kategorileriYukle();
