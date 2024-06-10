export enum FirstLetter {'A' = 'A', 'B' = 'B', 'C' = 'C', 'D' = 'D', 'E' = 'E', 'F' = 'F', 'G' = 'G', 'H' = 'H', 'I' = 'I', 'J' = 'J', 'K' = 'K', 'L' = 'L', 'M' = 'M', 'N' = 'N', 'O' = 'O', 'P' = 'P', 'Q' = 'Q', 'R' = 'R', 'S' = 'S', 'T' = 'T', 'U' = 'U', 'V' = 'V', 'W' = 'W', 'X' = 'X', 'Y' = 'Y', 'Z' = 'Z'}

type GameValue = {
    label: string;
    aliases?: string[]
}

export type Game =  {
    letter: string;
    values: {[key in FirstLetter]: GameValue[]};
    category: string;
    categoryPlural: string;
    categoryGender: "m" | "f",
}