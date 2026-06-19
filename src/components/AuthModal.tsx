import * as React from "react";
import { X, Eye, EyeOff, Loader2, CheckCircle2, Mail, Lock, User } from "lucide-react";
import { useAuth } from "@/lib/auth";
import { supabase } from "@/lib/supabase";

/* ─────────────────────────────────────────
   Tiny reusable input with floating label
───────────────────────────────────────── */
function AuthInput({
  id,
  type = "text",
  label,
  value,
  onChange,
  icon: Icon,
  error,
  required,
}: {
  id: string;
  type?: string;
  label: string;
  value: string;
  onChange: (v: string) => void;
  icon?: React.ElementType;
  error?: string;
  required?: boolean;
}) {
  const [show, setShow] = React.useState(false);
  const inputType = type === "password" ? (show ? "text" : "password") : type;

  return (
    <div className="auth-field">
      <div className={`auth-input-wrap ${error ? "auth-input-wrap--error" : ""}`}>
        {Icon && (
          <span className="auth-input-icon">
            <Icon size={15} />
          </span>
        )}
        <input
          id={id}
          type={inputType}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder=" "
          required={required}
          className={`auth-input ${Icon ? "auth-input--icon" : ""}`}
        />
        <label htmlFor={id} className={`auth-label ${Icon ? "auth-label--icon" : ""}`}>
          {label}
        </label>
        {type === "password" && (
          <button
            type="button"
            onClick={() => setShow((s) => !s)}
            className="auth-pw-toggle"
            tabIndex={-1}
          >
            {show ? <EyeOff size={14} /> : <Eye size={14} />}
          </button>
        )}
      </div>
      {error && <p className="auth-field-error">{error}</p>}
    </div>
  );
}

