export type RootTabParamList = {
  Inicio: undefined;
  Rutas: undefined;
  Alertas: undefined;
  Perfil: undefined;
};

export type AuthStackParamList = {
  Login: undefined;
};

export type RootStackParamList = {
  MainTabs: undefined;
  Login: undefined;
  BusDetails: { busId: string };
};
