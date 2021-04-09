import { Application } from "express";
import { expressLoader } from "./express";

export const initialization = ({ service }: { service: Application }): void => {
    expressLoader({ service });
};
