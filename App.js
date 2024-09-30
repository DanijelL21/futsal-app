// External Libraries
import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createStackNavigator } from "@react-navigation/stack";
import { Ionicons } from "@expo/vector-icons";
import { StatusBar } from "expo-status-bar";

// Internal Modules
import colors from "./constants/colors";
import dimensions from "./constants/dimensions";
import AuthContextProvider from "./store/auth-context";
import BasicContextProvider from "./store/basic-context";

// Screens
import MainScreen from "./screens/NewsScreen.js";
import MatchScreen from "./screens/CompetitionScreen/MatchScreen.js";
import CompetitionOverviewScreen from "./screens/CompetitionOverviewScreen.tsx";
import MainCompetitionScreen from "./screens/CompetitionScreen/MainCompetitionScreen.js";
import StatisticsScreen from "./screens/CompetitionScreen/StatisticsScreen";
import TableScreen from "./screens/CompetitionScreen/TableScreen";
import TeamsScreen from "./screens/CompetitionScreen/TeamsScreen.js";
import LeaguesScreen from "./screens/LeaguesScreen.js";
import GamesScreen from "./screens/CompetitionScreen/GamesScreen.js";
import TeamDetailsScreen from "./screens/CompetitionScreen/TeamDetailsScreen.js";
import SplashScreen from "./screens/SplashScreen";
// Admin Screens
import GamesHandler from "./adminScreens/GamesHandler";
import LiveMatchScreen from "./adminScreens/LiveMatchScreen.js";
import TeamsHandler from "./adminScreens/TeamsHandler.js";
import StartGameScreen from "./adminScreens/StartGameScreen.js";

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
        component={CompetitionOverviewScreen}
        options={{
          title: "Tournaments",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="football-outline" size={size} color={color} />
          ),
          headerShown: false,
        }}
        initialParams={{ mode: "tournaments" }}
      />
      <BottomTab.Screen
        name="LeaguesScreen"
        component={CompetitionOverviewScreen}
        options={{
          title: "Leagues",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="calendar-clear-outline" size={size} color={color} />
          ),
          headerShown: false,
        }}
        initialParams={{ mode: "leagues" }}
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
              name="Splash"
              component={SplashScreen}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="MainScreen"
              component={MainStack}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="CompetitionScreen"
              component={MainCompetitionScreen}
            />
            <Stack.Screen name="Teams" component={TeamsScreen} />
            <Stack.Screen name="Tables" component={TableScreen} />
            <Stack.Screen name="TeamDetails" component={TeamDetailsScreen} />
            <Stack.Screen name="Statistics" component={StatisticsScreen} />
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
              name="HandleGames"
              component={GamesHandler}
              options={{
                presentation: "modal",
                title: "Add Game",
                headerLeft: null,
                tabBarVisible: false,
              }}
            />
            <Stack.Screen
              name="MatchScreen"
              component={MatchScreen}
              options={{ title: "Match" }}
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
                title: "Live",
              }}
            />
          </Stack.Navigator>
        </NavigationContainer>
      </BasicContextProvider>
    </AuthContextProvider>
  );
}
