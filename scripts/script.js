import { typeEffectiveness } from "./typeEffectiveness.js";

const typeMatchups = Object.entries(typeEffectiveness);

const types = [];

typeMatchups.forEach((type) => {
  const [pokemonType] = type;
  types.push(pokemonType);
});

console.log(types);

const pokemonDropdown1 = document.querySelector(".pokemon-dropdown1");
const pokemonDropdown2 = document.querySelector(".pokemon-dropdown2");
const pokemonForm = document.querySelector(".type-submission-form");

pokemonDropdown1.innerHTML += types.map(
  (type) => `<option value=${type}>${type}</option>`
);

pokemonDropdown2.innerHTML += types.map(
  (type) => `<option value=${type}>${type}</option>`
);

let selectedType1 = '';
let selectedType2 = '';
disableSecondTypeSelection();

pokemonDropdown1.addEventListener("change", ()=> {selectedType1 = pokemonDropdown1.value;
  if (selectedType1 === ""){
    disableSecondTypeSelection()
  } else {
  enableSecondTypeSelection();
  }
})

pokemonDropdown2.addEventListener("change", ()=> {selectedType2= pokemonDropdown2.value;
    for (let option of pokemonDropdown1.options) {
      if (option.value === selectedType2) {
        option.disabled = true;
      } else {
        option.disabled = false;
      }
    }
}
)

function enableSecondTypeSelection() {
  pokemonDropdown2.disabled = false;
  for (let option of pokemonDropdown2.options) {
    if (option.value === selectedType1){
      option.disabled = true;
    } else {
      option.disabled = false;
    }
  }
}

function disableSecondTypeSelection() {
  pokemonDropdown2.value = '';
  pokemonDropdown2.disabled = true;

}

pokemonForm.addEventListener('submit', (e)=>{
  e.preventDefault();
  console.log(selectedType1);
  console.log(selectedType2);
  
})