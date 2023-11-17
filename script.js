idCounter =0;


const playerContainer = document.getElementById("all-players-container");
const newPlayerFormContainer = document.getElementById("new-player-form");
const inputidentifi = document.querySelector('#identifi');
const inputname = document.querySelector('#names');
const inputbreed = document.querySelector('#breed');
const textareastatuss = document.querySelector('#statuss');
const inputimg = document.querySelector('#img');



// Add your cohort name to the cohortName variable below, replacing the 'COHORT-NAME' placeholder
const cohortName = "2308-ACC-WEB-PT-B";
// Use the APIURL variable for fetch requests
const APIURL = `https://fsa-puppy-bowl.herokuapp.com/api/${cohortName}/`;

const state = {
    players: [],
    singlePlayer: {},
};

userInput.addEventListener('submit', (event) => {
    event.preventDefault();///
    addTask();

    console.log('new event submit');
});
/**
 * It fetches all players from the API and returns them
 * @returns An array of objects.
 */
const fetchAllPlayers = async () => {
    try {
        const res = await fetch(`${APIURL}/players`);
        const json = await res.json();
        state.players = json.data.players;
        console.log(state.players);
        return state.players;
    } catch (err) {
        console.error("Uh oh, trouble fetching players!", err);
    }
};

const fetchSinglePlayer = async (playerId) => {
    try {
        const res = await fetch(`${APIURL}/players/${playerId}`);
        const json = await res.json();
        state.singlePlayer = json.data;
    } catch (err) {
        console.error(`Oh no, trouble fetching player #${playerId}!`, err);
    }
};

const addNewPlayer = async (playerObj) => {
    event.preventDefault();
    try {
        const res = await fetch(APIURL, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(playerObj),
        });

        const result = await res.json();
        state.players.push(result);
        renderAllPlayers();
        return result;
    } catch (err) {
        console.error(
            "Oops, something went wrong with adding that player!",
            err
        );
    }
};

const removePlayer = async (playerId) => {
    try {
        await fetch(`${APIURL}/players/${playerId}`, {
            method: "DELETE",
        });
        state.players = state.players.filter(
            (player) => player.id !== playerId
        );
        renderAllPlayers();
    } catch (err) {
        console.error(
            `Whoops, trouble removing player #${playerId} from the roster!`,
            err
        );
    }
};

/**
 
 * The `fetchSinglePlayer` and `removePlayer` functions are defined in the
 * @param playerList - an array of player objects
 * @returns the playerContainerHTML variable.
 */
const renderAllPlayers = (playerList) => {
    try {
        if (playerList.length === 0) {
            playerContainer.innerHTML = "<li>No players.</li>";
            return;
        }
//Get all data from url 
        const playerCards = playerList.map((player) => {
            idCounter ++;
            const li = document.createElement("div");
            li.innerHTML = `<div class="task-container" id="${idCounter}">
                <img src="${player.imageUrl}" alt=${player.name}">
                <p>Name: ${player.name}</p>
                <p>Breed: ${player.breed}</p>
                <p>Status: ${player.status}</p>
                <p>Team: ${player.teamId}</p>
                <input type="checkbox">
                <img src="delete.png" class="closeBtn">
            
            </div>`;
            const seeDetailsButton = document.createElement("button");
            seeDetailsButton.textContent = "See details";
            seeDetailsButton.addEventListener("click", async () => {
                await fetchSinglePlayer(player.id);
            });

            const deleteButton = document.createElement("button");
            deleteButton.textContent = "DELETE";
            deleteButton.addEventListener("click", async () => {
                await removePlayer(player);
                fetchAllPlayers();
            });
            li.append(seeDetailsButton, deleteButton);
            return li;
        });
        playerContainer.replaceChildren(...playerCards);
    } catch (err) {
        console.error("Uh oh, trouble rendering players!", err);
    }
};

/**
 * It renders a form to the DOM, and when the form is submitted, it adds a new player to the database,
 * fetches all players from the database, and renders them to the DOM.
 * In this point I can no do how to update and delete data from Url 
 */



// I create this fuction for insert new player 
let addTask = () => {
    idCounter++;//count Id

    let newValue = inputidentifi.value;
    let newValuedates = inputname.value;
    let newValueTimes = inputbreed.value;
    let newAdress = textareastatuss.value;
    let newDescription = inputimg.value;
//POST add new elemt 

    list.innerHTML += `<div class="task-container" id="${idCounter}">
    <label>IMG:</label>
    <td>
    ${newDescription}
    </td>
    <label >NAME:</label>
    <td>
        ${newValue}
    </td>
    <label>BREED:</label>
    <td>
    ${newValuedates}
    </td>
    <label>STATUS:</label>
    <td>
    ${newValueTimes}
    </td>
    <label>TEAM:</label>
    <td>
    ${newAdress}
    </td>
   



    <input type="checkbox">
    <img src="delete.png" class="closeBtn">

</div>`
///clear for a new event
inputidentifi.value = '';
inputname.value ='';
inputbreed.value= '';
textareastatuss.value='';
inputimg.value='';


    updateStats();


};

list.addEventListener('click', (Event) => {

    if (Event.srcElement.nodeName == 'INPUT') {
        updateStats();
    } else if (Event.srcElement.nodeName == 'IMG') {
        deleteTask(Event.srcElement.parentNode.id);
    }
});
//update 
//count length 
//
let updateStats = () => {
    let element = list.querySelectorAll('div');
    let checkbox = list.querySelectorAll('input[type="checkbox"]:checked');

    stats.innerHTML = `<p>:Pending Events ${element.length} Complete:${checkbox.length}</p>`

};
///DELETE
let deleteTask = (id) => {
    let taskToDelete = document.getElementById(id);
    list.removeChild(taskToDelete);
    updateStats();
}


const init = async () => {
    const players = await fetchAllPlayers();
    renderAllPlayers(players);

    addTask();
};

init();





