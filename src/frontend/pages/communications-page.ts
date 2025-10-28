import type { RouteEntry } from "../types";

export function CommunicationsPage(): RouteEntry {
    return {
        html: () => `
        <div>
            <button type="button" id="call-btn">Ring: ${""}</button>
            <li id="chosen-contacts"></li>
            <button type="button" id="add-recipiant-btn">Lägg till motagare</button>
        </div>
        <div>
            <input type="text" id="sms-input" placeholder="Skriv ett meddelande här"></input>
            <button type="button" id="send-sms-button">Skicka</button
        </div>
        `,
        logic: async () => {

        }
    };
};
