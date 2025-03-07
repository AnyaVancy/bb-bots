import { GameState } from "../../model";
import { generateBBVanillaScenes } from "./bigBrotherEpisode";
import { EpisodeType, Episode } from "./episodes";
import { SpotlightVeto } from "./veto/veto";

export const ForcedVetoEpisode: EpisodeType = {
    canPlayWith: (n: number) => n >= 4,
    eliminates: 1,
    arrowsEnabled: true,
    hasViewsbar: true,
    name: "🔦 Forced Veto",
    generate: generateForcedVeto,
};

function generateForcedVeto(initialGamestate: GameState): Episode {
    const episode = generateBBVanillaScenes(initialGamestate, SpotlightVeto);
    return new Episode({
        gameState: new GameState(episode.gameState),
        initialGamestate,
        title: episode.title,
        scenes: episode.scenes,
        type: ForcedVetoEpisode,
    });
}
