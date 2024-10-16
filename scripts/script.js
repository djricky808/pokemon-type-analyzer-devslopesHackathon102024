//Set up Types
import { typeEffectiveness } from "./typeEffectiveness.js";
const typeMatchups = Object.entries(typeEffectiveness);

const types = [];

typeMatchups.forEach((type) => {
  const [pokemonType] = type;
  types.push(pokemonType);
});

//Set up API call.
const URL = "https://pokeapi.co/api/v2/pokemon";

function fetchAllPokemon() {
  let promises = [];
  for (let i = 1; i < 151; i++) {
    let promise = fetch(`${URL}/${i}`);
    promises.push(promise);
  }
  return Promise.all(promises);
}

export const getPokemonData = (type1, type2) =>
  fetchAllPokemon()
    .then((response) => {
      return Promise.all(response.map((res) => res.json()));
    })
    .then((data) => {
      getTypeFromPokemon(data, type1, type2);
    })
    .catch((error) => {
      console.log("Pokemon not found", error);
    });

let quadrupleDamage = [];
let doubleDamage = [];
let normalDamage = [];
let halfDamage = [];
let quarterDamage = [];
let noDamage = [];

//DOM ELEMENTS FOR SECTION VISIBILITY
const typeSelectionSection = document.getElementById("typeSelectionSection");
const typeResultsSection = document.getElementById("typeResultsSection");
const matchingPokemonSection = document.getElementById(
  "pokemon-of-matching-type"
);
const returnToTypeMatchup = document.getElementById("rtn-type-match");
const returnToTypeSelection = document.getElementById("rtn-type-selection");

function hideSection(section) {
  return section.classList.add("hide-section");
}

function showSection(section) {
  return section.classList.remove("hide-section");
}

returnToTypeMatchup.addEventListener("click", () => {
  hideSection(matchingPokemonSection);
  showSection(typeResultsSection);
});

returnToTypeSelection.addEventListener("click", () => {
  hideSection(typeResultsSection);
  showSection(typeSelectionSection);
  disableSecondTypeSelection();
  pokemonDropdown1.value = "";
});

//TYPE SELECTION SECTION

//DOM ELEMENTS FOR TYPE SELECTION
const pokemonDropdown1 = document.querySelector(".pokemon-dropdown1");
const pokemonDropdown2 = document.querySelector(".pokemon-dropdown2");
const pokemonForm = document.querySelector(".type-submission-form");

pokemonDropdown1.innerHTML += types.map(
  (type) => `<option value=${type}>${type}</option>`
);

pokemonDropdown2.innerHTML += types.map(
  (type) => `<option value=${type}>${type}</option>`
);

let selectedType1 = "";
let selectedType2 = "";
disableSecondTypeSelection();

pokemonDropdown1.addEventListener("change", () => {
  selectedType1 = pokemonDropdown1.value;
  if (selectedType1 === "") {
    disableSecondTypeSelection();
  } else {
    enableSecondTypeSelection();
  }
});

pokemonDropdown2.addEventListener("change", () => {
  selectedType2 = pokemonDropdown2.value;
  for (let option of pokemonDropdown1.options) {
    if (option.value === selectedType2) {
      option.disabled = true;
    } else {
      option.disabled = false;
    }
  }
});

function enableSecondTypeSelection() {
  pokemonDropdown2.disabled = false;
  for (let option of pokemonDropdown2.options) {
    if (option.value === selectedType1) {
      option.disabled = true;
    } else {
      option.disabled = false;
    }
  }
}

function disableSecondTypeSelection() {
  pokemonDropdown2.value = "";
  pokemonDropdown2.disabled = true;
  for (let option of pokemonDropdown1.options) {
    option.disabled = false;
  }
}

pokemonForm.addEventListener("submit", (e) => {
  e.preventDefault();
  resetDamageArrs();
  determineTypeDamage(selectedType1, selectedType2);
  hideSection(typeSelectionSection);
  showSection(typeResultsSection);
  getPokemonData(selectedType1, selectedType2);
});

//MATCHUP RESULTS

