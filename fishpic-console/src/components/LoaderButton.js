import React from "react";
import { Button } from "react-bootstrap";
import Spinner from './Spinner';
import "./LoaderButton.css";

export default ({
  isLoading,
  text,
  loadingText,
  className = "",
  disabled = false,
  ...props
}) =>
  <Button
    className={`LoaderButton ${className}`}
    disabled={disabled || isLoading}
    {...props}
  >
    {isLoading && <Spinner />}
    {!isLoading ? text : loadingText}
  </Button>;