export default function auth({ next, router }) {
    if (!localStorage.getItem("bring_admin_dashboard_user_token")) {
        return router.push("/");
    }
    return next();
}
