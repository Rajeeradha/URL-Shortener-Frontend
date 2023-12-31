import React, { useState } from "react";
import { useFormik } from "formik";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import { env } from "../../config";
import load from "../../asset/loading4.svg";
import Swal from 'sweetalert2';

function ForgotPasswordPage() {
  const params = useParams();
  let [loading, setloading] = useState(false);
  let navigate = useNavigate();


    //Alert function;
    const Toast = Swal.mixin({
      toast: true,
      position: 'top-end',
      showConfirmButton: false,
      timer: 2000,
      timerProgressBar: true,
      didOpen: (toast) => {
          toast.addEventListener('mouseenter', Swal.stopTimer)
          toast.addEventListener('mouseleave', Swal.resumeTimer)
      }
  })

  const formik = useFormik({
    initialValues: {
      password: "",
      confirmPassword: "",
    },
    validate: (values) => {
      const errors = {};
      if (values.password.length === 0) {
        errors.password = "Enter your passowrd";
      } else if (values.password.search(/[a-z]/i) < 0) {
        errors.password = "Your password must contain at least one letter";
      } else if (values.password.search(/[0-9]/) < 0) {
        errors.password = "Your password must contain at least one digit";
      } else if (values.password.length < 8) {
        errors.password = "Your password must be at least 8 characters";
      }
      if (values.confirmPassword !== values.password) {
        errors.confirmPassword = "Conform password does not match";
      } else if (values.confirmPassword.length === 0) {
        errors.confirmPassword = "Enter your conform password";
      }
      return errors;
    },

    onSubmit: async (values) => {
      try {
        delete values.confirmPassword;
        values.id = params.id;
        values.token = params.token;
        setloading(true);
        let user = await axios.post(
          `${env.api}/password-reset-page`,
          values
        );

        if (user.data.statusCode === 200) {
          setloading(false);
          Toast.fire({ icon: 'success', title: user.data.message })
            navigate("/");
        }else{
          setloading(false);
          Toast.fire({ icon: 'error', title: user.data.message })
        }
       
      } catch (error) {
        console.log(error);
      }
    },
  });
  return (
    <div className="login-wrapper">
      <form
        className="form"
        onSubmit={(values) => {
          formik.handleSubmit(values);
        }}
      >
        <h2>Password Reset Form</h2>
        <div className="input-group">
          <input
            type="password"
            id="password"
            required
            value={formik.values.password}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            name="password"
          />
          <label for="password">Password</label>
        </div>
        {formik.touched.password && formik.errors.password ? (
          <div className="error"> {formik.errors.password}</div>
        ) : null}

        <div className="input-group">
          <input
            type="password"
            id="confirmPassword"
            required
            value={formik.values.confirmPassword}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            name="confirmPassword"
          />
          <label for="password">Conform Password</label>
        </div>
        {formik.touched.confirmPassword && formik.errors.confirmPassword ? (
          <div className="error"> {formik.errors.confirmPassword}</div>
        ) : null}
        <button type="submit" className="submit-btn" disabled={!formik.isValid}>
          {loading ? (
            <img src={load} alt="load" className="spinner" />
          ) : (
            " Change Password "
          )}
        </button>
        <div className="mt-3 log">
          <span onClick={() => navigate("/")}>Back to login</span>
        </div>
      </form>
    </div>
  );
}

export default ForgotPasswordPage;
