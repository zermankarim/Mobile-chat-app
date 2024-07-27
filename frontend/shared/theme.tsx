import { MD2DarkTheme } from "react-native-paper";

export const theme = {
  ...MD2DarkTheme,
  myOwnProperty: true,
  colors: {
    ...MD2DarkTheme.colors,
    main: {
      100: "#EAF4FA",
      200: "#6C808C",
      300: "#212F3F",
      400: "#182330",
      500: "#0B1116",
    },
    blue: {
      100: "#114267",
      200: "#1e5986",
      300: "#2970a6",
      400: "#2c78b3",
      500: "#368CCC",
    },
  },
  spacing: (space: number) => space * 4,
  fontFamily: "cabin-regular",
  fontSize: (fSize: number) => fSize * 4,
  borderRadius: (bRadius: number) => bRadius * 4,
};