/* ─────────────────────────────────────────
   Main Auth Modal
───────────────────────────────────────── */
export function AuthModal() {
  const { authModalOpen, closeAuthModal, authModalTab, signIn, signUp, user, signOut } = useAuth();

  const [tab, setTab] = React.useState<"login" | "signup">(authModalTab);
  const [loading, setLoading] = React.useState(false);
  const [success, setSuccess] = React.useState<string | null>(null);
  const [globalError, setGlobalError] = React.useState<string | null>(null);
  const [forgotMode, setForgotMode] = React.useState(false);
  const [forgotLoading, setForgotLoading] = React.useState(false);

  // Login form state
  const [loginEmail, setLoginEmail] = React.useState("");
  const [loginPassword, setLoginPassword] = React.useState("");
  const [loginErrors, setLoginErrors] = React.useState<{ email?: string; password?: string }>({});

  // Signup form state
  const [signupName, setSignupName] = React.useState("");
  const [signupEmail, setSignupEmail] = React.useState("");
  const [signupPassword, setSignupPassword] = React.useState("");
  const [signupConfirm, setSignupConfirm] = React.useState("");
  const [signupErrors, setSignupErrors] = React.useState<{
    name?: string; email?: string; password?: string; confirm?: string;
  }>({});

  // Sync tab when prop changes
  React.useEffect(() => { setTab(authModalTab); }, [authModalTab]);

  // Reset state on close
  React.useEffect(() => {
    if (!authModalOpen) {
      setTimeout(() => {
        setLoginEmail(""); setLoginPassword("");
        setSignupName(""); setSignupEmail(""); setSignupPassword(""); setSignupConfirm("");
        setLoginErrors({}); setSignupErrors({});
        setGlobalError(null); setSuccess(null); setLoading(false);
        setForgotMode(false); setForgotLoading(false);
      }, 300);
    }
  }, [authModalOpen]);

  // Trap focus & close on Escape (only if user is logged in)
  React.useEffect(() => {
    if (!authModalOpen || !user) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") closeAuthModal(); };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [authModalOpen, closeAuthModal, user]);

  /* ── Validators ── */
  function validateLogin() {
    const errs: typeof loginErrors = {};
    if (!loginEmail.trim()) errs.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(loginEmail)) errs.email = "Invalid email";
    if (!loginPassword) errs.password = "Password is required";
    setLoginErrors(errs);
    return Object.keys(errs).length === 0;
  }

  function validateSignup() {
    const errs: typeof signupErrors = {};
    if (!signupName.trim()) errs.name = "Full name is required";
    if (!signupEmail.trim()) errs.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(signupEmail)) errs.email = "Invalid email";
    if (!signupPassword) errs.password = "Password is required";
    else if (signupPassword.length < 6) errs.password = "At least 6 characters";
    if (!signupConfirm) errs.confirm = "Please confirm your password";
    else if (signupConfirm !== signupPassword) errs.confirm = "Passwords do not match";
    setSignupErrors(errs);
    return Object.keys(errs).length === 0;
  }

  /* ── Handlers ── */
  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setGlobalError(null);
    if (!validateLogin()) return;
    setLoading(true);
    const { error } = await signIn(loginEmail, loginPassword);
    setLoading(false);
    if (error) { setGlobalError(error); return; }
    setSuccess("Welcome back! You're now signed in.");
    setTimeout(() => closeAuthModal(), 1500);
  }

  async function handleSignup(e: React.FormEvent) {
    e.preventDefault();
    setGlobalError(null);
    if (!validateSignup()) return;
    setLoading(true);
    const { error } = await signUp(signupEmail, signupPassword, signupName);
    setLoading(false);
    if (error) { setGlobalError(error); return; }
    setSuccess("Account created! Please check your email to confirm your account.");
  }

  async function handleForgotPassword(e: React.FormEvent) {
    e.preventDefault();
    setGlobalError(null);
    if (!loginEmail.trim() || !/\S+@\S+\.\S+/.test(loginEmail)) {
      setLoginErrors({ email: "Enter a valid email address" });
      return;
    }
    setForgotLoading(true);
    const { error } = await supabase.auth.resetPasswordForEmail(loginEmail, {
      redirectTo: window.location.origin + "/reset-password",
    });
    setForgotLoading(false);
    if (error) { setGlobalError(error.message); return; }
    setSuccess("Password reset email sent! Check your inbox.");
    setForgotMode(false);
  }

  async function handleSignOut() {
    await signOut();
    closeAuthModal();
  }

  if (!authModalOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="auth-backdrop"
        onClick={() => {
          if (user) closeAuthModal();
        }}
        aria-hidden="true"
      />

      {/* Modal */}
      <div
        className="auth-modal"
        role="dialog"
        aria-modal="true"
        aria-label={user ? "Account" : tab === "login" ? "Sign in" : "Create account"}
      >
        {/* Close */}
        {user && (
          <button className="auth-close" onClick={closeAuthModal} aria-label="Close">
            <X size={18} />
          </button>
        )}

        {/* ── Logged-in state ── */}
        {user ? (
          <div className="auth-logged-in">
            <div className="auth-avatar">
              {user.user_metadata?.full_name?.[0]?.toUpperCase() ||
               user.email?.[0]?.toUpperCase() || "U"}
            </div>
            <h2 className="auth-heading">
              {user.user_metadata?.full_name || "Welcome back"}
            </h2>
            <p className="auth-sub">{user.email}</p>
            <div className="auth-divider" />
            <button className="auth-btn-outline" onClick={handleSignOut}>
              Sign out
            </button>
          </div>
        ) : (
          <>
            {/* Header */}
            <div className="auth-header">
              <div className="auth-logo">JB</div>
              <h2 className="auth-heading">
                {tab === "login" ? "Welcome back" : "Create account"}
              </h2>
              <p className="auth-sub">
                {tab === "login"
                  ? "Sign in to access your wishlist, orders, and more."
                  : "Join JB Hairmpire for exclusive access and offers."}
              </p>
            </div>

            {/* Tabs */}
            <div className="auth-tabs" role="tablist">
              <button
                role="tab"
                aria-selected={tab === "login"}
                className={`auth-tab ${tab === "login" ? "auth-tab--active" : ""}`}
                onClick={() => { setTab("login"); setGlobalError(null); setSuccess(null); }}
              >
                Sign In
              </button>
              <button
                role="tab"
                aria-selected={tab === "signup"}
                className={`auth-tab ${tab === "signup" ? "auth-tab--active" : ""}`}
                onClick={() => { setTab("signup"); setGlobalError(null); setSuccess(null); }}
              >
                Sign Up
              </button>
              <span
                className="auth-tab-indicator"
                style={{ transform: `translateX(${tab === "login" ? "0%" : "100%"})` }}
              />
            </div>

            {/* Success Banner */}
            {success && (
              <div className="auth-success">
                <CheckCircle2 size={16} />
                <span>{success}</span>
              </div>
            )}

            {/* Error Banner */}
            {globalError && (
              <div className="auth-error-banner">
                <span>{globalError}</span>
              </div>
            )}

            {/* ── LOGIN FORM ── */}
            {tab === "login" && !forgotMode && (
              <form onSubmit={handleLogin} className="auth-form" noValidate>
                <AuthInput
                  id="login-email"
                  type="email"
                  label="Email address"
                  value={loginEmail}
                  onChange={setLoginEmail}
                  icon={Mail}
                  error={loginErrors.email}
                  required
                />
                <AuthInput
                  id="login-password"
                  type="password"
                  label="Password"
                  value={loginPassword}
                  onChange={setLoginPassword}
                  icon={Lock}
                  error={loginErrors.password}
                  required
                />
                <div className="auth-forgot-row">
                  <button
                    type="button"
                    className="auth-forgot-link"
                    onClick={() => { setForgotMode(true); setGlobalError(null); setLoginErrors({}); }}
                  >
                    Forgot password?
                  </button>
                </div>
                <button type="submit" className="auth-btn-primary" disabled={loading}>
                  {loading ? <Loader2 size={16} className="auth-spinner" /> : null}
                  {loading ? "Signing in…" : "Sign In"}
                </button>
                <p className="auth-switch">
                  Don't have an account?{" "}
                  <button type="button" onClick={() => setTab("signup")}>Create one</button>
                </p>
              </form>
            )}

            {/* ── FORGOT PASSWORD FORM ── */}
            {tab === "login" && forgotMode && (
              <form onSubmit={handleForgotPassword} className="auth-form" noValidate>
                <p className="auth-sub" style={{ marginBottom: "0.75rem" }}>
                  Enter your email and we'll send you a reset link.
                </p>
                <AuthInput
                  id="forgot-email"
                  type="email"
                  label="Email address"
                  value={loginEmail}
                  onChange={setLoginEmail}
                  icon={Mail}
                  error={loginErrors.email}
                  required
                />
                <button type="submit" className="auth-btn-primary" disabled={forgotLoading}>
                  {forgotLoading ? <Loader2 size={16} className="auth-spinner" /> : null}
                  {forgotLoading ? "Sending…" : "Send Reset Link"}
                </button>
                <p className="auth-switch">
                  <button type="button" onClick={() => { setForgotMode(false); setLoginErrors({}); }}>
                    ← Back to sign in
                  </button>
                </p>
              </form>
            )}

            {/* ── SIGNUP FORM ── */}
            {tab === "signup" && (
              <form onSubmit={handleSignup} className="auth-form" noValidate>
                <AuthInput
                  id="signup-name"
                  label="Full name"
                  value={signupName}
                  onChange={setSignupName}
                  icon={User}
                  error={signupErrors.name}
                  required
                />
                <AuthInput
                  id="signup-email"
                  type="email"
                  label="Email address"
                  value={signupEmail}
                  onChange={setSignupEmail}
                  icon={Mail}
                  error={signupErrors.email}
                  required
                />
                <AuthInput
                  id="signup-password"
                  type="password"
                  label="Password"
                  value={signupPassword}
                  onChange={setSignupPassword}
                  icon={Lock}
                  error={signupErrors.password}
                  required
                />
                <AuthInput
                  id="signup-confirm"
                  type="password"
                  label="Confirm password"
                  value={signupConfirm}
                  onChange={setSignupConfirm}
                  icon={Lock}
                  error={signupErrors.confirm}
                  required
                />
                <button type="submit" className="auth-btn-primary" disabled={loading}>
                  {loading ? <Loader2 size={16} className="auth-spinner" /> : null}
                  {loading ? "Creating account…" : "Create Account"}
                </button>
                <p className="auth-switch">
                  Already have an account?{" "}
                  <button type="button" onClick={() => setTab("login")}>Sign in</button>
                </p>
              </form>
            )}
          </>
        )}
      </div>
    </>
  );
}
