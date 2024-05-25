import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { Ionicons } from "@expo/vector-icons";
import colors from "./constants/colors";
import DevScreen from "./screens/DevScreen.js";
import MainScreen from "./screens/NewsScreen.js";
import MatchScreen from "./screens/TournamentScreen/MatchScreen.js";
import TournamentsOverviewScreen from "./screens/TournamentsOverviewScreen.tsx";
import MainTournamentScreen from "./screens/TournamentScreen/MainTournamentScreen.js";
import TeamsScreen from "./screens/TournamentScreen/TeamsScreen.js";
import TestScreen from "./screens/TestScreen.js";
import GamesScreen from "./screens/TournamentScreen/GamesScreen.js";
import TeamDetailsScreen from "./screens/TournamentScreen/TeamDetailsScreen.js";
import LiveMatchScreen from "./adminScreens/LiveMatchScreen.js";
import TeamsHandler from "./adminScreens/TeamsHandler.js";
import StartGameScreen from "./adminScreens/StartGameScreen.js";
import { StatusBar } from "expo-status-bar";
import dimensions from "./constants/dimensions";
import AuthContextProvider from "./store/auth-context";
import BasicContextProvider from "./store/basic-context";
const Stack = createStackNavigator();
const BottomTab = createBottomTabNavigator();

const stackNavigatorOptions = {
  headerStyle: {
    backgroundColor: colors.headerColor,
    borderBottomWidth: 0,
    shadowColor: "transparent",
  },
  headerTintColor: colors.headerTextColor,
  headerTitleStyle: {
    fontSize: dimensions.fontSize(0.05),
    fontWeight: "bold",
  },
  tabBarStyle: { backgroundColor: colors.bottomTabColor, borderTopWidth: 0 },
  tabBarActiveTintColor: colors.bottomTabIconColor,
  headerBackTitle: " ",
};

function MainStack() {
  return (
    <BottomTab.Navigator screenOptions={stackNavigatorOptions}>
      <BottomTab.Screen
        name="News"
        component={MainScreen}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="newspaper-outline" size={size} color={color} />
          ),
        }}
      />
      <BottomTab.Screen
        name="TournamentsOverviewScreen"
        component={TournamentsOverviewScreen}
        options={{
          title: "Tournaments",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="football-outline" size={size} color={color} />
          ),
          headerShown: false,
        }}
      />
      <BottomTab.Screen
        name="TestScreen"
        component={TestScreen}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="football-outline" size={size} color={color} />
          ),
        }}
      />
      <BottomTab.Screen
        name="DevScreen"
        component={DevScreen}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="football-outline" size={size} color={color} />
          ),
        }}
      />
    </BottomTab.Navigator>
  );
}

function GameStack() {
  return (
    <BottomTab.Navigator screenOptions={stackNavigatorOptions}>
      <BottomTab.Screen
        name="MatchScreen"
        component={MatchScreen}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="newspaper-outline" size={size} color={color} />
          ),
        }}
      />
    </BottomTab.Navigator>
  );
}

export default function App() {
  return (
    <AuthContextProvider>
      <BasicContextProvider>
        <NavigationContainer>
          <StatusBar style="light" />
          <Stack.Navigator screenOptions={stackNavigatorOptions}>
            <Stack.Screen
              name="MainScreen"
              component={MainStack}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="TournamentScreen"
              component={MainTournamentScreen}
            />
            <Stack.Screen name="Teams" component={TeamsScreen} />
            <Stack.Screen name="TeamDetails" component={TeamDetailsScreen} />
            <Stack.Screen
              name="HandleTeams"
              component={TeamsHandler}
              options={{
                presentation: "modal",
                title: "Add Team",
                headerLeft: null,
                tabBarVisible: false,
              }}
            />
            <Stack.Screen name="Games" component={GamesScreen} />
            <Stack.Screen
              name="GameStack"
              component={GameStack}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="StartGame"
              component={StartGameScreen}
              options={{ title: "Start Game" }}
            />
            <Stack.Screen
              name="LiveMatchScreen"
              component={LiveMatchScreen}
              options={{
                tabBarIcon: ({ color, size }) => (
                  <Ionicons name="hammer-outline" size={size} color={color} />
                ),
                headerLeft: null,
              }}
            />
          </Stack.Navigator>
        </NavigationContainer>
      </BasicContextProvider>
    </AuthContextProvider>
  );
}
