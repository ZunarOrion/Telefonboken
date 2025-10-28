export type RouteEntry = {
    html: () => string;
    
    logic: async () => void;
};

export type Routes = Record<string, RouteEntry>;
