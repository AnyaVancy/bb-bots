import { ProfileHouseguest } from "../memoryWall";
import React from "react";
import {
  houseguestToPortrait,
  memoryWallPortrait
} from "./houseguestToPortrait";

export function Portrait(props: {
  houseguest: ProfileHouseguest;
  centered?: boolean;
}): JSX.Element {
  return (
    <div
      className={`columns is-gapless is-mobile is-multiline ${props.centered &&
        "is-centered"}`}
    >
      {houseguestToPortrait(props.houseguest)}
    </div>
  );
}

export function Portraits(props: {
  houseguests: ProfileHouseguest[];
  centered?: boolean;
  detailed?: boolean;
}): JSX.Element {
  let key = 0;
  const rows: JSX.Element[] = [];
  if (!props.houseguests || props.houseguests.length === 0) {
    return <div />;
  }
  props.houseguests.forEach((houseguest: ProfileHouseguest) => {
    if (props.detailed) {
      rows.push(memoryWallPortrait(houseguest, key++));
    } else {
      rows.push(houseguestToPortrait(houseguest, key++));
    }
  });

  return (
    <div
      className={`columns is-gapless is-mobile is-multiline ${props.centered &&
        "is-centered"}`}
    >
      {rows}
    </div>
  );
}