//DOM ELEMENTS FOR TYPE MATCHUP RESULTS
const quadrupleDamageDiv = document.querySelector(".quadruple-damage");
const doubleDamageDiv = document.querySelector(".double-damage");
const normalDamageDiv = document.querySelector(".normal-damage");
const halfDamageDiv = document.querySelector(".half-damage");
const quarterDamageDiv = document.querySelector(".quarter-damage");
const noDamageDiv = document.querySelector(".no-damage");
const pokemonCount = document.querySelector(".pokemon-count");
const showPokemonButton = document.getElementById("show-pokemon");

function resetDamageArrs() {
  quadrupleDamage = [];
  doubleDamage = [];
  normalDamage = [];
  halfDamage = [];
  quarterDamage = [];
  noDamage = [];
}

function determineTypeDamage(type1, type2) {
  let type1Defenses = Object.entries(
    typeMatchups.filter((type) => type[0] === type1)[0][1]
  );

  let damageTotalbyType = [];

  for (let i = 0; i < type1Defenses.length; i++) {
    const [type, multiplier] = type1Defenses[i];
    if (type2) {
      let type2Defenses = Object.entries(
        typeMatchups.filter((type) => type[0] === type2)[0][1]
      );
      damageTotalbyType.push([type, multiplier * type2Defenses[i][1]]);
    } else {
      damageTotalbyType.push([type, multiplier]);
    }
  }

  damageTotalbyType.forEach((attackType) => {
    let [type, multiplier] = attackType;
    if (multiplier === 4) {
      quadrupleDamage.push(type);
    } else if (multiplier === 2) {
      doubleDamage.push(type);
    } else if (multiplier === 1) {
      normalDamage.push(type);
    } else if (multiplier === 0.5) {
      halfDamage.push(type);
    } else if (multiplier === 0.25) {
      quarterDamage.push(type);
    } else {
      noDamage.push(type);
    }
  });

  mapOutTypes(quadrupleDamage, quadrupleDamageDiv);
  mapOutTypes(doubleDamage, doubleDamageDiv);
  mapOutTypes(normalDamage, normalDamageDiv);
  mapOutTypes(halfDamage, halfDamageDiv);
  mapOutTypes(quarterDamage, quarterDamageDiv);
  mapOutTypes(noDamage, noDamageDiv);
}

function mapOutTypes(dmgMultiplierArr, dmgMultiplierDiv) {
  dmgMultiplierDiv.innerHTML = "";
  dmgMultiplierArr.forEach((type) => {
    dmgMultiplierDiv.innerHTML += `<div class="type-block ${type}"><h2>${type}</h2></div>`;
  });
}

//FINDING POKEMON THAT CONTAIN THE TYPE

//DOM ELEMENTS FOR POKEMON OF MATCHING TYPE
const randomPokemon = document.querySelector(".random-pokemon");
const matchedTypes = document.querySelector(".matched-types");

function getTypeFromPokemon(pokemon, type1, type2) {
  let pokemonThatMatchedSelectedTypes = [];
  pokemon.forEach((pokemon) => {
    let firstPokemonType = pokemon.types[0].type.name;
    let secondPokemonType = pokemon.types[1]?.type.name;

    if (type2) {
      if (firstPokemonType === type1 || firstPokemonType === type2) {
        if (
          (secondPokemonType && secondPokemonType === type1) ||
          secondPokemonType === type2
        ) {
          pokemonThatMatchedSelectedTypes.push(pokemon);
        }
      }
    } else {
      if (firstPokemonType === type1) {
        pokemonThatMatchedSelectedTypes.push(pokemon);
      } else if (secondPokemonType === type1) {
        pokemonThatMatchedSelectedTypes.push(pokemon);
      }
    }
  });
  if (pokemonThatMatchedSelectedTypes.length === 0) {
    pokemonCount.innerHTML =
      "<h3>There are no Pokemon with this typing in Kanto!</h3>";
    showPokemonButton.disabled = true;
  } else {
    pokemonCount.innerHTML = `
    <h3 > There are ${pokemonThatMatchedSelectedTypes.length} Pokemon with this typing in Kanto!</h3>`;
    showPokemonButton.disabled = false;
    setUpMatchingPokemon(pokemonThatMatchedSelectedTypes);
    pickRandomPokemon(pokemonThatMatchedSelectedTypes);
  }
}

