import { typeEffectiveness } from "./typeEffectiveness.js";

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

const typeMatchups = Object.entries(typeEffectiveness);
console.log(typeEffectiveness);

const types = [];

typeMatchups.forEach((type) => {
  const [pokemonType] = type;
  types.push(pokemonType);
});

console.log(types);

const typeSelectionSection = document.getElementById("typeSelectionSection");
const typeResultsSection = document.getElementById("typeResultsSection");

function hideSection(section) {
  return section.classList.add("hide-section");
}

function showSection(section) {
  return section.classList.remove("hide-section");
}

//DOM Elements for Type Selection
const pokemonDropdown1 = document.querySelector(".pokemon-dropdown1");
const pokemonDropdown2 = document.querySelector(".pokemon-dropdown2");
const pokemonForm = document.querySelector(".type-submission-form");

pokemonDropdown1.innerHTML += types.map(
  (type) => `<option value=${type}>${type}</option>`
);

pokemonDropdown2.innerHTML += types.map(
  (type) => `<option value=${type}>${type}</option>`
);

export let selectedType1 = "";
export let selectedType2 = "";
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
  determineTypeDamage(selectedType1, selectedType2);
  hideSection(typeSelectionSection);
  showSection(typeResultsSection);
  getPokemonData(selectedType1, selectedType2);
});

//DOM Elements for Type Results
const quadrupleDamageDiv = document.querySelector(".quadruple-damage");
const doubleDamageDiv = document.querySelector(".double-damage");
const normalDamageDiv = document.querySelector(".normal-damage");
const halfDamageDiv = document.querySelector(".half-damage");
const quarterDamageDiv = document.querySelector(".quarter-damage");
const noDamageDiv = document.querySelector(".no-damage");

function determineTypeDamage(type1, type2) {
  let type1Defenses = Object.entries(
    typeMatchups.filter((type) => type[0] === type1)[0][1]
  );

  console.log(type1Defenses);
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
  console.log(damageTotalbyType);

  let quadrupleDamage = [];
  let doubleDamage = [];
  let normalDamage = [];
  let halfDamage = [];
  let quarterDamage = [];
  let noDamage = [];

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
  console.log(quadrupleDamage);
  console.log(doubleDamage);
  console.log(normalDamage);
  console.log(halfDamage);
  console.log(quarterDamage);
  console.log(noDamage);

  mapOutTypes(quadrupleDamage, quadrupleDamageDiv);
  mapOutTypes(doubleDamage, doubleDamageDiv);
  mapOutTypes(normalDamage, normalDamageDiv);
  mapOutTypes(halfDamage, halfDamageDiv);
  mapOutTypes(quarterDamage, quarterDamageDiv);
  mapOutTypes(noDamage, noDamageDiv);
}

function mapOutTypes(dmgMultiplierArr, dmgMultiplierDiv) {
  dmgMultiplierArr.forEach((type) => {
    dmgMultiplierDiv.innerHTML += `<div class="type-block ${type}"><h2>${type}</h2></div>`;
  });
}

//DOM ELEMENTS FOR POKEMON OF MATCHING TYPE
const matchingPokemonSection = document.getElementById('pokemon-of-matching-type')
const randomPokemon = document.getElementsByClassName('random-pokemon');
const matchedTypes = document.getElementsByClassName('matched-types');
const pureTypes = document.getElementsByClassName('pure-tpyes');

function getTypeFromPokemon(pokemon, type1, type2) {
  let pokemonThatMatchedSelectedTypes = [];
  let purePokemonType = [];
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
        if (!secondPokemonType) {
          purePokemonType.push(pokemon);
        }
        pokemonThatMatchedSelectedTypes.push(pokemon);
      } else if (secondPokemonType === type1) {
        pokemonThatMatchedSelectedTypes.push(pokemon);
      }
    }
  });
  console.log("--------DUAL TYPES----------");
  setUpMatchingPokemon(pokemonThatMatchedSelectedTypes, "matching-types");
  console.log("--------PURE TYPES----------");
  setUpMatchingPokemon(purePokemonType, 'pure-types');
  pickRandomPokemon(pokemonThatMatchedSelectedTypes);
}

function setUpMatchingPokemon(matchingPokemon, grouping) {
  matchingPokemon.forEach((pokemon) => {
    let pokemonName =
      pokemon.forms[0].name.charAt(0).toUpperCase() +
      pokemon.forms[0].name.slice(1);
    let lcPokemonName = pokemonName.toLowerCase();
    let pokedexNumber = pokemon.id.toString().padStart(3,'0');
    console.log(pokedexNumber);
    let bulbapediaURL = `https://bulbapedia.bulbagarden.net/wiki/${pokemonName}_(Pok%C3%A9mon)`; 
    let serebiiURL = `https://www.serebii.net/pokedex/${pokedexNumber}.shtml`;
    let smogonURL = `https://www.smogon.com/dex/rb/pokemon/${lcPokemonName}/`;

    if (grouping === 'pure-types'){
        
    }
  });
}

function pickRandomPokemon(matchingPokemon) {
  let chooseRandomPokemon = Math.floor(Math.random()) * matchingPokemon.length;
  console.log(matchingPokemon[chooseRandomPokemon]);
}
