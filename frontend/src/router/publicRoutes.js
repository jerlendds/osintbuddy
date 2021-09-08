import Home from "@/views/public/Home";
import PublicNavbar from "@/components/navs/PublicNavbar";
import PublicFooter from "@/components/PublicFooter";
import Guides from "@/views/public/Guides";
import Support from "@/views/public/Support";
import Pricing from "@/views/public/Pricing";
import Register from "@/views/public/Register";
import Login from "@/views/public/Login";

const publicRoutes = [
    {
        path: '/',
        name: 'Home',
        components: {
            default: Home,
            header: PublicNavbar,
            footer: PublicFooter,
        },
    },
    {
        path: '/guides',
        name: 'Guides',
        components: {
            default: Guides,
            header: PublicNavbar,
            footer: PublicFooter,
        },
    },

    {
        path: '/support',
        name: 'Support',
        components: {
            default: Support,
            header: PublicNavbar,
            footer: PublicFooter,
        },
    },
    {
        path: '/pricing',
        name: 'Pricing',
        components: {
            default: Pricing,
            header: PublicNavbar,
            footer: PublicFooter,
        },
    },
    {
        path: '/register',
        name: 'Register',
        components: {
            default: Register,
            header: PublicNavbar,
            footer: PublicFooter,
        },
    },
    {
        path: '/login',
        name: 'Login',
        components: {
            default: Login,
            header: PublicNavbar,
            footer: PublicFooter,
        },
    },
];

export default publicRoutes;