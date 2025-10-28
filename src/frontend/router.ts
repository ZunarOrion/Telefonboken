import { routes, type pathName } from "./routes";

async function renderContent(pathName: pathName) {
    const contentElement = document.getElementById("page-content");
    if (contentElement) {
        contentElement.innerHTML = routes[pathName].html();
        await routes[pathName].logic();
    };
};

function navigationTo(pathName: string) {
    if (pathName in routes) {
        renderContent(pathName as pathName);
    } else {
        renderContent("404");
    };
    history.pushState({ pathName: pathName }, "", pathName);
};

document.querySelectorAll<HTMLAnchorElement>("a[data-link]").forEach((link) => {
    link.addEventListener("click", () => {
        const url = new URL(link.href);
        navigationTo(url.pathname);
    });
});

window.addEventListener("popstate", (e) => {
    if (e.state && "pathname" in e.state) {
        if (e.state.pathname in routes) {
            renderContent(e.state.pathname);
        } else {
            renderContent("404");
        };
    };
});

const initialPath = window.location.pathname;
history.replaceState({ pathname: initialPath }, "", initialPath);
if (initialPath in routes) {
    renderContent(window.location.pathname as pathName);
} else {
    renderContent("404");
};
