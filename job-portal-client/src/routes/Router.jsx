import {createBrowserRouter} from "react-router-dom";
import App from "../App";
import HomePage from "../pages/home/HomePage";
import AboutPage from "../pages/about/AboutPage";
import CreateJobPage from "../pages/jobs/CreateJobPage";
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
          path: "/edit-job/:id",
          element: <UpdateJobPage/>,
          loader: ({params}) => {
            const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:5000";
            return fetch(`${apiUrl}/all-jobs/${params.id}`);
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
