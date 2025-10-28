import type { Routes } from "./types";
import { LoginPage } from "./pages/login-page";
import { ContactsPage } from "./pages/contacts-page";
import { CommunicationsPage } from "./pages/communications-page";
import { PageNotFound } from "./pages/404";

export const routes = {
    "404": PageNotFound(),
    "/": ContactsPage(),
    "/message": CommunicationsPage(),
    "/login": LoginPage(),
} satisfies Routes;

export type pathName = keyof typeof routes;
