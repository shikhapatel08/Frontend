import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
// import { useContext } from "react";
import Button from "../../Components/Button/Button";
import { Link, useNavigate } from "react-router-dom";
import '../SignIn/SignIn.css'
import login from '../../assets/login.jpg'
import { useDispatch, useSelector } from "react-redux";
import { FetchUser } from "../../Redux/Features/SignInSlice";
import { toast } from "react-toastify";
import { SendOtp } from "../../Redux/Features/OtpSlice";

const Signin = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const { loading } = useSelector(state => state.signin);


    // ---------------- INITIAL VALUES ----------------

    const initialValues = {
        email: "",
        password: "",
    };

    // ---------------- VALIDATION ----------------

    const validationSchema = Yup.object({
        email: Yup.string()
            .email("Invalid email format")
            .required("Email is required"),
        password: Yup.string()
            .min(6, "Password must be at least 6 characters")
            .matches(/[a-z]/, "Must contain at least one lowercase letter")
            .matches(/[A-Z]/, "Must contain at least one uppercase letter")
            .matches(/[0-9]/, "Must contain at least one number")
            .required("Password is required"),
    });

    // ---------------- LOGIN ----------------

    const handleSubmit = async (values) => {

        try {

            await dispatch(FetchUser(values)).unwrap();

            toast.success("Welcome back!");
            navigate("/MessagePage");

        } catch (err) {

            console.log("LOGIN ERROR", err);

            if (err?.status === 404) {
                toast.error("User doesn't exist");
            }
            else if (
                err?.status === 400 ||
                err?.message?.includes("Invalid")
            ) {
                toast.error("Please verify your Email or Password!");
            }
            else if (
                err?.message === "Network Error" ||
                err?.status >= 500
            ) {
                toast.error("Server error. Please try again later");
            }
            else {
                toast.error("Something went wrong");
            }
        }
    };

    // ---------------- FORGOT PASSWORD ----------------

    const handleForgotPassword = (values) => {

        if (!values.email) {
            toast.error("Enter email first");
            return;
        }

        dispatch(SendOtp({
            email: values.email,
            action: "forgot_password"
        }));

        navigate("/OtpPage", {
            state: {
                email: values.email,
                from: "forgot_password",
                action: "forgot_password"
            }
        });
    }

    // if (loading) {
    //     <div class="loader"></div>
    // }


    return (
        // ================================= SignIn Page ================================= //
        <div className="Signin">
            <div className="signin-conainer">
                <div className="Signin-left">
                    <img
                        src={login}
                        alt="login"
                    />
                </div>
                <div className="auth-box" >
                    <div className="auth-card">
                        <h2 style={{ color: 'black' }}>Sign In</h2>

                        <Formik
                            initialValues={initialValues}
                            validationSchema={validationSchema}
                            onSubmit={handleSubmit}
                        >
                            {({ values }) => (
                                <Form>
                                    <Field type="email" name="email" placeholder="Email" />
                                    <ErrorMessage name="email" component="span" className="error" />

                                    <div className="password-field">
                                        <Field
                                            type={'password'}
                                            name="password"
                                            placeholder="Password"
                                        />
                                    </div>
                                    <ErrorMessage name="password" component="span" className="error" />
                                    <span
                                        className="Forgot-pass"
                                        style={{ color: "blue" }}
                                        onClick={() => {
                                            handleForgotPassword(values)
                                        }}
                                    >
                                        Forgot Password?
                                    </span>
                                    <br></br>
                                    <Button type="submit" className='signin-btn' disable={loading}>SignIn</Button>
                                    <div className="login-footer">
                                        <span className="login-text">
                                            Don't have an account?
                                            <Link to='/signup' className="login-link" >SignUp</Link>
                                        </span>
                                    </div>
                                </Form>
                            )}
                        </Formik>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Signin;
