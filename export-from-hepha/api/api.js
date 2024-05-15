////APIS

//First API for input search
//This function is used to get the data from the API and display it in HTML. It takes an array of strings as input and returns a JSON object.
export async function query(data) {
    const response = await fetch(
        "https://copilot-flowise.onrender.com/api/v1/prediction/83ab39b8-dbf8-494f-8be7-8a4ed82f0c34",        {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(data)
        }
    );
    const result = await response.json();
    return result;
}




//second API only for the card Create Product Roadmap
export async function queryRoadmap (data) {
    const response = await fetch(
        "https://copilot-flowise.onrender.com/api/v1/prediction/ca7d4231-f0bf-4567-b7e4-2e4ef1de90d2",        {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(data)
        }
    );
    const result = await response.json();
    return result;
}

//third API only for the card Create Product Strategy

export async function queryStrategy(data) {
    const response = await fetch(
        "https://copilot-flowise.onrender.com/api/v1/prediction/cc3b5e27-8870-4fb1-878f-92020be0cc89",
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(data)
        }
    );
    const result = await response.json();
    return result;
}



