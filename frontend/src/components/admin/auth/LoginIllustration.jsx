import { Lottie } from "lottie-react";

import './LoginIllustration.css'

import lottieAnim from '@/animations/hvac.json';


function LoginIllustration() {
    return (
        <aside className="login-illustration-panel" aria-hidden="true">
            <div className="login-illustration-bg">
                <span className="login-dot-grid" />
                <span className="login-gradient-orb login-gradient-orb--one" />
                <span className="login-gradient-orb login-gradient-orb--two" />
            </div>

            <div className="login-illustration-content">
                <h2>Fűts vagy hűts, mi gondoskodunk róla!</h2>
                <p className="login-illustration-text">
                    Professzionális klímatelepítés, karbantartás és szerviz Pátyodon és környékén.
                </p>

                <div className="login-lottie-wrapper">
                    <Lottie src={lottieAnim} autoplay loop />
                </div>
            </div>
        </aside>
    );
}

export default LoginIllustration;