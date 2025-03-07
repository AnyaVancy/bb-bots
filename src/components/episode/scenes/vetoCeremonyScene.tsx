import { GameState, Houseguest, getById, exclude } from "../../../model";
import { Scene } from "./scene";
import { backdoorNPlayers } from "../../../utils/ai/aiApi";
import { Portrait } from "../../playerPortrait/portraits";
import { NextEpisodeButton } from "../../nextEpisodeButton/nextEpisodeButton";
import React from "react";
import { Centered, CenteredBold } from "../../layout/centered";
import { DividerBox } from "../../layout/box";
import { listNames } from "../../../utils/listStrings";
import _ from "lodash";
import { DiamondVeto, Veto } from "../veto/veto";

export function generateVetoCeremonyScene(
    initialGameState: GameState,
    HoH: Houseguest,
    initialNominees: Houseguest[],
    povWinner: Houseguest,
    doubleEviction: boolean,
    veto: Veto
): [GameState, Scene, Houseguest[]] {
    let povTarget: Houseguest | null = null;
    let descisionText = "";

    initialNominees = initialNominees.map((nominee) => {
        return getById(initialGameState, nominee.id);
    });
    HoH = getById(initialGameState, HoH.id);

    const vetoChoice = veto.use(povWinner, initialNominees, initialGameState, HoH.id);

    let nomineeWonPov = false;
    initialNominees.forEach((nom) => nom.id === povWinner.id && (nomineeWonPov = true));

    povTarget = vetoChoice.decision;
    if (!povTarget) {
        descisionText += "... not to use the power of veto.";
    } else if (nomineeWonPov) {
        descisionText += "...to use the power of veto on myself.";
    } else {
        descisionText += `...to use the power of veto on ${povTarget.name}.`;
    }
    let replacementSpeech = "";
    let nameAReplacement = "";
    let finalNominees: any[] = [...initialNominees];
    const replacementNomineeNamer = veto === DiamondVeto ? povWinner : HoH;
    if (povTarget) {
        const HoHwonPoV = HoH.id === povWinner.id;
        nameAReplacement += HoHwonPoV
            ? `Since I have just vetoed one of my nominations, I must name a replacement nominee.`
            : `${HoH.name}, since I have just vetoed one of your nominations, ${
                  veto === DiamondVeto ? "I" : "you"
              } must name a replacement nominee.`;
        // if the exclusion yielded no options, you may be forced to name the veto winner as a replacement
        let exclusion = exclude(initialGameState.houseguests, [HoH, ...initialNominees, povWinner]);
        if (exclusion.length === 0) {
            exclusion = exclude(initialGameState.houseguests, [HoH, ...initialNominees]);
        }
        const replacementNom = {
            ...getById(
                initialGameState,
                backdoorNPlayers(replacementNomineeNamer, exclusion, initialGameState, 1)[0].decision
            ),
        };
        const replacementIndex = initialNominees.findIndex((hg) => hg.id === vetoChoice.decision!.id);
        finalNominees[replacementIndex] = replacementNom;
        replacementNom.nominations++;
        getById(initialGameState, replacementNom.id).nominations++;
        replacementSpeech = `My replacement nominee is ${replacementNom.name}.`;
    }
    const nomineeNames = initialNominees.map((nom) => nom.name);
    const scene = new Scene({
        title: "Veto Ceremony",
        gameState: initialGameState,
        content: (
            <div>
                {!doubleEviction && <Centered>This is the Veto Ceremony.</Centered>}
                {!doubleEviction && (
                    <Centered>
                        {`${listNames(nomineeNames)} have been nominated for eviction, 
                    but I have the power to veto one of these nominations.`}
                    </Centered>
                )}
                <div className="columns is-marginless is-centered">
                    {initialNominees.map((nom, i) => (
                        <DividerBox className="column" key={`nominee-${i}`}>
                            <Portrait centered={true} houseguest={nom} />
                        </DividerBox>
                    ))}
                </div>
                <CenteredBold>
                    I have decided... <br />
                </CenteredBold>
                <Portrait centered={true} houseguest={{ ...povWinner, tooltip: vetoChoice.reason }} />
                <CenteredBold noMargin={true}>{descisionText}</CenteredBold>
                <Centered>{nameAReplacement}</Centered>
                {replacementSpeech && <Portrait centered={true} houseguest={replacementNomineeNamer} />}
                <CenteredBold>{replacementSpeech}</CenteredBold>
                <div className="columns is-marginless is-centered">
                    {finalNominees.map((nom, i) => (
                        <DividerBox className="column" key={`final-nominee-${i}`}>
                            <Portrait centered={true} houseguest={nom} />
                        </DividerBox>
                    ))}
                </div>
                {!doubleEviction && <NextEpisodeButton />}
            </div>
        ),
    });
    initialGameState.currentLog.nominationsPostVeto = require("alphanum-sort")(
        finalNominees.map((nom) => nom.name)
    );
    return [initialGameState, scene, finalNominees];
}
