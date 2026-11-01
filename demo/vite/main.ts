const button = document.querySelector<HTMLButtonElement>("#request");
const result = document.querySelector<HTMLElement>("#result");

if (!button || !result) {
    throw new Error("The Vite demo controls are missing");
}

let callNumber = 0;

button.addEventListener("click", async () => {
    button.disabled = true;
    result.textContent = "Loading…";

    try {
        const response = await fetch("/api/users/123");
        const body: unknown = await response.json();

        callNumber += 1;
        result.textContent = JSON.stringify({
            call: callNumber,
            status: response.status,
            body,
        }, null, 4);
    } catch (error) {
        result.textContent = error instanceof Error
            ? error.message
            : "Request failed";
    } finally {
        button.disabled = false;
    }
});
