import { createStore } from 'redux';
import { StackNavigator } from 'react-navigation';
import firebase from 'react-native-firebase';
import AboutScreen from './components/screens/AboutScreen';
import DeveloperScreen from './components/screens/DeveloperScreen';
import EulaScreen from './components/screens/EulaScreen';
import FeedbackScreen from './components/screens/FeedbackScreen';
import FishScreen from './components/screens/FishScreen';
import HomeScreen from './components/screens/HomeScreen';
import IdentifyFishScreen from './components/screens/IdentifyFishScreen';
import ListScreen from './components/screens/ListScreen';
import ResultsScreen from './components/screens/ResultsScreen';
import reduxApp from './lib/reducers';
import { setupAnalytics } from './lib/analytics';

const App = StackNavigator(
  {
    Eula: { screen: EulaScreen },
    Home: { screen: HomeScreen },
    IdentifyFish: { screen: IdentifyFishScreen },
    Feedback: { screen: FeedbackScreen },
    About: { screen: AboutScreen },
    Developer: { screen: DeveloperScreen },
    List: { screen: ListScreen },
    Results: { screen: ResultsScreen },
    Fish: { screen: FishScreen },
  },
  {
    onTransitionStart: (obj1, obj2) => {
      const routes = obj1.navigation.state.routes;
      const screenName = routes[routes.length - 1].routeName;
      console.log("StackNavigator: " + screenName);
      firebase.analytics().setCurrentScreen(screenName);
    } 
  }
);

// Set the screen to the first screen to load up
firebase.analytics().setCurrentScreen("Eula");

const store = createStore(reduxApp);
setupAnalytics(store);

export default App;