import { FC } from "react";
import { TextStyle } from "react-native";
import { Text } from "react-native-paper";

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
  return (
    <Text
      numberOfLines={numberOfLines}
      style={{
        fontFamily: "cabin-regular",
        ...styleProps,
      }}
    >
      {children}
    </Text>
  );
};

export default TextWithFont;
