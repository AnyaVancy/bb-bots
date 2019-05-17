import React from "react";
import { ProfileHouseguest } from "../memoryWall";
import { roundTwoDigits } from "../../utils";

function componentToHex(c: any) {
  var hex = Math.round(c).toString(16);
  return hex.length == 1 ? "0" + hex : hex;
}

const maxPopularity = { r: 137, g: 252, b: 137 };
const minPopularity = { r: 252, g: 137, b: 137 };

function rgbToHex(r: any, g: any, b: any) {
  return "#" + componentToHex(r) + componentToHex(g) + componentToHex(b);
}

export interface PortraitProps {
  evictedImageURL: string;
  imageURL: string;
  name: string;
  isEvicted?: boolean;
  isJury?: boolean;
  popularity?: number;
  subtitle?: string[];
  tags?: string[];
}

function backgroundColor(props: PortraitProps) {
  const percent = props.popularity ? (props.popularity + 1) / 2 : 0.5;

  return props.isEvicted
    ? undefined
    : rgbToHex(
        minPopularity.r + percent * (maxPopularity.r - minPopularity.r),
        minPopularity.g + percent * (maxPopularity.g - minPopularity.g),
        minPopularity.b + percent * (maxPopularity.b - minPopularity.b)
      );
}

export function houseguestToPortrait(
  houseguest: ProfileHouseguest,
  key?: any
): JSX.Element {
  let subtitle = [];
  if (houseguest.popularity && !houseguest.isEvicted) {
    subtitle.push(roundTwoDigits(houseguest.popularity) + "%");
  }
  subtitle.push(`${compWins()}`);
  console.log(houseguest.isJury);
  return (
    <HouseguestPortrait
      evictedImageURL={houseguest.evictedImageURL}
      imageURL={houseguest.imageURL}
      name={houseguest.name}
      isEvicted={houseguest.isEvicted}
      isJury={houseguest.isJury}
      key={key}
      popularity={houseguest.popularity}
      subtitle={subtitle}
    />
  );

  function compWins(): string {
    return `${houseguest.hohWins ? `♔ ${houseguest.hohWins}` : ""}${
      houseguest.povWins && houseguest.hohWins
        ? `|🛇 ${houseguest.povWins}`
        : houseguest.povWins
        ? `🛇 ${houseguest.povWins}`
        : ""
    }${
      (houseguest.hohWins || houseguest.povWins) && houseguest.nominations
        ? "|"
        : ""
    }${houseguest.nominations ? `✘ ${houseguest.nominations}` : ""}`;
  }
}

export const HouseguestPortrait = (props: PortraitProps) => {
  const evictedImageURL =
    props.evictedImageURL === "BW" ? props.imageURL : props.evictedImageURL;

  const imageSrc = props.isEvicted ? evictedImageURL : props.imageURL;

  let imageClass =
    props.isEvicted && props.evictedImageURL === "BW" ? "grayscale" : "";

  imageClass = props.isJury ? "sepia" : imageClass;

  const realSubtitle: any[] = [];
  let uniqueKey = -1;
  if (props.subtitle) {
    props.subtitle.forEach(text => {
      realSubtitle.push(text);
      realSubtitle.push(<br key={`break-${uniqueKey++}`} />);
    });
  }
  let className = "";
  if (props.isJury) {
    className = "jury";
  } else if (props.isEvicted) {
    className = "evicted";
  }
  return (
    <div
      style={{
        backgroundColor: backgroundColor(props)
      }}
      className={`memory-wall-portrait ${className}`}
    >
      <img
        className={imageClass}
        src={imageSrc}
        style={{ width: 100, height: 100 }}
      />
      <br />
      {props.name}
      <br />
      {!!props.subtitle && (
        <small className="portrait-history">{realSubtitle}</small>
      )}
    </div>
  );
};
