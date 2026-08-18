import { useState } from 'react';
import { Navigate, useLocation, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';

import { Eye, EyeOff, KeyRound, Mail } from 'lucide-react';

import './Login.css';

import patyodklimaLogo from '@/assets/images/logo.avif';
import { useAuth } from '@/context/AuthContext';
import LoginIllustration from '@/components/admin/auth/LoginIllustration';


function Login() {
    const navigate = useNavigate();
    const location = useLocation();
    const { login, isAuthenticated, isLoading } = useAuth();

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [rememberMe, setRememberMe] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const redirectPath = location.state?.from || '/admin';

    if (!isLoading && isAuthenticated) {
        return <Navigate to={redirectPath} replace />;
    }

    const handleSubmit = async (event) => {
        event.preventDefault();
        setError('');
        setIsSubmitting(true);

        try {
            await login({ email, password, rememberMe });
            navigate(redirectPath, { replace: true });
        } catch (submitError) {
            setError(submitError.message);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="login-page">
            <Helmet>
                <title>Bejelentkezés | Pátyod Klíma Admin</title>
                <meta name="robots" content="noindex, nofollow" />
            </Helmet>

            <section className="login-form-panel">
                <div className="login-form-inner">
                    <img
                        src={patyodklimaLogo}
                        alt="Pátyod Klíma logó"
                        className="login-logo"
                    />

                    <div className="login-heading">
                        <h1>Bejelentkezés</h1>
                        <p>Admin felület eléréséhez jelentkezz be.</p>
                    </div>

                    <form className="login-form" onSubmit={handleSubmit} noValidate>
                        <label htmlFor="login-email">E-mail</label>
                        <div className="login-input-wrapper">
                            <Mail size={18} className="login-input-icon" aria-hidden="true" />
                            <input
                                id="login-email"
                                type="email"
                                value={email}
                                onChange={(event) => setEmail(event.target.value)}
                                placeholder="pelda@patyodklima.hu"
                                autoComplete="email"
                                required
                            />
                        </div>

                        <label htmlFor="login-password">Jelszó</label>
                        <div className="login-input-wrapper">
                            <KeyRound size={18} className="login-input-icon" aria-hidden="true" />
                            <input
                                id="login-password"
                                type={showPassword ? 'text' : 'password'}
                                value={password}
                                onChange={(event) => setPassword(event.target.value)}
                                placeholder="••••••••"
                                autoComplete="current-password"
                                required
                            />
                            <button
                                type="button"
                                className="login-password-toggle"
                                onClick={() => setShowPassword((prev) => !prev)}
                                aria-label={showPassword ? 'Jelszó elrejtése' : 'Jelszó megjelenítése'}
                            >
                                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                            </button>
                        </div>

                        <label className="login-remember">
                            <input
                                type="checkbox"
                                checked={rememberMe}
                                onChange={(event) => setRememberMe(event.target.checked)}
                            />
                            <span>
                                Emlékezz rám
                                <small>Mentsd el a bejelentkezési adataimat legközelebbre.</small>
                            </span>
                        </label>

                        {error && <p className="login-error">{error}</p>}

                        <button type="submit" className="login-submit-btn" disabled={isSubmitting || isLoading}>
                            {isSubmitting ? 'Bejelentkezés...' : 'Bejelentkezés'}
                        </button>
                    </form>

                    <p className="login-copyright">
                        Pátyod Klíma © 2026 | Minden jog fenntartva!
                    </p>
                </div>
            </section>

            <LoginIllustration />
        </div>
    );
}

export default Login;