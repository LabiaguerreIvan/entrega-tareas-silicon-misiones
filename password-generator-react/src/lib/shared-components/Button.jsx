const Button = ({ children, variant = "primary", onClick, disabled, type = "button" }) => {
  const variantClasses = {
    primary: "btn-primary",
    secondary: "btn-secondary",
    ghost: "btn-ghost",
  }

  return (
    <button
      className={variantClasses[variant]}
      onClick={onClick}
      disabled={disabled}
      type={type}
    >
      {children}
    </button>
  )
}

export default Button