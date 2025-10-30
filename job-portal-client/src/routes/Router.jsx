import {createBrowserRouter} from "react-router-dom";
import App from "../App";
import HomePage from "../pages/home/HomePage";
import AboutPage from "../pages/about/AboutPage";
import CreateJobPage from "../pages/jobs/CreateJobPage";
import MyJobsPage from "../pages/jobs/MyJobsPage";
import SalaryPage from "../pages/salary/SalaryPage";
import UpdateJobPage from "../pages/jobs/UpdateJobPage";
import LoginPage from "../pages/auth/LoginPage";
import JobDetailsPage from "../pages/jobs/JobDetailsPage";
import SignupPage from "../pages/auth/SignupPage";

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
          path: "/salary",
          element: <SalaryPage/>
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
        }

    ],
    },

    {
      path: "/login",
      element: <LoginPage/>
    },
    {
      path: "/sign-up",
      element: <SignupPage/>
    }

  ]);

  export default router;
