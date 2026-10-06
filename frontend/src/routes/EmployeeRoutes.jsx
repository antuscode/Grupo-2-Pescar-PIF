import React from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import { AppShell } from '../components/app/AppShell';
import { Dashboard } from '../pages/employee/Dashboard';
import { TaskList } from '../pages/employee/TaskList';
import { NewTask } from '../pages/employee/NewTask';
import { TaskDetail } from '../pages/employee/TaskDetail';
import { Recognitions } from '../pages/employee/Recognitions';
import { Achievements } from '../pages/employee/Achievements';
import { Profile } from '../pages/employee/Profile';
import { EditEmail } from '../pages/employee/EditEmail';
import { Calendar } from '../pages/employee/Calendar';
import { Lumi } from '../pages/employee/Lumi';

// Espacio del empleado (/app/*). Se descarga solo cuando alguien entra acá.
export default function EmployeeRoutes() {
  return (
    <Routes>
      <Route element={<AppShell variant="employee" />}>
        <Route index element={<Dashboard />} />
        <Route path="tareas" element={<TaskList />} />
        <Route path="tareas/nueva" element={<NewTask />} />
        <Route path="tareas/:taskId" element={<TaskDetail />} />
        <Route path="reconocimientos" element={<Recognitions />} />
        <Route path="logros" element={<Achievements />} />
        <Route path="perfil" element={<Profile />} />
        <Route path="perfil/email" element={<EditEmail />} />
        <Route path="calendario" element={<Calendar />} />
        <Route path="lumi" element={<Lumi />} />
        <Route path="*" element={<Navigate to="/app" replace />} />
      </Route>
    </Routes>);

}
