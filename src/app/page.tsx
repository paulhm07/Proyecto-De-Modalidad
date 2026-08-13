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
import { ParentCalificaciones } from "@/components/ParentCalificaciones";
import { ParentAsistencia } from "@/components/ParentAsistencia";
import { ParentAvisos } from "@/components/ParentAvisos";
import { ParentMensajes } from "@/components/ParentMensajes";
import { ParentMensajeThread } from "@/components/ParentMensajeThread";
import { ParentNotificaciones } from "@/components/ParentNotificaciones";
import { ParentVincularHijo } from "@/components/ParentVincularHijo";
import { TeacherDashboard } from "@/components/TeacherDashboard";
import { TeacherSecciones } from "@/components/TeacherSecciones";
import { TeacherEstudiantes } from "@/components/TeacherEstudiantes";
import { TeacherCrearTarea } from "@/components/TeacherCrearTarea";
import { TeacherTareas } from "@/components/TeacherTareas";
import { TeacherTareaDetalle } from "@/components/TeacherTareaDetalle";
import { TeacherAsistencia } from "@/components/TeacherAsistencia";
import { TeacherReportes } from "@/components/TeacherReportes";
import { TeacherReporteEstudiante } from "@/components/TeacherReporteEstudiante";
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
    case "padre-calificaciones":
      contenido = <ParentCalificaciones />;
      break;
    case "padre-asistencia":
      contenido = <ParentAsistencia />;
      break;
    case "padre-avisos":
      contenido = <ParentAvisos />;
      break;
    case "padre-mensajes":
      contenido = <ParentMensajes />;
      break;
    case "padre-mensaje-thread":
      contenido = <ParentMensajeThread />;
      break;
    case "padre-notificaciones":
      contenido = <ParentNotificaciones />;
      break;
    case "padre-vincular":
      contenido = <ParentVincularHijo />;
      break;
    case "maestro":
      contenido = <TeacherDashboard />;
      break;
    case "maestro-seccion":
      contenido = <TeacherSecciones />;
      break;
    case "maestro-estudiantes":
      contenido = <TeacherEstudiantes />;
      break;
    case "maestro-crear-tarea":
      contenido = <TeacherCrearTarea />;
      break;
    case "maestro-tareas":
      contenido = <TeacherTareas />;
      break;
    case "maestro-tarea-detalle":
      contenido = <TeacherTareaDetalle />;
      break;
    case "maestro-asistencia":
      contenido = <TeacherAsistencia />;
      break;
    case "maestro-reportes":
      contenido = <TeacherReportes />;
      break;
    case "maestro-reporte-estudiante":
      contenido = <TeacherReporteEstudiante />;
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
