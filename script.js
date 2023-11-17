const playerContainer = document.getElementById("all-players-container");
const newPlayerFormContainer = document.getElementById("new-player-form");

// Add your cohort name to the cohortName variable below, replacing the 'COHORT-NAME' placeholder
const cohortName = "2308-ACC-WEB-PT-B";
// Use the APIURL variable for fetch requests
const APIURL = `https://fsa-puppy-bowl.herokuapp.com/api/${cohortName}/`;

const state = {
    players: [],
    singlePlayer: {},
};

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
 * It takes an array of player objects, loops through them, and creates a string of HTML for each
 * player, then adds that string to a larger string of HTML that represents all the players.
 *
 * Then it takes that larger string of HTML and adds it to the DOM.
 *
 * It also adds event listeners to the buttons in each player card.
 *
 * The event listeners are for the "See details" and "Remove from roster" buttons.
 *
 * The "See details" button calls the `fetchSinglePlayer` function, which makes a fetch request to the
 * API to get the details for a single player.
 *
 * The "Remove from roster" button calls the `removePlayer` function, which makes a fetch request to
 * the API to remove a player from the roster.
 *
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

        const playerCards = playerList.map((player) => {
            const li = document.createElement("li");
            li.innerHTML = `
                <img src="${player.imageUrl}" alt=${player.name}">
                <p>Name: ${player.name}</p>
                <p>Breed: ${player.breed}</p>
                <p>Status: ${player.status}</p>
                <p>Team: ${player.teamId}</p>
            `;
            const seeDetailsButton = document.createElement("button");
            seeDetailsButton.textContent = "See details";
            seeDetailsButton.addEventListener("click", async () => {
                await fetchSinglePlayer(player.id);
            });

            const deleteButton = document.createElement("button");
            deleteButton.textContent = "Remove from roster";
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
 */
const renderNewPlayerForm = () => {
    try {
        const form = document.createElement("form");
        form.classList.add("addPlayer");

        const nameInput = document.createElement("input");
        nameInput.type = "text";
        nameInput.placeholder = "Name";
        nameInput.name = "name";

        const breedInput = document.createElement("input");
        breedInput.type = "text";
        breedInput.placeholder = "Breed";
        breedInput.name = "breed";

        const statusInput = document.createElement("input");
        statusInput.type = "text";
        statusInput.placeholder = "Field or benched";
        statusInput.name = "status";

        const teamInput = document.createElement("input");
        teamInput.type = "text";
        teamInput.placeholder = "Team Id";
        teamInput.name = "teamId";

        const addPlayerButton = document.createElement("button");
        addPlayerButton.textContent = "Add player";

        form.addEventListener("submit", async (event) => {
            event.preventDefault();

            const newPlayer = {
                name: nameInput.value,
                breed: breedInput.value,
                status: statusInput.value,
                team: teamInput.value,
            };

            try {
                const result = await addNewPlayer(newPlayer);
                console.log(`New player added: ${result}`);

                const updatedPlayerList = await fetchAllPlayers();
                renderAllPlayers(updatedPlayerList);
            } catch (err) {
                console.error("Uh oh, trouble adding new player!", err);
            }
        });

        form.append(nameInput, breedInput, statusInput, teamInput, addPlayerButton);

        newPlayerFormContainer.appendChild(form);
    } catch (err) {
        console.error("Uh oh, trouble rendering the new player form!", err);
    }
};

const init = async () => {
    const players = await fetchAllPlayers();
    renderAllPlayers(players);

    renderNewPlayerForm();
};

init();


