import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { AuthProvider } from './src/context/AuthContext';
import { LicenseProvider } from './src/context/LicenseContext';
import { OfflineProvider } from './src/context/OfflineContext';
import { RootNavigator } from './src/navigation/RootNavigator';
import { colors } from './src/lib/theme';

export default function App() {
  return (
    <SafeAreaProvider>
      <LicenseProvider>
        <AuthProvider>
          <OfflineProvider>
            <SafeAreaView style={{ flex: 1, backgroundColor: colors.bg }}>
              <StatusBar style="dark" />
              <RootNavigator />
            </SafeAreaView>
          </OfflineProvider>
        </AuthProvider>
      </LicenseProvider>
    </SafeAreaProvider>
  );
}
