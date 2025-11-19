import { Tile, ScoringResult } from './types';

export function calculateOkey101Score(tiles: Tile[]): ScoringResult {
    const breakdown: string[] = [];
    let score = 0;

    // Okey 101'de her taş değeri kadar puan
    tiles.forEach(tile => {
        if (tile.isJoker) {
            score += 0; // Joker 0 puan
            breakdown.push(`Joker: 0 puan`);
        } else {
            score += tile.value;
            breakdown.push(`${tile.color} ${tile.value}: ${tile.value} puan`);
        }
    });

    // Düz ve grup bonusları (basitleştirilmiş)
    const groups = findGroups(tiles);
    const runs = findRuns(tiles);

    groups.forEach(group => {
        const bonus = group.length >= 3 ? 10 : 0;
        if (bonus > 0) {
            score += bonus;
            breakdown.push(`Grup bonusu: +${bonus} puan`);
        }
    });

    runs.forEach(run => {
        const bonus = run.length >= 3 ? 15 : 0;
        if (bonus > 0) {
            score += bonus;
            breakdown.push(`Düz bonusu: +${bonus} puan`);
        }
    });

    return {
        score,
        breakdown,
        totalTiles: tiles.length
    };
}

function findGroups(tiles: Tile[]): Tile[][] {
    const groups: Tile[][] = [];
    const valueMap: { [key: number]: Tile[] } = {};

    tiles.filter(t => !t.isJoker).forEach(tile => {
        if (!valueMap[tile.value]) {
            valueMap[tile.value] = [];
        }
        valueMap[tile.value].push(tile);
    });

    Object.values(valueMap).forEach(group => {
        if (group.length >= 3) {
            groups.push(group);
        }
    });

    return groups;
}

function findRuns(tiles: Tile[]): Tile[][] {
    const runs: Tile[][] = [];
    const colorGroups: { [color: string]: Tile[] } = {
        red: [],
        blue: [],
        black: [],
        yellow: []
    };

    tiles.filter(t => !t.isJoker).forEach(tile => {
        colorGroups[tile.color].push(tile);
    });

    Object.values(colorGroups).forEach(colorTiles => {
        const sorted = colorTiles.sort((a, b) => a.value - b.value);
        let currentRun: Tile[] = [];

        for (let i = 0; i < sorted.length; i++) {
            if (currentRun.length === 0 || sorted[i].value === currentRun[currentRun.length - 1].value + 1) {
                currentRun.push(sorted[i]);
            } else {
                if (currentRun.length >= 3) {
                    runs.push([...currentRun]);
                }
                currentRun = [sorted[i]];
            }
        }

        if (currentRun.length >= 3) {
            runs.push(currentRun);
        }
    });

    return runs;
}

// Mock hand generator for testing
export function generateMockHand(): Tile[] {
    const colors: ('red' | 'blue' | 'black' | 'yellow')[] = ['red', 'blue', 'black', 'yellow'];
    const hand: Tile[] = [];

    // Generate 14 tiles (typical Okey hand)
    for (let i = 0; i < 14; i++) {
        hand.push({
            color: colors[Math.floor(Math.random() * colors.length)],
            value: (Math.floor(Math.random() * 13) + 1) as any,
            isJoker: Math.random() < 0.1 // 10% chance of joker
        });
    }

    return hand;
}
