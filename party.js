const COHORT = `2408-FTB-MT-WEB-PT`;
const EVENT_URL = `https://fsa-crud-2aa9294fe819.herokuapp.com/api/${COHORT}/events`;
const GUEST_URL = `https://fsa-crud-2aa9294fe819.herokuapp.com/api/${COHORT}/guests`;
const RSVP_URL = `https://fsa-crud-2aa9294fe819.herokuapp.com/api/${COHORT}/rsvps`;

const partyList = document.querySelector('#parties');
const form = document.querySelector('#eventSubmission');
const guestLog = document.querySelector('#guestLog')

const state = {
    events: [],
    guests: [],
    rsvps: [],
    currentGuest: [],
};

async function getEvents() {
    try {
        const responseEvent = await fetch(EVENT_URL);
        const jsonEvent = await responseEvent.json();
        state.events = jsonEvent.data;
    
        const responseGuest = await fetch(GUEST_URL);
        const jsonGuest = await responseGuest.json();
        state.guests = jsonGuest.data;

        const responseRsvp = await fetch(RSVP_URL);
        const jsonRsvp = await responseRsvp.json();
        state.rsvps = jsonRsvp.data;
        } catch (error) {
        console.error(error);
        }
    renderEvents();
}

async function addEvent(event) {
    try {
        const response = await fetch(EVENT_URL, {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body:JSON.stringify(event)
        })
        const json = await response.json();
        console.log('json:', json);

        if (!response.ok) {
            throw new Error(json.error.message);
        } 
        }catch (error) {
            console.error(error);        
        }
    getEvents();    
}
    async function addGuest(guest) {
        try {
            const response = await fetch(GUEST_URL, {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body:JSON.stringify(guest)
            })
            const json = await response.json();
            console.log('json:', json);
    
            if (!response.ok) {
                throw new Error(json.error.message);
            } 
            }catch (error) {
                console.error(error);        
            }
        getEvents();  

        }

        async function addRsvp(rsvp) {
            try {
                const response = await fetch(RSVP_URL, {
                    method: 'POST',
                    headers: {'Content-Type': 'application/json'},
                    body:JSON.stringify(rsvp)
                })
                const json = await response.json();
                console.log('json:', json);
        
                if (!response.ok) {
                    throw new Error(json.error.message);
                } 
                }catch (error) {
                    console.error(error);        
                }
            getEvents();  
    
            }

            async function deleteEvent(id) {
                try {
                    const response = await fetch(`${EVENT_URL}/${id}`, {
                        method: 'DELETE',
                    });
                    if (!response.ok) {
                        throw new Error(error.message);
                    }
                    await response.json();
                     } catch (error) {
                        console.error(error);
                     }
                     getEvents();
                
            }

            async function deleteGuest(id) {
                try {
                    const response = await fetch(`${GUEST_URL}/${id}`, {
                        method: 'DELETE',
                    });
                    if (!response.ok) {
                        throw new Error(error.message);
                    }
                    await response.json();
                     } catch (error) {
                        console.error(error);
                     }
                     getEvents();
                
            }

            function rsvpObject(e){
                const guestMatch = state.guests.find(
                    (guest) => guest.name === state.currentGuest.name
                );
                const rsvpRequest = {
                    guestId: guestMatch.id,
                    eventID: e,
                };
                rsvpPost(rsvpRequest);
            }

            function guestList(event) {
                const eventRsvpF = state.rsvps.filter((f) => f.event.Id == event);
                const guestFilter = [];
                state.guests.forEach((g => {
                    eventRsvpF.forEach((f) => {
                        f.guestId == g.id ? guestFilter.push(g) : null;
                    })}));
                    renderGuests(guestFilter, event);
            }

            function renderEvents() {
                const eventCards = state.events.map((party) => {
                    const eventCard = document.createElement('li');
                    const eventDateTime = new Date(party.date);
                    const dateString = eventDateTime.toLocaleDateString();
                    const timeString = eventDateTime.toLocaleTimeString();
                    eventCard.innerHTML = `
                        <h2>${party.name}</h2>
                        <p>${dateString}</p>
                        <p>${timeString}</p>
                        <p>${party.location}</p>
                        <p>${party.description}</p>
                        <button class='rsvpId-${party.id}'>RSVP</button>
                        <button id='delete-${party.id}' class='delete'>Del</button>
                        <section id='guest-list-${party.id}'>
                        <button class 'guestList' id=guestList-${party.id}'>Guest List</button>
                        </section>           
                        
                        `;
                        return eventCard;
                });
                partyList.replaceChildren(...eventCards);

                if (state.currentGuest.length !== 0) {
                    const welcomeM = document.createElement("h2");
                    welcomeM.innerText = `Welcome ${state.currentGuest.name}!`;
                    guestLog.replaceChildren(welcomeM);

                }

            }
                function renderGuests(gLIst, eId) {
                    const guestSection = document.querySelector(`#guest-list${eId}`);
                    const renderedList = gList.map((g) => {
                        const individual = document.createElement('l');
                        individual.innerHTML = `${g.name}`;
                    
                    });
                    guestSection.replaceChildren(...renderedList);

                }

                partyList.addEventListener('click',(e) => {
                    e.preventDefault();
                    if (e.target.className === 'delete') {
                        const deID = e.target.id.split('-')[1];
                        console.log(e.target.id);
                        deleteEvent(deID);
                    }else if (e.target.className === "rsvp") { 
                        const evtId = parseInt(e.target.id.split("-")[1]);
                        rsvpObject(evtId);
                    
                      } else if (e.target.className === "guestList"){ 
                        const eveId = e.target.id.split("-")[1];
                        guestList(eveId);
                    
                      } else if (e.target.className === "del-guest"){ 
                        const gId = e.target.id.split("-")[1];
                        deleteGuest(gId);
                      }

                });

                form.addEventListener("submit", (e) => { 
                    e.preventDefault();
                  const eventName = form.eventName.value;
                  const dateTime = new Date(form.eventDateTime.value);
                  const location = form.eventLocation.value;
                  const eventDescription = form.eventDescription.value;
                
                  const eventObject = {
                    name: eventName,
                    description: eventDescription,
                    date: dateTime,
                    location: location,
                  }; 
                  addEvent(eventObject);
                });
                console.log(guestLog);
                guestLog.addEventListener("submit", (e) => { 
                  e.preventDefault();
                  const guestObject = {
                    name: guestLog.guestName.value,
                    email: guestLog.email.value,
                    phone: guestLog.phone.value,
                  };
                  state.currentGuest = guestObject;
                 
                  addGuest(state.currentGuest);
                });
                
                // Finally run the code
                getEvents();          

            