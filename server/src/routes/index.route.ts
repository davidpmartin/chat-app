import Express from "express";
import authRoutes from "./auth.route";
import dataRoutes from "./data.route";

// Exportable function to apply routes to the express app
export function applyRoutes(app: Express.Application) {
    const apiPrefix = "/api"
    app.use(apiPrefix, authRoutes);
    app.use(apiPrefix, dataRoutes);
}