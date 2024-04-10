import { Pressable, StyleSheet } from "react-native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { Ionicons } from "@expo/vector-icons";
import colors from "./constants/colors";
import MainScreen from "./screens/MainScreen.js";
import LiveMatchScreen from "./AdminComponents/LiveMatchScreen.js";
import MatchScreen from "./screens/TournamentScreen/MatchScreen.js";
import TournamentsOverviewScreen from "./screens/TournamentsOverviewScreen.tsx";
import TournamentScreen from "./screens/TournamentScreen/TournamentScreen.js";
import TeamsScreen from "./screens/TournamentScreen/TeamsScreen.js";
import TestScreen from "./screens/TestScreen.js";
import GamesScreen from "./screens/TournamentScreen/GamesScreen.js";
import TeamsHandler from "./AdminComponents/TeamsHandler.js";
import TeamDetailsScreen from "./screens/TournamentScreen/TeamDetailsScreen.js";
import StartGameScreen from "./AdminComponents/StartGameScreen.js";

const Stack = createStackNavigator();
const BottomTab = createBottomTabNavigator();

const screenOptions = {
  headerStyle: { backgroundColor: colors.tournamentHeader },
  headerTintColor: colors.tournamentHeaderText, // text color
  tabBarActiveTintColor: colors.tournamentHeader, // icon color
  backgroundColor: "black",
  // tabBarStyle: {
  //   backgroundColor: colors.backgroundColor, // color for down side of app screen
  // },
};

function MainStack(params) {
  return (
    <BottomTab.Navigator screenOptions={screenOptions}>
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
        }}
      />
      <BottomTab.Screen
        name="MatchScreen"
        component={MatchScreen}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="football-outline" size={size} color={color} />
          ),
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
    </BottomTab.Navigator>
  );
}

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={screenOptions}>
        <Stack.Screen
          name="MainScreen"
          component={MainStack}
          options={{ headerShown: false }}
        />
        <Stack.Screen name="TournamentScreen" component={TournamentScreen} />
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
          }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}