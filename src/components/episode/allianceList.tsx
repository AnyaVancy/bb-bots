import React from "react";
import styled from "styled-components";
import { canDisplayCliques, GameState, getById } from "../../model";
import { ColorTheme } from "../../theme/theme";
import { isNotWellDefined } from "../../utils";
import { Centered } from "../layout/centered";
import { HasText } from "../layout/text";
import { Portraits } from "../playerPortrait/portraits";

export const HelpLink = styled.a`
    color: ${({ theme }: { theme: ColorTheme }) => theme.link};
    cursor: pointer;
    font-weight: bold;
    margin-top: 10px;
    margin-bottom: 10px;
`;

interface AllianceListProps {
    gameState: GameState;
}

export function AllianceList(props: AllianceListProps) {
    if (!canDisplayCliques(props.gameState))
        return (
            <HasText>
                <Centered>
                    ⚠️ There are too many players left in the game to display the alliances! Try again when
                    there are 30 or less! ⚠️
                </Centered>
            </HasText>
        );
    const cliques = props.gameState.cliques;
    const elements: JSX.Element[] = cliques.map((clique, i) => {
        if (isNotWellDefined(clique.affiliates)) {
            return (
                <Portraits
                    centered={true}
                    detailed={true}
                    key={`${clique}, ${i}, ${props.gameState.phase}`}
                    houseguests={clique.core.map((id) => getById(props.gameState, id))}
                />
            );
        }
        const entries: (number | "⬅️" | "➡️")[] = [
            ...clique.affiliates[0],
            "➡️",
            ...clique.core,
            "⬅️",
            ...clique.affiliates[1],
        ];
        return (
            <Portraits
                centered={true}
                detailed={true}
                key={`${clique}, ${i}, ${props.gameState.phase}`}
                houseguests={entries.map((id) => {
                    if (id === "⬅️") return "⬅️";
                    if (id === "➡️") return "➡️";
                    return getById(props.gameState, id);
                })}
            />
        );
    });
    return (
        <div>
            {elements}
            {props.gameState.phase < 3 && (
                <HelpLink
                    href="https://github.com/spaulmark/bb-bots/blob/master/README.md#understanding-alliances-or-what-do-the-arrows-mean"
                    target="_blank"
                    rel="noopener noreferrer"
                >
                    What do the arrows mean?
                </HelpLink>
            )}
        </div>
    );
}
