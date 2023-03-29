//axios.get returns an object(the promise is already parsed into json format)
// axios
//   .get("https://swapi.dev/api/people/1")
//   .then((res) => {
//     console.log(res);
//   })
//   .catch((e) => {
//     console.log(e);
//   });

//refactor with async
// const getStarWarsPerson = async (id) => {
//   try {
//     const res = await axios.get("https://swapi.dev/api/people/" + id);
//     console.log(res.data);
//   } catch (e) {
//     console.log("Error: ", e);
//   }
// };
// getStarWarsPerson(5);
// getStarWarsPerson(10);

const jokeList = document.querySelector("#jokes");

//2 ways to write async func
const getDadJoke = async () => {
  try {
    const config = { headers: { Accept: "application/json" } };

    //second paramater is the headers config
    const res = await axios.get("https://icanhazdadjoke.com/", config);

    return res.data.joke;
  } catch (e) {
    console.log("No jokes available, sorry");
  }
};

async function addJokeToList() {
  try {
    const joke = await getDadJoke();
    const jokeLI = document.createElement("LI");

    jokeLI.append(joke);
    jokeList.append(jokeLI);
  } catch (e) {
    console.log("No jokes today.. :(");
  }
}

document.querySelector("#btn").addEventListener("click", addJokeToList);
