export type AuthStackParamList = {
  Paywall: undefined;
  Login: undefined;
  Register: undefined;
  LocalSetup: undefined;
};

export type RootTabParamList = {
  Home: undefined;
  Bills: undefined;
  NewBill: undefined;
  Products: undefined;
  More: undefined;
};

export type AppStackParamList = {
  Tabs: undefined;
  BillDetail: { id: string };
};

export type MoreStackParamList = {
  MoreHome: undefined;
  Customers: undefined;
  Quotes: undefined;
  Ledger: undefined;
  Stock: undefined;
  Expenses: undefined;
  Reports: undefined;
  Team: undefined;
  Activity: undefined;
  Settings: undefined;
  Help: undefined;
};
