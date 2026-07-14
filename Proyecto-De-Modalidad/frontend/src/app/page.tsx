"use client";

import { AppProvider, useApp } from "@/context/AppContext";
import { LoginScreen } from "@/components/LoginScreen";
import { Dashboard } from "@/components/Dashboard";
import { SubjectView } from "@/components/SubjectView";
import { ModuleView } from "@/components/ModuleView";
import { AvatarCustomizer } from "@/components/AvatarCustomizer";
import { RankingView } from "@/components/RankingView";
import { ProfileView } from "@/components/ProfileView";
import { ParentDashboard } from "@/components/ParentDashboard";
import { TeacherDashboard } from "@/components/TeacherDashboard";
import { StudentProgressView } from "@/components/StudentProgressView";
import { ContentManager } from "@/components/ContentManager";
import { BancoDesafiosViewer } from "@/components/BancoDesafiosViewer";
import { ContenidoMINEDViewer } from "@/components/ContenidoMINEDViewer";
import { PulperiaFraccionesWrapper } from "@/components/PulperiaFraccionesWrapper";
import { CamionMultiplicacionesWrapper } from "@/components/CamionMultiplicacionesWrapper";
import { BusLetrasWrapper } from "@/components/BusLetrasWrapper";
import { CartaOrtografiaWrapper } from "@/components/CartaOrtografiaWrapper";
import { AtrapaAcentoWrapper } from "@/components/AtrapaAcentoWrapper";
import { AlimentaMonstruoWrapper } from "@/components/AlimentaMonstruoWrapper";
import { CazadorSilabasWrapper } from "@/components/CazadorSilabasWrapper";
import { Header } from "@/components/Header";
import { ToastContainer } from "@/components/Toasts";

function Router() {
  const { usuario, vista } = useApp();

  if (!usuario) {
    return <LoginScreen />;
  }

  let contenido: React.ReactNode = null;
  switch (vista) {
    case "dashboard":
      contenido = <Dashboard />;
      break;
    case "asignatura":
      contenido = <SubjectView />;
      break;
    case "modulo":
      contenido = <ModuleView />;
      break;
    case "avatar":
      contenido = <AvatarCustomizer />;
      break;
    case "ranking":
      contenido = <RankingView />;
      break;
    case "perfil":
      contenido = <ProfileView />;
      break;
    case "padre":
      contenido = <ParentDashboard />;
      break;
    case "maestro":
      contenido = <TeacherDashboard />;
      break;
    case "progreso-estudiante":
      contenido = <StudentProgressView />;
      break;
    case "contenido":
      contenido = <ContentManager />;
      break;
    case "banco-desafios":
      contenido = <BancoDesafiosViewer />;
      break;
    case "contenido-mined":
      contenido = <ContenidoMINEDViewer />;
      break;
    case "pulperia":
      contenido = <PulperiaFraccionesWrapper />;
      break;
    case "camion":
      contenido = <CamionMultiplicacionesWrapper />;
      break;
    case "bus":
      contenido = <BusLetrasWrapper />;
      break;
    case "carta":
      contenido = <CartaOrtografiaWrapper />;
      break;
    case "atrapa":
      contenido = <AtrapaAcentoWrapper />;
      break;
    case "monstruo":
      contenido = <AlimentaMonstruoWrapper />;
      break;
    case "silabas":
      contenido = <CazadorSilabasWrapper />;
      break;
    default:
      contenido = <Dashboard />;
  }

  return (
    <>
      <Header />
      <div className="animate-pop">{contenido}</div>
    </>
  );
}

export default function Page() {
  return (
    <AppProvider>
      <Router />
      <ToastContainer />
    </AppProvider>
  );
}
