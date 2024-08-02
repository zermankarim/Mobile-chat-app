import { MD2DarkTheme } from "react-native-paper";
import { ThemeColors, ThemeType } from "./types";

const themeColors: Record<ThemeType, ThemeColors> = {
  default: {
    main: {
      100: "#EAF4FA",
      200: "#6C808C",
      300: "#212F3F",
      400: "#182330",
      500: "#0B1116",
    },
    contrast: {
      100: "#114267",
      200: "#1e5986",
      300: "#2970a6",
      400: "#2c78b3",
      500: "#368CCC",
    },
  },
  green: {
    main: {
      100: "#E6F9E6",
      200: "#a8c8a8",
      300: "#5c885c",
      400: "#3f613f",
      500: "#144f14",
    },
    contrast: {
      100: "#267326",
      200: "#338033",
      300: "#4CAF50",
      400: "#66BB6A",
      500: "#81C784",
    },
  },
  purple: {
    main: {
      100: "#F3E5F5",
      200: "#E1BEE7",
      300: "#CE93D8",
      400: "#BA68C8",
      500: "#AB47BC",
    },
    contrast: {
      100: "#8E24AA",
      200: "#7B1FA2",
      300: "#6A1B9A",
      400: "#4A148C",
      500: "#38006B",
    },
  },
  yellow: {
    main: {
      100: "#FFFDE7",
      200: "#FFF9C4",
      300: "#FFF59D",
      400: "#FFF176",
      500: "#FFEB3B",
    },
    contrast: {
      100: "#FBC02D",
      200: "#F9A825",
      300: "#F57F17",
      400: "#FDD835",
      500: "#FFEB3B",
    },
  },
  light: {
    main: {
      100: "#F5F5F5",
      200: "#E0E0E0",
      300: "#C0C0C0",
      400: "#9E9E9E",
      500: "#616161",
    },
    contrast: {
      100: "#B0BEC5",
      200: "#90A4AE",
      300: "#78909C",
      400: "#607D8B",
      500: "#546E7A",
    },
  },
  darkBlue: {
    main: {
      100: "#E0F7FA",
      200: "#B2EBF2",
      300: "#80DEEA",
      400: "#4DD0E1",
      500: "#26C6DA",
    },
    contrast: {
      100: "#004D40",
      200: "#003D34",
      300: "#00251A",
      400: "#00151A",
      500: "#001B1F",
    },
  },
  black: {
    main: {
      100: "#E0E0E0",
      200: "#B3B3B3",
      300: "#808080",
      400: "#4D4D4D",
      500: "#1A1A1A",
    },
    contrast: {
      100: "#333333",
      200: "#4D4D4D",
      300: "#666666",
      400: "#808080",
      500: "#999999",
    },
  },
};

export const createTheme = (themeTitle: ThemeType) => {
  const selectedTheme = themeColors[themeTitle] || themeColors.default;
  return {
    ...MD2DarkTheme,
    myOwnProperty: true,
    colors: {
      ...MD2DarkTheme.colors,
      main: selectedTheme.main,
      contrast: selectedTheme.contrast,
    },
    spacing: (space: number) => space * 4,
    fontFamily: "cabin-regular",
    fontSize: (fSize: number) => fSize * 4,
    borderRadius: (bRadius: number) => bRadius * 4,
  };
};
