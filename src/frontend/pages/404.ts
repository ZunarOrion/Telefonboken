import type { RouteEntry } from "../types";

export function PageNotFound(): RouteEntry {
    return {
        html: () => `
        <div>
            <p type="text" id="not-found-message">Appologize the page could not be found.</p>
        </div>
        `,
        logic: async () => {

        }
    };
};
