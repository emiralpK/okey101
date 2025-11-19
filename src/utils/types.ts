// Okey tile types
export type Color = 'red' | 'blue' | 'black' | 'yellow';
export type TileValue = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12 | 13;

export interface Tile {
    color: Color;
    value: TileValue;
    isJoker?: boolean;
}

export interface ScoringResult {
    score: number;
    breakdown: string[];
    totalTiles: number;
}
