import { FC } from "react";
import { TextStyle } from "react-native";
import { Text } from "react-native-paper";
import { createTheme } from "../theme";
import { useGlobalContext } from "../../core/context/Context";

type MyAppTextProps = {
  children: React.ReactNode;
  styleProps?: TextStyle;
  numberOfLines?: number;
};

const TextWithFont: FC<MyAppTextProps> = ({
  children,
  styleProps,
  numberOfLines,
}) => {
  // Global context
  const { appTheme } = useGlobalContext();
  const theme = createTheme(appTheme);

  return (
    <Text
      numberOfLines={numberOfLines}
      style={{
        fontFamily: theme.fontFamily,
        color: theme.colors.main[100],
        ...styleProps,
      }}
    >
      {children}
    </Text>
  );
};

export default TextWithFont;
