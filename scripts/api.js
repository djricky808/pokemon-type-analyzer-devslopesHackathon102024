const URL = "https://pokeapi.co/api/v2/pokemon";

export function fetchAllPokemon() {
  let promises = [];
  for (let i = 1; i < 1025; i++) {
    let promise = fetch(`${URL}/${i}`);
    promises.push(promise);
  }
  return Promise.all(promises);
}

const getPokemonData = (type1, type2) =>
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

function getTypeFromPokemon(pokemon, type1, type2) {
  let pokemonThatMatchedSelectedType = [];
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
          pokemonThatMatchedSelectedType.push(pokemon);
        }
      }
    } else {
      if (firstPokemonType === type1) {
        !secondPokemonType
          ? purePokemonType.push(pokemon)
          : pokemonThatMatchedSelectedType.push(pokemon);
      } else if (secondPokemonType === type1) {
        pokemonThatMatchedSelectedType.push(pokemon);
      }
    }
  });
  //console.log(pokemonThatMatchedSelectedType);
  console.log(purePokemonType);
}

getPokemonData("fire");
