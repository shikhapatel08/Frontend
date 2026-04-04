import { useContext } from "react";
import "./EditeProfile.css";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useFormik } from "formik";
import * as Yup from "yup";
import { setUserFromUpdate } from "../../Redux/Features/ProfileSlice";
import { UpdateUser } from "../../Redux/Features/UpdateProfileSlice";
import { toast } from "react-toastify";
import { BackbtnIcon } from "../../Components/Common Components/Icon/Icon";
import { useLayoutStyle } from "../../Components/Common Components/Common/CommonComponents";
import { ThemeContext } from "../../Context/ThemeContext";
import { SettingsSkeleton } from "../../Components/Common Components/Loader/PageSkeletons";


export default function ProfileSettings({ onBack, type }) {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const Signup = useSelector(state => state.signup.SignupUser);
  const Signin = useSelector(state => state.signin.SigninUser);
  const loading = useSelector((state) => state.updateprofile?.loading);

  const User = Object.keys(Signin).length > 0 ? Signin : Signup;
  const style = useLayoutStyle();
  const { getThemeStyle, theme } = useContext(ThemeContext);

  const validationSchema = Yup.object({
    name: Yup.string()
      .min(3, "Name must be at least 3 characters")
      .required("Name required"),

    email: Yup.string()
      .email("Invalid email")
      .required("Email required"),

    phone: Yup.string()
      .matches(/^[0-9]{10}$/, "Phone must be 10 digits")
      .required("Phone required"),
  });

  const OnSubmit = async (values) => {
    try {

      await dispatch(
        UpdateUser({
          type: "profile",
          data: values
        })
      ).unwrap();
      dispatch(setUserFromUpdate(values));
      toast.success("Profile updated successfully");
      navigate(`/ProfilePage`, { state: { from: 'Sidebar' } });

    } catch (err) {
      toast.error("Profile update failed");
    }
  }

  const formik = useFormik({
    initialValues: {
      name: User?.name || "",
      email: User?.email || "",
      phone: User?.phone || "",
    },
    validationSchema,

    onSubmit: OnSubmit
  });

  const renderError = (field) =>
    formik.touched[field] &&
    formik.errors[field] && (
      <div className="error">{formik.errors[field]}</div>
    );

  return (
    <div className="settings-container" style={{
      ...(type === "setting" ? {} : style),
      ...getThemeStyle(theme)
    }}     >
      <div className="title" style={getThemeStyle(theme)}>
        <span onClick={onBack} className="back-btn"><BackbtnIcon /></span>
        <span><h2 style={{
          marginTop: '13px',
          marginLeft: '24px'
        }}>Edit Profile</h2></span>
      </div>

      <div className="settings-form">
        {loading ? (
          <SettingsSkeleton count={4} />
        ) : (
          <div className="form-right">


            <form onSubmit={formik.handleSubmit}>
              <div className="form-group">
                <label>Name</label>
                <input name="name" value={formik.values.name} onChange={formik.handleChange} />
                {renderError("name")}
              </div>

              <div className="form-group">
                <label>Email</label>
                <input name="email" value={formik.values.email} disabled />
                {renderError("email")}
              </div>

              <div className="form-group">
                <label>Phone</label>
                <input name="phone" value={formik.values.phone} disabled />
                {renderError("phone")}
              </div>


              <button type="submit" className="btn view-profile" disabled={loading}>
                {loading ? "Saving..." : "Save Changes"}
              </button>
            </form>

          </div>
        )}
      </div>
    </div>

  );
}