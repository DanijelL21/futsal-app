import { Dimensions } from "react-native";

const originalScreenWidth = Dimensions.get("window").width;
const originalScreenHeight = Dimensions.get("window").height;

const screenWidth =
  originalScreenWidth < 600 ? originalScreenWidth : originalScreenWidth * 0.75;
const screenHeight =
  originalScreenHeight < 600
    ? originalScreenHeight
    : originalScreenHeight * 0.8;

function fontSize(fontSizePercentage) {
  return screenWidth * fontSizePercentage;
}

export default {
  screenWidth,
  screenHeight,
  fontSize,
};
