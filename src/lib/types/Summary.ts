import type { FirstLetter } from "./Game";

export type Summary = {
    date: string;
    found: {[key in FirstLetter]: string};
    total: number;
    duration: number;
}