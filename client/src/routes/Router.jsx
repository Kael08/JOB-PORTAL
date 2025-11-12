import {createBrowserRouter} from "react-router-dom";
import App from "../App";
import HomePage from "../pages/home/HomePage";
import AboutPage from "../pages/about/AboutPage";
import CreateJobPage from "../pages/jobs/CreateJobPage";
import MyJobsPage from "../pages/jobs/MyJobsPage";
import UpdateJobPage from "../pages/jobs/UpdateJobPage";
import LoginPage from "../pages/auth/LoginPage";
import JobDetailsPage from "../pages/jobs/JobDetailsPage";
import ProfilePage from "../pages/profile/ProfilePage";

const router = createBrowserRouter([
    {
      path: "/",
      element: <App/>,
      children: [
        {path: "/", element: <HomePage/>},
        {
          path: "/post-job",
          element: <CreateJobPage/>
        },
        {
          path: "/my-job",
          element: <MyJobsPage/>
        },
        {
          path: "/edit-job/:id",
          element: <UpdateJobPage/>,
          loader: async ({params}) => {
            const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:5000";
            const response = await fetch(`${apiUrl}/all-jobs/${params.id}`);
            if (!response.ok) {
              throw new Response("Not Found", { status: 404 });
            }
            const data = await response.json();
            // Обрабатываем ответ - может быть объект или массив
            return Array.isArray(data) ? data[0] : data;
          }
        },
        {
          path: "/job/:id",
          element: <JobDetailsPage/>
        },
        {
          path: "/profile",
          element: <ProfilePage/>
        },
        {
          path: "/about",
          element: <AboutPage/>
        }

    ],
    },

    {
      path: "/login",
      element: <LoginPage/>
    }

  ]);

  export default router;
