import React from 'react';

const Dashboard = React.lazy(() => import('./views/dashboard/Dashboard'));
const PokList = React.lazy(() => import('./views/pok/PokList'));
const PokDetails = React.lazy(() => import('./views/pok/PokDetails'));
const PokUpload = React.lazy(() => import('./views/pok/PokUpload'));
const PokReferenceUpload = React.lazy(() => import('./views/pok/PokReferenceUpload'));
const JalanJembatan = React.lazy(() => import('./views/report/JalanJembatan'));
const Profile = React.lazy(() => import('./views/user/Profile'));
const UserManagement = React.lazy(() => import('./views/user/UserManagement'));
const ApprovalHierarchy = React.lazy(() => import('./views/user/ApprovalHierarchy'));
const ExecutiveSummary = React.lazy(() => import('./views/report/ExecutiveSummary'));
const PokDelete = React.lazy(() => import('./views/pok/PokDelete'));

const routes = [
  { path: '/', exact: true, name: 'Home' },
  { path: '/dashboard', name: 'Dashboard', component: Dashboard },
  { path: '/pok/list', name: 'POK List', component: PokList },
  { path: '/pok/details/:id', name: 'POK Details', component: PokDetails },
  { path: '/pok/upload', name: 'Create POK', component: PokUpload },
  { path: '/pok/upload-references', name: 'Update Reference', component: PokReferenceUpload },
  { path: '/report/ruas', name: 'Ruas Jalan & Jembatan', component: JalanJembatan },
  { path: '/user/profile', name: 'Profile', component: Profile },
  { path: '/user/manage', name: 'User Management', component: UserManagement },
  { path: '/user/approval-hierarchy', name: 'Approval Hierarchy', component: ApprovalHierarchy },
  { path: '/report/executive', name: 'Executive Summary', component: ExecutiveSummary }, 
  { path: '/pok/delete', name: 'Delete Data POK', component: PokDelete },
];

export default routes;
