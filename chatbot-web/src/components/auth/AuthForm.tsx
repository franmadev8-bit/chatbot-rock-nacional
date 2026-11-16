import { LockOutlined, MailOutlined, UserOutlined } from '@ant-design/icons';
import { Alert, Button, Form, Input, Segmented, Typography } from 'antd';
import type { AuthFormValues, AuthMode } from '../../hooks/useLoginViewModel';
import { Brand } from '../brand/Brand';

interface AuthFormProps {
    mode: AuthMode;
    submitting: boolean;
    error: string | null;
    onModeChange: (mode: AuthMode) => void;
    onSubmit: (values: AuthFormValues) => void;
}

const MODE_OPTIONS = [
    { label: 'Ingresar', value: 'sign-in' },
    { label: 'Crear cuenta', value: 'sign-up' },
];

export function AuthForm({ mode, submitting, error, onModeChange, onSubmit }: AuthFormProps) {
    const isSignUp = mode === 'sign-up';

    return (
        <div className="auth-card">
            <Brand />

            <Typography.Title level={2} className="auth-card__title">
                {isSignUp ? 'Sumate' : 'Bienvenido'}
            </Typography.Title>
            <Typography.Paragraph type="secondary">
                {isSignUp ? 'Creá tu cuenta para guardar tus charlas.' : 'Ingresá para seguir donde lo dejaste.'}
            </Typography.Paragraph>

            <Segmented
                block
                options={MODE_OPTIONS}
                value={mode}
                onChange={(value) => onModeChange(value as AuthMode)}
                style={{ marginBottom: 24 }}
            />

            {error && <Alert type="error" title={error} showIcon style={{ marginBottom: 16 }} />}

            <Form<AuthFormValues> layout="vertical" requiredMark={false} onFinish={onSubmit} key={mode}>
                {isSignUp && (
                    <Form.Item name="name" label="Nombre" rules={[{ required: true, message: 'Ingresá tu nombre.' }]}>
                        <Input prefix={<UserOutlined />} size="large" autoComplete="name" />
                    </Form.Item>
                )}

                <Form.Item
                    name="email"
                    label="Email"
                    rules={[
                        { required: true, message: 'Ingresá tu email.' },
                        { type: 'email', message: 'Ese email no es válido.' },
                    ]}
                >
                    <Input prefix={<MailOutlined />} size="large" autoComplete="email" />
                </Form.Item>

                <Form.Item
                    name="password"
                    label="Contraseña"
                    rules={[
                        { required: true, message: 'Ingresá tu contraseña.' },
                        ...(isSignUp ? [{ min: 8, message: 'Usá al menos 8 caracteres.' }] : []),
                    ]}
                >
                    <Input.Password
                        prefix={<LockOutlined />}
                        size="large"
                        autoComplete={isSignUp ? 'new-password' : 'current-password'}
                    />
                </Form.Item>

                <Button type="primary" htmlType="submit" block loading={submitting} className="auth-card__submit">
                    {isSignUp ? 'Crear cuenta' : 'Ingresar'}
                </Button>
            </Form>
        </div>
    );
}