showPokemonButton.addEventListener("click", () => {
  hideSection(typeResultsSection);
  showSection(matchingPokemonSection);
});

function setUpMatchingPokemon(matchingPokemon) {
  matchedTypes.innerHTML = "";
  matchingPokemon.forEach((pokemon) => {
    let pokemonName =
      pokemon.forms[0].name.charAt(0).toUpperCase() +
      pokemon.forms[0].name.slice(1);
    let lcPokemonName = pokemonName.toLowerCase();

    let pokedexNumber = pokemon.id.toString().padStart(3, "0");

    let pokemonSpriteUrl =
      pokemon.sprites.versions["generation-iii"]["firered-leafgreen"]
        .front_default;

    let bulbapediaURL = `https://bulbapedia.bulbagarden.net/wiki/${pokemonName}_(Pok%C3%A9mon)`;
    let serebiiURL = `https://www.serebii.net/pokedex/${pokedexNumber}.shtml`;
    let smogonURL = `https://www.smogon.com/dex/rb/pokemon/${lcPokemonName}/`;

    matchedTypes.innerHTML += `
      <div class="pokemon-tab">
        <h3>${pokedexNumber}</h3>
        <h>${pokemonName}</h>
        <img src=${pokemonSpriteUrl} alt=${pokemonName}></img>
        <ul class="pokemon-sites">
          <li><a href=${bulbapediaURL} target='_blank'>
            <img src="../images/120px-Bulbapedia_bulb.png" alt='Bulbapedia'></a><li>
          <li><a href=${serebiiURL} target='_blank'>
            <img src="../images/serebii.png" alt='Serebii'></a><li>
          <li><a href=${smogonURL} target='_blank'>
            <img src="../images/smogon.png" alt='Smogon'></a><li>
        </ul>
      </div>`;
  });
}

function pickRandomPokemon(matchingPokemon) {
  let randomPokemon = Math.floor(Math.random() * matchingPokemon.length);
  makeCard(matchingPokemon[randomPokemon]);
}

function makeCard(pokemon) {
  let pokemonName =
    pokemon.forms[0].name.charAt(0).toUpperCase() +
    pokemon.forms[0].name.slice(1);
  let lcPokemonName = pokemonName.toLowerCase();

  let pokedexNumber = pokemon.id.toString().padStart(3, "0");

  let pokemonImgUrl = pokemon.sprites.other["official-artwork"].front_default;

  let firstPokemonType = pokemon.types[0].type.name;
  let secondPokemonType = pokemon.types[1]?.type.name;

  let bulbapediaURL = `https://bulbapedia.bulbagarden.net/wiki/${pokemonName}_(Pok%C3%A9mon)`;
  let serebiiURL = `https://www.serebii.net/pokedex/${pokedexNumber}.shtml`;
  let smogonURL = `https://www.smogon.com/dex/rb/pokemon/${lcPokemonName}/`;

  randomPokemon.innerHTML = `
    <div class="random-pokemon">
      <h1>Featured Pokemon</h1>
      <img class="random-pokemon-img" src=${pokemonImgUrl} alt=${pokemonName}/>
      <h1>${pokedexNumber}</h1>
      <h1>${pokemonName}</h1>
      <div class="type-frame">
        <div class="type-block ${firstPokemonType}"><h2>${firstPokemonType}</h2></div>
        ${
          secondPokemonType
            ? `<div class="type-block ${secondPokemonType}"><h2>${secondPokemonType}</h2></div>`
            : ""
        }
      </div>
      <h1>Learn More!</h1>
      <ul class="pokemon-sites">
        <li class="web-button bulbapedia">
          <a href=${bulbapediaURL} target='_blank'>
            <img src="../images/120px-Bulbapedia_bulb.png" alt='Bulbapedia'/>Bulbapedia
          </a>
        </li>
        <li class="web-button serebii">
          <a href=${serebiiURL} target='_blank'>
            <img src="../images/serebii.png" alt='Serebii'/>Serebii
          </a>
        <li>
        <li class="web-button smogon">
          <a href=${smogonURL} target='_blank'>
            <img src="../images/smogon.png" alt='Smogon'/>Smogon
          </a>
        <li>
      </ul>
    </div>`;
}
