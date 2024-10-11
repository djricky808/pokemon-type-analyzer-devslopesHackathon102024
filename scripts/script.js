import { typeEffectiveness } from "./typeEffectiveness.js";

const typeMatchups = Object.entries(typeEffectiveness);

const types = []

typeMatchups.forEach((type) => {
  const [pokemonType, attackType] = type;
  types.push(pokemonType)
  // if (pokemonType === "fire"){
  //     console.log(attackType);
  // }
});

console.log(types);


const pokemonDropdown = document.querySelectorAll(".pokemon-dropdown");

console.log(pokemonDropdown);

pokemonDropdown.forEach((selection)=>{
    selection.innerHTML += types.map((type) =>
    `<option value=${type}>${type}</option>`)
})
