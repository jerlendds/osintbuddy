// Dashboard Route Imports
import Dashboard from '../views/dashboard/Dashboard.vue';

import SideNavbar from '@/components/navs/SideNavbar';


const dashboardRoutes = [
    {
        path: '/dashboard',
        name: 'Dashboard',
        components: {
            default: Dashboard,
            footer: SideNavbar,
        },
    },
];

export default dashboardRoutes;