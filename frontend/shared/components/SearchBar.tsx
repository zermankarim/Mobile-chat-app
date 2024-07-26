import React, { useState } from "react";
import { Alert, View } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../core/store/store";
import { Searchbar } from "react-native-paper";
import { theme } from "../theme";
import { IChatPopulated } from "../types";
import { setChats } from "../../core/reducers/chats";
import { useGlobalContext } from "../../core/context/Context";

type SearchBarComponentProps = {
  searchType: string;
};

const SearchBarComponent: React.FunctionComponent<SearchBarComponentProps> = ({
  searchType,
}) => {
  // Redux states
  const user = useSelector((state: RootState) => state.user);
  const chats = useSelector((state: RootState) => state.chats);
  const dispatch = useDispatch();

  // Context states
  const { setChatsLoading } = useGlobalContext();

  // States
  const [search, setSearch] = useState<string>("");

  // Functions
  const updateSearchChats = async (text: string) => {
    setChatsLoading(true);
    try {
      setChatsLoading(false);
    } catch (error: any) {
      Alert.alert("Error during updating chats: ", error.message);
      console.error("Error during finding chats: ", error.message);
    }
  };

  const handleUpdateChats = async (text: string) => {
    setSearch(text);
    if (searchType === "Chats") {
      updateSearchChats(text);
    }
  };

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
        onChangeText={(text) => handleUpdateChats(text)}
        value={search}
        style={{
          backgroundColor: theme.colors.main[500],
          width: "100%",
        }}
      />
    </View>
  );
};

export default SearchBarComponent;
