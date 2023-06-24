function onMake() {
    const elemMain = document.getElementById("rawInput");
    const elemSec = document.getElementById("objectDisplay");
    const value = elemMain.value;

    //[1] is the name [4] is the Title
    const valueProcessed = value.split("\n");
    // elemSec.value=JSON.stringify(valueProcessed)
    elemSec.value = JSON.stringify({});

    console.log(valueProcessed);
}

const credentials = {
    UserId: "15203275",
    APIKey: "a0a75553088d1f8adb59e4389af33f05a233a65c"
};

async function getUser() {
    var myHeaders = new Headers();
    myHeaders.append("Accept", "application/json");
    var res;
    var requestOptions = {
        method: "GET",
        headers: myHeaders,
        redirect: "follow"
    };

    return await fetch(
            `https://api.pipedrive.com/v1/users/me?api_token=${credentials.APIKey}`,
            requestOptions
        )
        .then((response) => response.json())
        .then((result) => {
            res = result;
            console.log(result);
            return res;
        })
        .catch((error) => console.log("error", error));
}

async function addPerson(name, owner_id, org_id, email, phone) {
    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    myHeaders.append("Accept", "application/json");
    var res;
    var raw = JSON.stringify({
        name: name,
        owner_id: owner_id,
        org_id: org_id,
        email: [{
            value: email,
            primary: true,
            label: "Work"
        }],
        phone: [{
            value: phone || "",
            primary: true,
            label: "HQ"
        }],
        visible_to: "7",
        marketing_status: "",
        add_time: new Date(Date.now()).toISOString()
    });

    var requestOptions = {
        method: "POST",
        headers: myHeaders,
        body: raw,
        redirect: "follow"
    };

    return fetch(
            `https://api.pipedrive.com/v1/persons?api_token=${credentials.APIKey}`,
            requestOptions
        )
        .then((response) => response.json())
        .then((result) => {
            res = result;
            console.log(result);
            return res;
        })
        .catch((error) => console.log("error", error));
}

async function addParticipent(person_id, deal_id) {
    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    myHeaders.append("Accept", "application/json");
    var res;

    var raw = JSON.stringify({
        person_id: person_id
    });

    var requestOptions = {
        method: "POST",
        headers: myHeaders,
        body: raw,
        redirect: "follow"
    };

    return fetch(
            `https://api.pipedrive.com/v1/deals/${deal_id}/participants?api_token=${credentials.APIKey}`,
            requestOptions
        )
        .then((response) => response.json())
        .then((result) => {
            res = result;
            console.log(result);
            return res;
        })
        .catch((error) => console.log("error", error));
}

async function addActivity(
    deal_id,
    person_id,
    org_id,
    subject,
    public_description,
    note,
    type,
    done
) {
    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    myHeaders.append("Accept", "application/json");
    var res;

    var raw = JSON.stringify({
        due_date: new Date(Date.now()).toLocaleDateString(),
        due_time: "",
        duration: "",
        deal_id: deal_id,
        lead_id: "",
        person_id: person_id,
        project_id: "",
        org_id: org_id,
        location: "",
        public_description: public_description || "",
        note: note || "Auto initiated Activity",
        subject: subject,
        type: type || "call",
        user_id: "0",
        participants: [],
        busy_flag: "",
        attendees: [],
        done: done || "0"
    });

    var requestOptions = {
        method: "POST",
        headers: myHeaders,
        body: raw,
        redirect: "follow"
    };

    return fetch(
            `https://api.pipedrive.com/v1/activities?api_token=${credentials.APIKey}`,
            requestOptions
        )
        .then((response) => response.json())
        .then((result) => {
            res = result;
            console.log(result);
            return res;
        })
        .catch((error) => console.log("error", error));
}

const theSequenceFunctions = [getUser, addPerson, addParticipent, addActivity];

async function addPPAToDeal() {
    if (credentials.UserId === "")
        credentials.UserId = await theSequenceFunctions[0]();

    const retrnedPersonProps = await theSequenceFunctions[1](
        "Person Name",
        credentials.UserId,
        "1",
        "email@example.com",
        "1-222-222-2222"
    );
    const retrnedParticipentProps = await theSequenceFunctions[2](
        retrnedPersonProps.data.id,
        "1"
    );
    const retrnedActivityProps = await theSequenceFunctions[3](
        "1",
        retrnedParticipentProps.data.id,
        "1",
        "USSR_Call BM",
        "",
        "Auto Added Call another Time",
        "Call",
        false
    );
}

//
//
//
//
//
//
// Search Ext Code

const SearchZoominfoByNameCName = () => {
    const CC = document.querySelector(
        "body > div:nth-child(9) > div > div.cui5-panel.cui5-panel--radius-s.cui5-panel--no-border.cui5-panel--elevation-overlay.sc-lgholE.mVHXG > div > div > div > div > div.cui5-tabs__content > div > div > div > div.Header-my-app__sc-op1ite-0.feAaQo > div > div.cui5-spacing.cui5-spacing--top-m.cui5-spacing--right-m.cui5-spacing--bottom-m.cui5-spacing--left-m > div > div.cui5-spacing.TitleWrapper-my-app__sc-lfdo0w-2.kocSBK > div > h1.cui5-editable-text__box > textarea"
    );
    const bingSearchHref = `https://www.bing.com/search?pglt=675&q=${CC.value
    .replace(/Deal$/g, "")
    .replaceAll(" ", "+")}+Zoominfo`;
    const googleSearshHref = `https://www.bing.com/search?pglt=675&q=${CC.value
    .replace(/Deal$/g, "")
    .replaceAll(" ", "+")}+Zoominfo+inurl%3A"%2Fpic%2F"`;
    window.open(bingSearchHref, "_blank");

    return bingSearchHref;
};

const searchName = document.createElement("div");

searchName.id = "searchName";
document.body.append(searchName);
searchName.style.position = "fixed";
searchName.style.bottom = 0;
searchName.style.right = 0;
searchName.style.width = "80px";
searchName.style.height = "80px";
searchName.style.fontSize = "xx-small";
searchName.style.backgroundColor = "#f44238";
searchName.style.zIndex = 99999999999999999;
searchName.style.textAligen = "center";
searchName.style.display = "flex";
searchName.style.flexWrap = "wrap";
searchName.style.justifyContent = "center";
searchName.style.alignItems = "center";
searchName.style.padding = "3px";
searchName.style.color = "#fff";
searchName.innerText = "🔎 ZM By Name ";
searchName.onclick = SearchZoominfoByNameCName;