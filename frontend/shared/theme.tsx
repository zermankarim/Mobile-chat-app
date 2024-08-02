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
      400: "#8c4a98",
      500: "#774080",
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
      100: "#1b1b1b",
      200: "#343b3e",
      300: "#c8dee9",
      400: "#cfe4ee",
      500: "#e1f3fb",
    },
    contrast: {
      100: "#96cbe7",
      200: "#75b8d4",
      300: "#5e8eab",
      400: "#517a8f",
      500: "#5b7eac",
    },
  },
  darkBlue: {
    main: {
      100: "#E0F7FA",
      200: "#777ba1",
      300: "#3d508e",
      400: "#2e397d",
      500: "#232b5f",
    },
    contrast: {
      100: "#2f3b6f",
      200: "#3f5bd5",
      300: "#7c80e4",
      400: "#7472d3",
      500: "#8692df",
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
