import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { ActivityIndicator, Text, View } from 'react-native';
import { useAuth } from '../context/AuthContext';
import { useLicense } from '../context/LicenseContext';
import { colors } from '../lib/theme';
import { LoginScreen } from '../screens/LoginScreen';
import { RegisterScreen } from '../screens/RegisterScreen';
import { PaywallScreen } from '../screens/PaywallScreen';
import { LocalSetupScreen } from '../screens/LocalSetupScreen';
import { HomeScreen } from '../screens/HomeScreen';
import { BillsScreen } from '../screens/BillsScreen';
import { NewBillScreen } from '../screens/NewBillScreen';
import { ProductsScreen } from '../screens/ProductsScreen';
import { MoreScreen } from '../screens/MoreScreen';
import { CustomersScreen } from '../screens/CustomersScreen';
import { QuotesScreen } from '../screens/QuotesScreen';
import { LedgerScreen } from '../screens/LedgerScreen';
import { StockScreen } from '../screens/StockScreen';
import { ExpensesScreen } from '../screens/ExpensesScreen';
import { ReportsScreen } from '../screens/ReportsScreen';
import { TeamScreen } from '../screens/TeamScreen';
import { ActivityScreen } from '../screens/ActivityScreen';
import { SettingsScreen } from '../screens/SettingsScreen';
import { HelpScreen } from '../screens/HelpScreen';
import { BillDetailScreen } from '../screens/BillDetailScreen';
import {
  AppStackParamList,
  AuthStackParamList,
  MoreStackParamList,
  RootTabParamList,
} from './types';

const AuthStack = createNativeStackNavigator<AuthStackParamList>();
const AppStack = createNativeStackNavigator<AppStackParamList>();
const Tab = createBottomTabNavigator<RootTabParamList>();
const MoreStack = createNativeStackNavigator<MoreStackParamList>();

function TabLabel({
  label,
  focused,
}: {
  label: string;
  focused: boolean;
}) {
  return (
    <Text
      style={{
        fontSize: 11,
        fontWeight: focused ? '700' : '500',
        color: focused ? colors.forest : colors.muted,
        marginBottom: 4,
      }}
    >
      {label}
    </Text>
  );
}

function MoreNavigator() {
  return (
    <MoreStack.Navigator screenOptions={{ headerShown: false }}>
      <MoreStack.Screen name="MoreHome" component={MoreScreen} />
      <MoreStack.Screen name="Customers" component={CustomersScreen} />
      <MoreStack.Screen name="Quotes" component={QuotesScreen} />
      <MoreStack.Screen name="Ledger" component={LedgerScreen} />
      <MoreStack.Screen name="Stock" component={StockScreen} />
      <MoreStack.Screen name="Expenses" component={ExpensesScreen} />
      <MoreStack.Screen name="Reports" component={ReportsScreen} />
      <MoreStack.Screen name="Team" component={TeamScreen} />
      <MoreStack.Screen name="Activity" component={ActivityScreen} />
      <MoreStack.Screen name="Settings" component={SettingsScreen} />
      <MoreStack.Screen name="Help" component={HelpScreen} />
    </MoreStack.Navigator>
  );
}

function AppTabs() {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: colors.paper,
          borderTopColor: colors.line,
          height: 64,
          paddingTop: 6,
        },
        tabBarActiveTintColor: colors.forest,
        tabBarInactiveTintColor: colors.muted,
      }}
    >
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{
          tabBarLabel: ({ focused }) => (
            <TabLabel label="Home" focused={focused} />
          ),
          tabBarIcon: () => null,
        }}
      />
      <Tab.Screen
        name="Bills"
        component={BillsScreen}
        options={{
          tabBarLabel: ({ focused }) => (
            <TabLabel label="Bills" focused={focused} />
          ),
          tabBarIcon: () => null,
        }}
      />
      <Tab.Screen
        name="NewBill"
        component={NewBillScreen}
        options={{
          tabBarLabel: ({ focused }) => (
            <TabLabel label="New bill" focused={focused} />
          ),
          tabBarIcon: () => null,
        }}
      />
      <Tab.Screen
        name="Products"
        component={ProductsScreen}
        options={{
          tabBarLabel: ({ focused }) => (
            <TabLabel label="Items" focused={focused} />
          ),
          tabBarIcon: () => null,
        }}
      />
      <Tab.Screen
        name="More"
        component={MoreNavigator}
        options={{
          tabBarLabel: ({ focused }) => (
            <TabLabel label="More" focused={focused} />
          ),
          tabBarIcon: () => null,
        }}
      />
    </Tab.Navigator>
  );
}

function AppNavigator() {
  return (
    <AppStack.Navigator screenOptions={{ headerShown: false }}>
      <AppStack.Screen name="Tabs" component={AppTabs} />
      <AppStack.Screen name="BillDetail" component={BillDetailScreen} />
    </AppStack.Navigator>
  );
}

function AuthNavigator({
  initial,
}: {
  initial: keyof AuthStackParamList;
}) {
  return (
    <AuthStack.Navigator
      initialRouteName={initial}
      screenOptions={{ headerShown: false }}
    >
      <AuthStack.Screen name="Paywall" component={PaywallScreen} />
      <AuthStack.Screen name="Login" component={LoginScreen} />
      <AuthStack.Screen name="Register" component={RegisterScreen} />
      <AuthStack.Screen name="LocalSetup" component={LocalSetupScreen} />
    </AuthStack.Navigator>
  );
}

export function RootNavigator() {
  const { ready, token } = useAuth();
  const license = useLicense();

  if (!ready || !license.ready) {
    return (
      <View
        style={{
          flex: 1,
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: colors.bg,
        }}
      >
        <ActivityIndicator color={colors.forest} size="large" />
      </View>
    );
  }

  // Hard lock: expired trial / unpaid online cannot open shop screens.
  const paidOrTrialOk = license.active || license.cloudDisabled;
  const inApp = Boolean(token) && paidOrTrialOk;
  const needLocalSetup = license.cloudDisabled && !token;
  const needLogin = license.active && !token && !license.cloudDisabled;
  const forcePaywall =
    !paidOrTrialOk &&
    (license.trialExpired ||
      !!license.license.trialUsed ||
      license.license.kind === 'trial' ||
      license.license.kind === 'online' ||
      Boolean(token));

  return (
    <NavigationContainer>
      {inApp ? (
        <AppNavigator />
      ) : (
        <AuthNavigator
          initial={
            needLocalSetup
              ? 'LocalSetup'
              : forcePaywall
                ? 'Paywall'
                : needLogin
                  ? 'Login'
                  : 'Paywall'
          }
        />
      )}
    </NavigationContainer>
  );
}
