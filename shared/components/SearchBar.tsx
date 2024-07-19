import React from "react";
import { View } from "react-native";
import { useSelector } from "react-redux";
import { RootState } from "../../core/store/store";
import { Searchbar } from "react-native-paper";
import { theme } from "../theme";

type SearchBarComponentProps = {
  updateSearchFunction?: (search: any) => Promise<void>;
  search?: string;
};

const SearchBarComponent: React.FunctionComponent<SearchBarComponentProps> = ({
  updateSearchFunction,
  search,
}) => {
  // Redux states
  const user = useSelector((state: RootState) => state.user);

  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        width: 250,
      }}
    >
      <Searchbar
        placeholder="Search"
				iconColor={theme.colors.main[200]}
        placeholderTextColor={theme.colors.main[200]}
        onChangeText={updateSearchFunction}
        value={""}
        style={{
          backgroundColor: theme.colors.main[500],
          width: "100%",
        }}
      />
    </View>
  );
};

export default SearchBarComponent;
