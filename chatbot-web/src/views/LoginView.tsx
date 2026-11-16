import { AuthForm } from '../components/auth/AuthForm';
import { VinylRecord } from '../components/brand/VinylRecord';
import { useLoginViewModel } from '../hooks/useLoginViewModel';

const BANDS = ['Los Redondos', 'Sumo', 'V8', 'Hermética', 'Ricardo Iorio', 'Viejas Locas', 'Intoxicados', 'Flema'];

export function LoginView() {
    const { mode, changeMode, submitting, error, submit } = useLoginViewModel();

    return (
        <div className="login-view">
            <section className="login-view__poster">
                <VinylRecord />

                <h1 className="login-view__headline">
                    Rock<br />
                    Nacional<br />
                    <span>IA</span>
                </h1>
                <p className="login-view__tagline">
                    Preguntale a la máquina por las bandas que hicieron historia.
                </p>
                <p className="login-view__bands">{BANDS.join(' · ')}</p>
            </section>

            <section className="login-view__form">
                <AuthForm
                    mode={mode}
                    submitting={submitting}
                    error={error}
                    onModeChange={changeMode}
                    onSubmit={(values) => void submit(values)}
                />
            </section>
        </div>
    );
}
