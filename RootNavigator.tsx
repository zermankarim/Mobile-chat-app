import { FC } from "react";
import { useSelector } from "react-redux";
import { createDrawerNavigator } from "@react-navigation/drawer";
import { RootState } from "./core/store/store";
import DrawerContent from "./shared/components/Drawer";
import { theme } from "./shared/theme";
import Chats from "./static/Chats";
import Profile from "./static/Profile";
import Login from "./static/Login";
import SearchBarComponent from "./shared/components/SearchBar";
import { Ionicons } from "@expo/vector-icons";
import { View } from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";

const Drawer = createDrawerNavigator();

const RootNavigator: FC = () => {
  // Redux states and dispatch
  const user = useSelector((state: RootState) => state.user);
  return user.uid ? (
    <Drawer.Navigator
      initialRouteName="Chats"
      drawerContent={(props) => <DrawerContent {...props}></DrawerContent>}
      screenOptions={{
        headerStyle: {
          backgroundColor: theme.colors.main[300],
        },
        headerTintColor: theme.colors.main[100],
        headerTitleStyle: {
          fontFamily: theme.fontFamily,
        },
        headerShadowVisible: false,
        headerTitle: () => <SearchBarComponent></SearchBarComponent>,
      }}
    >
      <Drawer.Screen name="Chats" component={Chats} />
      <Drawer.Screen
        name="Profile"
        component={Profile}
        options={{
          headerTitle: undefined,
        }}
      />
    </Drawer.Navigator>
  ) : (
    <Drawer.Navigator
      initialRouteName="Login"
      screenOptions={{
        headerShown: false,
        headerStyle: {
          backgroundColor: theme.colors.main[400],
        },
        headerTintColor: theme.colors.main[100],
        headerTitleStyle: {
          fontFamily: theme.fontFamily,
        },
      }}
    >
      <Drawer.Screen name="Login" component={Login} />
    </Drawer.Navigator>
  );
};

export default RootNavigator;
